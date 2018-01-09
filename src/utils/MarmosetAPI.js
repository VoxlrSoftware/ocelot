import request from 'request-promise';
import Promise from 'bluebird';
import { Map } from 'immutable';
import _ from 'lodash';
import localStorage from './localStorage';
import { MARMOSET_URL } from '../Constants';

const getPath = path => `${MARMOSET_URL}/${path}`;
const getApiPath = path => getPath(`api/${path}`);

const getAccessToken = (auth) => {
  return auth &&
    (Map.isMap(auth) ? auth.get('access_token') :
      auth.access_token);
};

export const makeRequest = (opts) => {
  let requestOpts = opts;

  if (opts.auth) {
    const accessToken = getAccessToken(opts.auth);
    requestOpts = _.merge({
      headers: {
        'Authorization': `Bearer ${accessToken}`,
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

  return new Promise((resolve, reject) => {
    request(requestOpts).then((body) => {
      resolve(body);
    }).catch((error) => {
      reject(error);
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
  }).then((response) => {
    auth = response;
    localStorage.setItem('_cred_', JSON.stringify(auth));

    return makeRequest({ auth, path: 'account' });
  }).then((response) => {
    return Promise.resolve({
      account: response,
      auth,
    });
  });
};

export const doGet = (config) => {
  const {
    pagination,
    ...getConfig
  } = config;

  if (pagination) {
    const query = pagination.getQueryObject();
    const qs = _.merge(query, config.qs || {});
    getConfig.qs = qs;
  }

  const opts = {
    method: 'GET',
    ...getConfig,
  };

  return makeRequest(opts);
};

