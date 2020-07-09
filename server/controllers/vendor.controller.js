const express = require('express');

const { checkJWT, isAdmin } = require('../middlewares/jwt');
const service = require('../services/vendor.service');

const router = express.Router();

const getList = async (req, res, next) => {
  try {
    const data = await service.getList();
    res.json({ data });
  } catch (err) {
    next(err);
  }
};

const getGroupList = async (req, res, next) => {
  try {
    const data = await service.getGroupList();
    res.json({ data });
  } catch (err) {
    next(err);
  }
};

checkJWT(router);
isAdmin(router);
router.route('/').get(getList);
router.route('/groups').get(getGroupList);

module.exports = router;
