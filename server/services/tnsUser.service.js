const ldap = require('ldapjs');
const _ = require('lodash');

const repo = require('../repositories/tnsUser.repo');
const date = require('../utils/date');
const dto = require('../dto/tnsUser.dto');
const { INVALID_LOGIN } = require('../utils/errors');

const SEARCH_SCOPE = 'ou=People,dc=thns';
const {
  ldap: { url }
} = require('../config');
const { sequelize } = require('../database/models');

let client;

const configure = () => {
  return new Promise((resolve, reject) => {
    client = ldap.createClient({ url, reconnect: true });
    client.on('error', err => {
      reject(err);
    });
    client.on('connect', () => {
      resolve();
    });
  });
};

const validate = ({ uid, uidNumber, gidNumber, givenName, sn, mail }) => {
  return (
    _.isString(uid) &&
    _.isNumber(Number(uidNumber)) &&
    _.isNumber(Number(gidNumber)) &&
    _.isString(givenName) &&
    _.isString(sn) &&
    _.isString(mail)
  );
};

const getUsers = () => {
  const entries = [];
  const opts = { scope: 'sub' };
  return new Promise((resolve, reject) => {
    client.search(SEARCH_SCOPE, opts, (err, res) => {
      if (err) {
        return reject(err);
      }
      res.on('searchEntry', ({ object }) => {
        if (validate(object)) {
          entries.push({
            id: object.uidNumber,
            gid: object.gidNumber,
            uid: object.uid,
            first_name: object.givenName,
            last_name: object.sn,
            email: object.mail,
            insdttm: date.toDbString(),
            upddttm: date.toDbString()
          });
        }
      });
      res.on('end', () => {
        resolve(entries);
      });
    });
  });
};

const fetch = async () => {
  let t;
  try {
    const entries = await getUsers();
    t = await sequelize.transaction();
    await repo.destroy(t);
    await repo.bulkCreate(entries, t);
    await t.commit();
  } catch (err) {
    await t.rollback();
    throw err;
  }
};

const getList = async () => {
  const entries = await repo.getList();
  return await dto.getList(entries);
};

const authenticate = (uid, password) => {
  const opts = {
    filter: `uid=${uid}`,
    scope: 'sub'
  };
  return new Promise((resolve, reject) => {
    let ldapRes, userId;
    client.search(SEARCH_SCOPE, opts, (err, res) => {
      if (err) {
        return reject(err);
      }
      res.on('searchEntry', entry => {
        userId = entry.object ? entry.object.uidNumber : null;
        ldapRes = entry.raw;
      });
      res.on('end', () => {
        if (!ldapRes) {
          return reject(INVALID_LOGIN);
        }
        client.bind(ldapRes.dn, password, err => {
          if (err) {
            return reject(INVALID_LOGIN);
          }
          resolve(userId);
        });
      });
    });
  });
};

module.exports = {
  configure,
  fetch,
  getList,
  authenticate
};
