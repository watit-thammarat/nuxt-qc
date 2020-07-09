const express = require('express');

const { checkJWT, isAdmin } = require('../middlewares/jwt');
const service = require('../services/part.service');

const router = express.Router();

const getList = async (req, res, next) => {
  try {
    const data = await service.getList();
    res.json({ data });
  } catch (err) {
    next(err);
  }
};

const getFileStdList = async (req, res, next) => {
  try {
    const {
      pageSize,
      pageNumber,
      keyword,
      sortColumn,
      sortDirection
    } = req.query;
    const data = await service.getFileStdList(
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

const getFileStd = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await service.getFileStd(id);
    res.json({ data });
  } catch (err) {
    next(err);
  }
};

const addFileStd = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { body, user } = req;
    const data = await service.addFileStd(id, body, user);
    res.json({ data });
  } catch (err) {
    next(err);
  }
};

const updateFileStd = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { body, user } = req;
    const data = await service.updateFileStd(id, body, user);
    res.json({ data });
  } catch (err) {
    next(err);
  }
};

const deleteFileStd = async (req, res, next) => {
  try {
    const { id } = req.params;
    await service.destroyFileStd(id);
    res.json({ data: 'OK' });
  } catch (err) {
    next(err);
  }
};

const addApprnStd = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { body, user } = req;
    const data = await service.addApprnStd(id, body, user);
    res.json({ data });
  } catch (err) {
    next(err);
  }
};

const updateApprnStd = async (req, res, next) => {
  try {
    const { id, no } = req.params;
    const { body, user } = req;
    const data = await service.updateApprnStd(id, no, body, user);
    res.json({ data });
  } catch (err) {
    next(err);
  }
};

const getApprnStd = async (req, res, next) => {
  try {
    const { id, no } = req.params;
    const data = await service.getApprnStd(id, no);
    res.json({ data });
  } catch (err) {
    next(err);
  }
};

const getApprnStdListByPartNo = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await service.getApprnStdListByPartNo(id);
    res.json({ data });
  } catch (err) {
    next(err);
  }
};

const destroyApprnStd = async (req, res, next) => {
  try {
    const { id, no } = req.params;
    await service.destroyApprnStd(id, no);
    res.json({ data: 'OK' });
  } catch (err) {
    next(err);
  }
};

checkJWT(router);
isAdmin(router);

router.route('/').get(getList);

router.route('/file-std').get(getFileStdList);

router
  .route('/:id/apprn-std')
  .get(getApprnStdListByPartNo)
  .post(addApprnStd);

router
  .route('/:id/apprn-std/:no')
  .get(getApprnStd)
  .put(updateApprnStd)
  .delete(destroyApprnStd);

router
  .route('/:id/file-std')
  .get(getFileStd)
  .post(addFileStd)
  .put(updateFileStd)
  .delete(deleteFileStd);

module.exports = router;
