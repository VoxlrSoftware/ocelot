import React from 'react';
import _ from 'lodash';
import Immutable from 'immutable';

export const wrapComponents = (arr) => {
  return arr.map((obj, idx) => {
    if (obj instanceof Object && _.has(obj, 'key') && obj.key === null) {
      return React.cloneElement(obj, { key: idx });
    }
    return obj;
  });
};

const isObjectOrMap = (value) => {
  return _.isObject(value) || Immutable.Iterable.isKeyed(value);
};

const isArrayOrList = (value) => {
  return _.isArray(value) || Immutable.Iterable.isIndexed(value);
};

export const deepExtend = (target, ...sources) => {
  if (!isObjectOrMap(target)) {
    return sources.length ? sources[sources.length - 1] : target;
  }

  /* eslint-disable */
  sources.forEach((obj) => {
    const keys = isObjectOrMap(obj) ? Object.keys(obj) : [];
    keys.forEach((prop) => {
      const val = obj.get(prop);
      if (val && isObjectOrMap(val) && !isArrayOrList(val)) {
        target = target.set(prop, deepExtend(target.get(prop) || {}, obj.get(prop)));
      } else {
        target = target.set(prop, obj.get(prop));
      }
    });
  });

  return target;
};