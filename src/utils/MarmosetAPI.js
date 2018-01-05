import request from 'request-promise';
import Promise from 'bluebird';
import _ from 'lodash';
import localStorage from './localStorage';
import { MARMOSET_URL } from '../Constants';

const getPath = path => `${MARMOSET_URL}/${path}`;
const getApiPath = path => getPath(`api/${path}`);

export const createAccountRequest = () => {
  return {
    path: 'account',
  };
};

export const makeRequest = (opts) => {
  let requestOpts = opts;

  if (opts.auth) {
    requestOpts = _.merge({
      headers: {
        'Authorization': `Bearer ${opts.auth.access_token}`,
      },
    }, _.omit(requestOpts, ['auth']));
  }

  if (opts.path) {
    requestOpts = _.merge({
      url: getApiPath(opts.path),
    }, _.omit(requestOpts, ['path']));
  }

  if (!opts.headers || !opts.headers['Content-Type']) {
    requestOpts = _.merge({
      json: true,
    }, requestOpts);
  }

  return new Promise((resolve) => {
    request(requestOpts).then((body) => {
      resolve({
        ...body,
      });
    }).catch((error) => {
      resolve({
        error,
      });
    });
  });
};

export const login = (username, password) => {
  let auth = null;

  return makeRequest({
    form: {
      'grant_type': 'password',
      'password': password,
      'username': username,
    },
    headers: {
      'Authorization': 'Basic dm94bHJ3ZWI6aGx6MVdETkNyaWE0S0Fd',
    },
    json: true,
    method: 'POST',
    url: getPath('oauth/token'),
  }).then(({ error, ...response }) => {
    if (error) {
      return Promise.resolve({ error });
    }

    auth = response;
    localStorage.setItem('_cred_', JSON.stringify(auth));

    return makeRequest({ auth, ...createAccountRequest() });
  }).then(({ error, ...response }) => {
    if (error) {
      return Promise.resolve({ error });
    }

    return Promise.resolve({
      account: response,
      auth,
    });
  });
};
