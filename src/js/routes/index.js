// @ts-check

const host = '';
const prefix = 'api/v1';

export default {
  login: () => [host, prefix, 'login'].join('/'),
  signup: () => [host, prefix, 'signup'].join('/'),
  getText: () => [host, prefix, 'text'].join('/'),
  changeName: () => [host, prefix, 'changeName'].join('/'),
  changeEmail: () => [host, prefix, 'changeEmail'].join('/'),
  changePassword: () => [host, prefix, 'changePassword'].join('/'),
};
