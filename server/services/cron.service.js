const fs = require('fs-extra');
const _ = require('lodash');
const path = require('path');

const config = require('../config');
const tnsService = require('./tnsUser.service');
const fileStdRepo = require('../repositories/fileStd.repo');
const apprnStdRepo = require('../repositories/apprnStd.repo');

const fetchTnsUsers = async () => await tnsService.fetch();

const deleteFiles = async () => {
  const promises = Promise.all([fileStdRepo.getAll(), apprnStdRepo.getAll()]);
  const [fileStds, apprnStds] = await promises;
  const fileStdFiles = fileStds.reduce((acc, e) => {
    acc.push(e.file_apprn);
    if (e.file_trouble) {
      acc.push(e.file_trouble);
    }
    return acc;
  }, []);
  const apprnStdFiles = apprnStds.map(e => e.picture);
  const files = [...fileStdFiles, ...apprnStdFiles];
  const allFiles = fs.readdirSync(config.file.dir);
  if (!_.isEmpty(allFiles)) {
    for (const file of allFiles) {
      if (!files.some(f => f === file)) {
        fs.unlinkSync(path.resolve(config.file.dir, file));
      }
    }
  }
};

module.exports = {
  fetchTnsUsers,
  deleteFiles
};
