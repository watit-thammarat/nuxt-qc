const getLimitOffset = (pageSize, pageNumber) => {
  const offset = (pageNumber - 1) * pageSize;
  const limit = pageSize;
  return { limit, offset };
};

module.exports = {
  getLimitOffset
};
