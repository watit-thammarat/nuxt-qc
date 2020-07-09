const express = require('express');

const { tryCheckJWT } = require('../middlewares/jwt');
const service = require('../services/inquiry.service');

const router = express.Router();

const get = async (req, res, next) => {
  try {
    const {
      vendorGroups,
      factories,
      partTypes,
      pageNumber,
      pageSize,
      sortColumn,
      sortDirection,
      partNo,
      date
    } = req.query;
    const data = await service.search(
      vendorGroups,
      factories,
      partTypes,
      sortColumn,
      sortDirection,
      pageNumber,
      pageSize,
      partNo,
      date
    );
    res.send({ data });
  } catch (err) {
    next(err);
  }
};

const getVendorGroups = async (req, res, next) => {
  try {
    const data = await service.getVendorGroups(req.user);
    res.send({ data });
  } catch (err) {
    next(err);
  }
};

tryCheckJWT(router);
router.route('/').get(get);
router.route('/vendor-groups').get(getVendorGroups);

module.exports = router;
