import _ from 'lodash';
import HttpErrors from 'http-errors';
import { fileURLToPath } from 'url';
import path from 'path';
import * as fs from 'fs/promises';

// eslint-disable-next-line no-underscore-dangle
const __filename = fileURLToPath(import.meta.url);
// eslint-disable-next-line no-underscore-dangle
const __dirname = path.dirname(__filename);

const getNextId = () => Number(_.uniqueId());

const readfile = async (fileNum) => {
  let filehandle;
  try {
    const filePath = path.join(__dirname, `data/chapters/${fileNum}.html`);
    filehandle = await fs.open(filePath, 'r');
    const file = await filehandle.readFile('utf-8');
    return file;
  } catch (err) {
    console.error(err);
  } finally {
    await filehandle?.close();
  }
}

const fetchTests = async () => {
  let filehandle;
  try {
    const filePath = path.join(__dirname, `data/tests/test.txt`);
    filehandle = await fs.open(filePath, 'r');
    const file = await filehandle.readFile('utf-8');
    return file;
  } catch (err) {
    console.error(err);
  } finally {
    await filehandle?.close();
  }
}

const getTests = async (testsStr) => {
  return testsStr.split('\n\n').map((q) => {
    const questionParts = q.split('\n');
    const leng = questionParts.length;
    const rightAnswerNum = parseInt(questionParts[leng - 1]);
    const chapterNum = parseInt(questionParts[leng - 2]);
    const question = questionParts[0];
    const answers = questionParts.slice(1, -2).map((answer, index) => {
      return {
        answer,
        id: getNextId(),
        isCorrect: rightAnswerNum === (index + 1)
      }
    });

    return {
      question,
      id: getNextId(),
      chapterNum,
      chapterId: 0,
      answers,
      everAnswered: false,
      howLastTimeAnswered: '',
    }
  })
}

const { Unauthorized, Conflict } = HttpErrors;

const buildState = async () => {
  const buildTest = async () => {
    const testsStr = await fetchTests();
    const tests = getTests(testsStr);
    return tests;
  };
  
  const tests = await buildTest();

  const state = {
    users: [
      {
        id: 1, 
        email: 'admin@admin', 
        password: 'admin', 
        username: 'admin',
        tests,
      },
    ],
  };

  return state;
};

export default async (app, defaultState = {}) => {
  const state = await buildState(defaultState);

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
    reply.send({ token, username, email, id: user.id });
  });

  app.post('/api/v1/signup', async (req, reply) => {
    const email = _.get(req, 'body.email');
    const username = _.get(req, 'body.username');
    const password = _.get(req, 'body.password');
    const user = state.users.find((u) => u.email === email);
    const testsStr = await fetchTests();
    const tests = getTests(testsStr);

    if (user) {
      reply.send(new Conflict());
      return;
    }

    const newUser = { id: getNextId(), email, username, password, tests };
    const token = app.jwt.sign({ userId: newUser.id });
    state.users.push(newUser);
    reply
      .code(201)
      .header('Content-Type', 'application/json; charset=utf-8')
      .send({ token, username, email, id: newUser.id });
  });

  app.post('/api/v1/changeName', async (req, reply) => {
    const username = _.get(req, 'body.username');
    const email = _.get(req, 'body.email');
    const [user] = state.users.filter((u) => u.email === email)
      .map((u) => ({ ...u, username }));

    state.users = state.users.filter((u) => u.id !== user.id);
    state.users.push(user);
    reply
      .code(201)
      .header('Content-Type', 'application/json; charset=utf-8')
      .send(user);
  });

  app.post('/api/v1/changePassword', async (req, reply) => {
    const oldPassword = _.get(req, 'body.password');
    const email = _.get(req, 'body.email');
    const newPassword = _.get(req, 'body.newPassword');
    const user = state.users.find((u) => u.email === email)

    if (user.password !== oldPassword) {
      reply.send(new Unauthorized());
      return;
    }

    const modUser = { ...user, password: newPassword };
    state.users = state.users.filter((u) => u.id !== modUser.id);
    state.users.push(modUser);
    reply
      .code(201)
      .header('Content-Type', 'application/json; charset=utf-8')
      .send({ token: modUser.token, email: modUser.email, username: modUser.username });
  });

  app.post('/api/v1/changeEmail', async (req, reply) => {
    const newEmail = _.get(req, 'body.newEmail');
    const oldEmail = _.get(req, 'body.oldEmail');
    const user = state.users.find((u) => u.email === newEmail);

    if (user) {
      reply.send(new Conflict());
      return;
    }

    const [modUser] = state.users.filter((u) => u.email === oldEmail)
      .map((u) => ({ ...u, email: newEmail }));

    state.users = state.users.filter((u) => u.id !== modUser.id);
    state.users.push(modUser);
    reply
      .code(201)
      .header('Content-Type', 'application/json; charset=utf-8')
      .send(modUser);
  });

  app.post('/api/v1/text', async (req, reply) => {
    const chapterNum = _.get(req, 'body.chapterNum');
    const file = await readfile(chapterNum);
    reply.send({ file: file ? file : '' });
  });

  app.post('/api/v1/tests', async (req, reply) => {
    const userId = _.get(req, 'body.userId');
    const user = state.users.find(({ id }) => id === userId);

    if (!user) {
      reply.send(new Unauthorized());
      return;
    }
    const tests = user.tests;
    reply.send({ tests });
  })

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
