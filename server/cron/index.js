const tnsUser = require('./tnsUser.cron');
const file = require('./file.cron');

const configure = () => {
  tnsUser.start();
  file.start();
};

module.exports = {
  configure
};
