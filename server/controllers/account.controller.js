const express = require('express');

const service = require('../services/account.service');

const router = express.Router();

const signIn = async (req, res, next) => {
  try {
    const data = await service.signIn(req.body);
    res.json({ data });
  } catch (err) {
    next(err);
  }
};

router.route('/sign-in').post(signIn);

module.exports = router;
