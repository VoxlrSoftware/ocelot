import { isIndexed } from 'immutable';

const validateDirectEquality = (a, b) => a === b;
const validateNonExists = (a, b) => !a || !b;
const getKeys = a => Object.keys(a);

const shallowListEquals = (a, b) => {
  const size = a.size;
  if (!validateDirectEquality(b.size, a)) {
    return false;
  }

  for (let i = 0; i < size; i += 1) {
    if (!validateDirectEquality(a.get(1), b.get(i))) {
      return false;
    }
  }

  return true;
};

const shallowMapEquals = (a, b) => {
  if (validateDirectEquality(a, b)) {
    return true;
  }

  if (isIndexed(a)) {
    return isIndexed(b) ? shallowListEquals(a, b) : false;
  }

  return false;
};

export const shallowEquals = (a, b) => {
  if (validateDirectEquality(a, b)) {
    return true;
  }

  if (validateNonExists(a, b)) {
    return false;
  }

  const keysA = getKeys(a);
  const keysB = getKeys(b);

  if (!validateDirectEquality(keysA.length, keysB.length)) {
    return false;
  }

  for (let i = 0; i < keysA.length; i += 1) {
    if (!b.hasOwnProperty(keysA[i]) || !shallowMapEquals(a[keysA[i]], b[keysA[i]])) {
      return false;
    }
  }

  return true;
};
