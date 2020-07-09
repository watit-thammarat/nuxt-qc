const express = require('express');
const multer = require('multer');
const path = require('path');
const uuid = require('uuid/v4');

const config = require('../config');
const { checkJWT } = require('../middlewares/jwt');
const {
  INVALID_PDF,
  INVALID_IMAGE,
  FILE_TOO_LARGE
} = require('../utils/errors');

const router = express.Router();
const limits = { fileSize: config.file.size };

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, config.file.dir);
  },
  filename(req, file, cb) {
    const extname = path.extname(file.originalname);
    cb(null, `${uuid()}${extname}`);
  }
});

const uploadPDF = multer({
  storage,
  limits,
  fileFilter(req, file, cb) {
    const { pdf } = config.file.mimetype;
    if (pdf.some(m => m === file.mimetype)) {
      cb(null, true);
    } else {
      cb(INVALID_PDF, false);
    }
  }
}).single('file');

const uploadImage = multer({
  storage,
  limits,
  fileFilter(req, file, cb) {
    const { image } = config.file.mimetype;
    if (image.some(m => m === file.mimetype)) {
      cb(null, true);
    } else {
      cb(INVALID_IMAGE, false);
    }
  }
}).single('file');

const handleError = (err, next) => {
  if (err.code && err.code === 'LIMIT_FILE_SIZE') {
    next(FILE_TOO_LARGE);
  } else {
    next(err);
  }
};

const pdf = (req, res, next) => {
  uploadPDF(req, res, err => {
    if (err) {
      return handleError(err, next);
    }
    res.json({ data: req.file });
  });
};

const image = (req, res, next) => {
  uploadImage(req, res, err => {
    if (err) {
      return handleError(err, next);
    }
    res.json({ data: req.file });
  });
};

checkJWT(router);
router.route('/image').post(image);
router.route('/pdf').post(pdf);

module.exports = router;
