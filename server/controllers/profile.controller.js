const express = require('express');

const { checkJWT } = require('../middlewares/jwt');
const service = require('../services/user.service');
const { UNAUTHORIZED } = require('../utils/errors');

const router = express.Router();

const getById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await service.getById(id);
    res.json({ data });
  } catch (err) {
    next(err);
  }
};

const validateId = (req, res, next) => {
  if (req.user.id !== +req.params.id) {
    return next(UNAUTHORIZED);
  }
  next();
};

checkJWT(router);
router.route('/:id').get(validateId, getById);

module.exports = router;
