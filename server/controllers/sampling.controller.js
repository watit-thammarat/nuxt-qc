const express = require('express');

const service = require('../services/sampling.service');
const { checkJWT, isAdmin } = require('../middlewares/jwt');

const router = express.Router();

const getList = async (req, res, next) => {
  try {
    const {
      keyword,
      pageNumber,
      pageSize,
      sortColumn,
      sortDirection
    } = req.query;
    const data = await service.getList(
      keyword,
      pageNumber,
      pageSize,
      sortColumn,
      sortDirection
    );
    res.send({ data });
  } catch (err) {
    next(err);
  }
};

const getById = async (req, res, next) => {
  try {
    const { type, level } = req.params;
    const data = await service.getById(type, level);
    res.send({ data });
  } catch (err) {
    next(err);
  }
};

const add = async (req, res, next) => {
  try {
    const { body, user } = req;
    const data = await service.add(body, user);
    res.send({ data });
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const { type, level } = req.params;
    const { body, user } = req;
    const data = await service.update(type, level, body, user);
    res.send({ data });
  } catch (err) {
    next(err);
  }
};

const destroy = async (req, res, next) => {
  try {
    const { type, level } = req.params;
    await service.destroy(type, level);
    res.send({ data: 'OK' });
  } catch (err) {
    next(err);
  }
};

checkJWT(router);
isAdmin(router);

router
  .route('/')
  .get(getList)
  .post(add);

router
  .route('/:type/:level')
  .get(getById)
  .put(update)
  .delete(destroy);

module.exports = router;
