import _ from 'lodash';

const namespace = 'vx';

const formatName = (name) => {
  return name.split('/').join('');
};

export const getClassNameGenerator = (component) => {
  return (opts) => {
    let className = `${namespace}-${formatName(component)}`;
    if (_.has(opts, 'child')) {
      className += `-${opts.child}`;
    }

    return className;
  };
};
