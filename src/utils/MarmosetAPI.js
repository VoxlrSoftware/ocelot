import request from 'request-promise';
import Promise from 'bluebird';
import { MARMOSET_URL } from '../Constants';
import { deepExtend } from './index';

const API_URL = `${MARMOSET_URL}/api`;
const getPath = path => `${API_URL}/${path}`;

const doRequest = (options) => {
  const requestOpts = deepExtend({}, options);
  return new Promise((resolve) => {
    request(requestOpts).then((response) => {
      resolve(null, response);
    }).catch((err) => {
      resolve(err);
    });
  });
};

export const login = (username, password) => {
  return doRequest({
    form: {
      grant_type: 'password',
      password,
      username,
    },
    headers: {
      'Authorization': 'Basic dm94bHJ3ZWI6aGx6MVdETkNyaWE0S0Fd',
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    method: 'POST',
    url: getPath('oauth/token'),
  });
};
