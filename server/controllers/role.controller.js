const express = require('express');

const service = require('../services/role.service');
const { checkJWT, isAdmin } = require('../middlewares/jwt');

const router = express.Router();

const getList = async (req, res, next) => {
  try {
    const data = await service.getList();
    res.json({ data });
  } catch (err) {
    next(err);
  }
};

checkJWT(router);
isAdmin(router);
router.route('/').get(getList);

module.exports = router;
