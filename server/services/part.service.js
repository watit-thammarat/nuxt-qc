const { sequelize } = require('../database/models');
const partRepo = require('../repositories/part.repo');
const fileStdRepo = require('../repositories/fileStd.repo');
const apprnStdRepo = require('../repositories/apprnStd.repo');
const partDto = require('../dto/part.dto');
const fileStdDto = require('../dto/fileStd.dto');
const apprnStdDto = require('../dto/apprnStd.dto');
const { getLimitOffset } = require('../utils/pagination');

const getList = async () => {
  const entries = await partRepo.getList();
  return partDto.getList(entries);
};

const getFileStdList = async (
  pageSize,
  pageNumber,
  keyword,
  sortColumn,
  sortDirection
) => {
  const { limit, offset } = getLimitOffset(pageSize, pageNumber);
  const promises = Promise.all([
    fileStdRepo.getList(limit, offset, keyword, sortColumn, sortDirection),
    fileStdRepo.countList(keyword)
  ]);
  const [entries, count] = await promises;
  return { items: fileStdDto.getList(entries), count };
};

const getFileStd = async id => {
  const entry = await fileStdRepo.get(id);
  return fileStdDto.get(entry);
};

const addFileStd = async (id, { trouble, appearance }, user) => {
  let entry = {
    partno: id,
    file_trouble: trouble,
    file_apprn: appearance
  };
  await fileStdRepo.add(entry, user);
  entry = await fileStdRepo.get(id);
  return fileStdDto.get(entry);
};

const updateFileStd = async (id, { trouble, appearance }, user) => {
  let entry = {
    partno: id,
    file_trouble: trouble,
    file_apprn: appearance
  };
  await fileStdRepo.update(entry, user);
  entry = await fileStdRepo.get(id);
  return fileStdDto.get(entry);
};

const destroyFileStd = async id => {
  let t;
  try {
    t = await sequelize.transaction();
    await fileStdRepo.destroy(id, t);
    await apprnStdRepo.destroyByPartNo(id, t);
    await t.commit();
  } catch (err) {
    await t.rollback();
    throw err;
  }
};

const addApprnStd = async (id, { detail, picture }, user) => {
  let t;
  try {
    t = await sequelize.transaction();
    let item_no = await apprnStdRepo.getMaxItemNo(id, t);
    item_no = (item_no || 0) + 1;
    let entry = {
      partno: id,
      item_no,
      detail,
      picture
    };
    await apprnStdRepo.add(entry, user, t);
    await t.commit();
    entry = await apprnStdRepo.get(id, item_no);
    return apprnStdDto.get(entry);
  } catch (err) {
    await t.rollback();
    throw err;
  }
};

const updateApprnStd = async (id, no, { detail, picture }, user) => {
  let entry = {
    partno: id,
    item_no: no,
    detail,
    picture
  };
  await apprnStdRepo.update(entry, user);
  entry = await apprnStdRepo.get(id, no);
  return apprnStdDto.get(entry);
};

const getApprnStd = async (id, no) => {
  const entry = await apprnStdRepo.get(id, no);
  return apprnStdDto.get(entry);
};

const getApprnStdListByPartNo = async id => {
  const entries = await apprnStdRepo.getListByParyNo(id);
  return apprnStdDto.getList(entries);
};

const destroyApprnStd = async (id, no) => await apprnStdRepo.destroy(id, no);

module.exports = {
  getList,
  addFileStd,
  updateFileStd,
  getFileStd,
  getFileStdList,
  destroyFileStd,
  addApprnStd,
  updateApprnStd,
  getApprnStd,
  getApprnStdListByPartNo,
  destroyApprnStd
};
