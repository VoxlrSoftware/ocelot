export const findStrategyByName = (strategies, name) => {
  return strategies.findIndex(x => x.get('name') === name);
};

export const getStrategyByName = (strategies, name) => {
  const index = findStrategyByName(strategies, name);
  return index > -1 ? strategies.get(index) : null;
};
