export default (() => {
  const storage = window.localStorage; // eslint-disable-line
  const x = '__storage_test__';
  try {
    storage.setItem(x, x);
    storage.removeItem(x);
    return storage;
  } catch (e) {
    return {
      getItem: () => null,
      setItem: () => {},
    };
  }
})();
