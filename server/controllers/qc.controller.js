const express = require('express');

const { checkJWT } = require('../middlewares/jwt');
const service = require('../services/qc.service');

const router = express.Router();

const get = async (req, res, next) => {
  try {
    const { part, invoice, vendor, serial } = req.query;
    const data = await service.get(part, invoice, serial, vendor);
    res.send({ data });
  } catch (err) {
    next(err);
  }
};

const post = async (req, res, next) => {
  try {
    const { user, body } = req;
    await service.save(body, user);
    res.send({ data: 'OK' });
  } catch (err) {
    next(err);
  }
};

checkJWT(router);

router
  .route('/')
  .get(get)
  .post(post);

module.exports = router;
