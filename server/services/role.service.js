const repo = require('../repositories/role.repo');
const dto = require('../dto/role.dto');

const getList = async () => {
  const entries = await repo.getList();
  return dto.getList(entries);
};

module.exports = {
  getList
};
