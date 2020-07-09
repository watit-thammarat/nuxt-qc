const _ = require('lodash');

const repo = require('../repositories/sampling.repo');
const { getLimitOffset } = require('../utils/pagination');
const dto = require('../dto/sampling.dto');
const { DUPLICATE_SAMPLING_TYPE_AND_LEVEL } = require('../utils/errors');

const getList = async (
  keyword,
  pageNumber,
  pageSize,
  sortColumn,
  sortDirection
) => {
  const { limit, offset } = getLimitOffset(pageSize, pageNumber);
  const promises = Promise.all([
    repo.getList(keyword, limit, offset, sortColumn, sortDirection),
    repo.countList(keyword)
  ]);
  const [entries, count] = await promises;
  return { items: dto.getList(entries), count };
};

const getById = async (type, level) => {
  const entry = await repo.get(type, level);
  return dto.get(entry);
};

const add = async ({ type, level, from, to, size }, user) => {
  const entry = await repo.get(type, level);
  if (!_.isNil(entry)) {
    throw DUPLICATE_SAMPLING_TYPE_AND_LEVEL;
  }
  await repo.add(type, level, from, to, size, user.id);
  return await getById(type, level);
};

const update = async (type, level, { from, to, size }, user) => {
  await repo.update(type, level, from, to, size, user.id);
  return await getById(type, level);
};

const destroy = async (type, level) => {
  await repo.destroy(type, level);
};

module.exports = {
  getList,
  getById,
  add,
  update,
  destroy
};
