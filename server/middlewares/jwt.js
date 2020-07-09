const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const userRepo = require('../repositories/user.repo');
const { UNAUTHORIZED } = require('../utils/errors');
const {
  jwt: { secretOrKey }
} = require('../config');
const logger = require('../utils/logger');

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey
};

const configure = () =>
  passport.use(
    new JwtStrategy(opts, async ({ id }, done) => {
      try {
        const user = await userRepo.getByIdWithRelation(id);
        if (!user) {
          return done(null, false);
        }
        done(null, user);
      } catch (err) {
        logger.error(err.stack);
        done(null, false);
      }
    })
  );

const tryCheckJWT = router =>
  router.use((req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
      if (!err && user) {
        req.user = user;
      }
      next();
    })(req, res, next);
  });

const checkJWT = router =>
  router.use((req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
      if (err) {
        logger.error(err.stack);
        return next(UNAUTHORIZED);
      }
      if (!user) {
        return next(UNAUTHORIZED);
      }
      req.user = user;
      next();
    })(req, res, next);
  });

const isAdmin = router =>
  router.use((req, res, next) => {
    if (!req.user || !req.user.isAdmin) {
      return next(UNAUTHORIZED);
    }
    next();
  });

module.exports = {
  configure,
  checkJWT,
  isAdmin,
  tryCheckJWT
};
