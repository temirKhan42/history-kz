import _ from 'lodash';
import HttpErrors from 'http-errors';
import { fileURLToPath } from 'url';
import path from 'path';
import * as fs from 'fs/promises';

// eslint-disable-next-line no-underscore-dangle
const __filename = fileURLToPath(import.meta.url);
// eslint-disable-next-line no-underscore-dangle
const __dirname = path.dirname(__filename);

const readfile = async (fileNum) => {
  let filehandle;
  try {
    const filePath = path.join(__dirname, `../src/data/chapter${fileNum}.html`);
    filehandle = await fs.open(filePath, 'r');
    const file = await filehandle.readFile('utf-8');
    return file;
  } catch (err) {
    console.error(err);
  } finally {
    await filehandle?.close();
  }
}

const { Unauthorized, Conflict } = HttpErrors;

const getNextId = () => Number(_.uniqueId());

const buildState = () => {
  const state = {
    users: [
      { id: 1, email: 'admin@admin', password: 'admin', username: 'admin' },
    ],
  };

  return state;
};

export default (app, defaultState = {}) => {
  const state = buildState(defaultState);

  // app.io.on('connect', (socket) => {
  //   console.log({ 'socket.id': socket.id });

  //   socket.on('newMessage', (message, acknowledge = _.noop) => {
  //     const messageWithId = {
  //       ...message,
  //       id: getNextId(),
  //     };
  //     state.messages.push(messageWithId);
  //     acknowledge({ status: 'ok' });
  //     app.io.emit('newMessage', messageWithId);
  //   });

  //   socket.on('newChannel', (channel, acknowledge = _.noop) => {
  //     const channelWithId = {
  //       ...channel,
  //       removable: true,
  //       id: getNextId(),
  //     };
  //     state.channels.push(channelWithId);
  //     acknowledge({ status: 'ok', data: channelWithId });
  //     app.io.emit('newChannel', channelWithId);
  //   });

  //   socket.on('removeChannel', ({ id }, acknowledge = _.noop) => {
  //     const channelId = Number(id);
  //     state.channels = state.channels.filter((c) => c.id !== channelId);
  //     state.messages = state.messages.filter((m) => m.channelId !== channelId);
  //     const data = { id: channelId };

  //     acknowledge({ status: 'ok' });
  //     app.io.emit('removeChannel', data);
  //   });

  //   socket.on('renameChannel', ({ id, name }, acknowledge = _.noop) => {
  //     const channelId = Number(id);
  //     const channel = state.channels.find((c) => c.id === channelId);
  //     if (!channel) return;
  //     channel.name = name;

  //     acknowledge({ status: 'ok' });
  //     app.io.emit('renameChannel', channel);
  //   });
  // });

  app.post('/api/v1/login', async (req, reply) => {
    const email = _.get(req, 'body.email');
    const password = _.get(req, 'body.password');
    const user = state.users.find((u) => u.email === email);

    if (!user || user.password !== password) {
      reply.send(new Unauthorized());
      return;
    }

    const username = user.username;
    const token = app.jwt.sign({ userId: user.id });
    reply.send({ token, username, email });
  });

  app.post('/api/v1/signup', async (req, reply) => {
    const email = _.get(req, 'body.email');
    const username = _.get(req, 'body.username');
    const password = _.get(req, 'body.password');
    const user = state.users.find((u) => u.email === email);

    if (user) {
      reply.send(new Conflict());
      return;
    }

    const newUser = { id: getNextId(), email, username, password };
    const token = app.jwt.sign({ userId: newUser.id });
    state.users.push(newUser);
    reply
      .code(201)
      .header('Content-Type', 'application/json; charset=utf-8')
      .send({ token, username, email });
  });

  app.post('/api/v1/text', async (req, reply) => {
    const chapterNum = _.get(req, 'body.chapterNum');
    const file = await readfile(chapterNum);
    reply.send({ file: file ? file : '' });
  });

  app.get('/api/v1/data', { preValidation: [app.authenticate] }, (req, reply) => {
    const user = state.users.find(({ id }) => id === req.user.userId);

    if (!user) {
      reply.send(new Unauthorized());
      return;
    }

    reply
      .header('Content-Type', 'application/json; charset=utf-8')
      .send(_.omit(state, 'users'));
  });

  app.get('*', (_req, reply) => {
    reply.view('index.pug');
  });
};
