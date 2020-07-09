const jwt = require('jsonwebtoken');
const _ = require('lodash');

const { INVALID_LOGIN } = require('../utils/errors');
const tnsService = require('./tnsUser.service');
const repo = require('../repositories/user.repo');
const dto = require('../dto/user.dto');
const {
  jwt: { secretOrKey }
} = require('../config');

const signJwt = payload =>
  new Promise((resolve, reject) => {
    jwt.sign(
      payload,
      secretOrKey,
      { expiresIn: 24 * 60 * 60 },
      (err, token) => {
        if (err) {
          return reject(err);
        }
        resolve({ token });
      }
    );
  });

const signIn = async ({ uid, password }) => {
  const id = await tnsService.authenticate(uid, password);
  const entry = await repo.getByIdWithRelation(id);
  if (!entry) {
    throw INVALID_LOGIN;
  }
  const profile = await dto.get(entry);
  const { token } = await signJwt(_.omit(profile, ['vendors', 'roles']));
  return { token, profile };
};

module.exports = {
  signIn
};
