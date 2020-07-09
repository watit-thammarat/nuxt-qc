const repo = require('../repositories/vendor.repo');
const vendorDto = require('../dto/vendor.dto');
const venderGroupDto = require('../dto/vendorGroup.dto');

const getList = async () => {
  const entries = await repo.getList();
  return vendorDto.getList(entries);
};

const getGroupList = async () => {
  const entries = await repo.getGroupList();
  return venderGroupDto.getList(entries);
};

module.exports = {
  getList,
  getGroupList
};
