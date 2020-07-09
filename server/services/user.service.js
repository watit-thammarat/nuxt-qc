const _ = require('lodash');

const { sequelize } = require('../database/models');
const tnsUserRepo = require('../repositories/tnsUser.repo');
const userRepo = require('../repositories/user.repo');
const roleRepo = require('../repositories/role.repo');
const userVdabbrRepo = require('../repositories/userVdabbr.repo');
const { ROLE } = require('../constants/model');
const { toDbString } = require('../utils/date');
const { QC } = require('../constants/role');
const dto = require('../dto/user.dto');
const { getLimitOffset } = require('../utils/pagination');

const saveRoles = async (user, roles, transaction) => {
  let entries = null;
  if (_.isArray(roles) && roles.length > 0) {
    entries = await roleRepo.getByIds(roles);
  }
  await user[`set${ROLE}`](entries, {
    transaction,
    through: { insdttm: toDbString(), upddttm: toDbString() }
  });
};

const saveVendorGroups = async (user_id, roles, vendorGroups, transaction) => {
  await userVdabbrRepo.destroyByUserId(user_id);
  if (
    _.isArray(roles) &&
    roles.some(r => r === QC.id) &&
    _.isArray(vendorGroups) &&
    vendorGroups.length > 0
  ) {
    const entries = _.map(vendorGroups, vdabbr => ({
      user_id,
      vdabbr,
      insdttm: toDbString(),
      upddttm: toDbString()
    }));
    await userVdabbrRepo.bulkCreate(entries, transaction);
  }
};

const add = async ({ id, roles, vendorGroups }) => {
  let t;
  try {
    t = await sequelize.transaction();
    const tnsUser = await tnsUserRepo.getById(id, t);
    const user = await userRepo.add(tnsUser, t);
    await saveRoles(user, roles, t);
    await saveVendorGroups(user.id, roles, vendorGroups, t);
    await t.commit();
    return await getById(id);
  } catch (err) {
    await t.rollback();
    throw err;
  }
};

const update = async ({ id, roles, vendorGroups }) => {
  let t;
  try {
    t = await sequelize.transaction();
    const user = await userRepo.getById(id);
    await saveRoles(user, roles, t);
    await saveVendorGroups(user.id, roles, vendorGroups, t);
    await t.commit();
    return await getById(id);
  } catch (err) {
    await t.rollback();
    throw err;
  }
};

const getById = async id => {
  const entry = await userRepo.getByIdWithRelation(id);
  return await dto.get(entry);
};

const destroy = async id => await userRepo.destroy(id);

const getList = async (
  pageSize,
  pageNumber,
  keyword,
  sortColumn,
  sortDirection
) => {
  const { limit, offset } = getLimitOffset(pageSize, pageNumber);
  const promises = Promise.all([
    userRepo.getList(limit, offset, keyword, sortColumn, sortDirection),
    userRepo.countList(keyword)
  ]);
  const [entries, count] = await promises;
  const items = await dto.getList(entries);
  return { items, count };
};

module.exports = {
  add,
  update,
  getById,
  destroy,
  getList
};
