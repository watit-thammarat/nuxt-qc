const express = require('express');

const service = require('../services/user.service');
const { checkJWT, isAdmin } = require('../middlewares/jwt');

const router = express.Router();

const add = async (req, res, next) => {
  try {
    const data = await service.add(req.body);
    res.status(201).json({ data });
  } catch (err) {
    next(err);
  }
};

const getList = async (req, res, next) => {
  try {
    const {
      pageNumber,
      pageSize,
      keyword,
      sortColumn,
      sortDirection
    } = req.query;
    const data = await service.getList(
      pageSize,
      pageNumber,
      keyword,
      sortColumn,
      sortDirection
    );
    res.json({ data });
  } catch (err) {
    next(err);
  }
};

const getById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await service.getById(id);
    res.json({ data });
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await service.update({ ...req.body, id });
    res.json({ data });
  } catch (err) {
    next(err);
  }
};

const destroy = async (req, res, next) => {
  try {
    const { id } = req.params;
    await service.destroy(id);
    res.json({ data: 'OK' });
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
  .route('/:id')
  .get(getById)
  .put(update)
  .delete(destroy);

module.exports = router;
