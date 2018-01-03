export const getTotalPages = (totalCount, pageSize) => {
  return Math.ceil(totalCount / pageSize);
};

export const getPaginationValues = (pagination) => {
  const {
    page,
    pageSize,
    sortBy,
    sortOrder,
  } = pagination;

  const skip = pageSize * (page - 1);

  return {
    pageSize,
    skip,
    sortBy,
    sortOrder,
  };
};

export const getPaginationOptions = (params) => {
  const {
    maxOptions,
    page,
    pageSize,
    totalCount,
  } = params;

  const totalPages = getTotalPages(totalCount, pageSize);
  const optionCount = Math.min(totalPages, maxOptions || 3);
  const paginationOptions = [page];

  let i = 1;

  while (paginationOptions.length < optionCount) {
    if (page + i <= totalPages) {
      paginationOptions.push(page + i);
    }

    if (page - i >= 1) {
      paginationOptions.unshift(page - i);
    }

    i += 1;
  }

  return paginationOptions;
};

export const getAdjacentPage = (params, before = false) => {
  const {
    page,
    pageSize,
    totalCount,
  } = params;

  if (before) {
    return Math.max(1, page - 1);
  }

  const totalPages = getTotalPages(totalCount, pageSize);
  const remainingPages = totalPages - page;

  if (remainingPages) {
    return page + 1;
  }

  return page;
};
