const user = require('./user.controller');
const vendor = require('./vendor.controller');
const role = require('./role.controller');
const tnsUser = require('./tnsUser.controller');
const account = require('./account.controller');
const upload = require('./upload.controller');
const part = require('./part.controller');
const profile = require('./profile.controller');
const inquiry = require('./inquiry.controller');
const qc = require('./qc.controller');
const sampling = require('./sampling.controller');

const configure = app => {
  app.use('/api/users', user);
  app.use('/api/vendors', vendor);
  app.use('/api/roles', role);
  app.use('/api/tns-users', tnsUser);
  app.use('/api/account', account);
  app.use('/api/uploads', upload);
  app.use('/api/parts', part);
  app.use('/api/profile', profile);
  app.use('/api/inquiry', inquiry);
  app.use('/api/qc', qc);
  app.use('/api/sampling', sampling);
};

module.exports = {
  configure
};
