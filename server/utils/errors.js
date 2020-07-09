Error.prototype.setStatus = function(status) {
  this.status = status;
};

const getError = ({ status, message }) => {
  const error = new Error(message);
  error.setStatus(status);
  return error;
};

const INVALID_IMAGE = getError({ message: 'Invalid image', status: 400 });
const INVALID_PDF = getError({ message: 'Invalid pdf', status: 400 });
const UNAUTHORIZED = getError({ message: 'Unauthorized', status: 401 });
const NOT_FOUND = getError({ message: 'Not found', status: 404 });
const FILE_TOO_LARGE = getError({ message: 'File too large', status: 400 });
const INVALID_INVOICE = getError({ message: 'Invalid invoice', status: 400 });
const INVALID_APPRN_STD = getError({
  message: 'Invalid Appearance Standard',
  status: 400
});
const INVALID_LOGIN = getError({
  message: 'Invalid username and/or password',
  status: 400
});
const DUPLICATE_SAMPLING_TYPE_AND_LEVEL = getError({
  message: 'Duplicate sampling type and level',
  status: 400
});

module.exports = {
  INVALID_IMAGE,
  INVALID_PDF,
  UNAUTHORIZED,
  NOT_FOUND,
  FILE_TOO_LARGE,
  INVALID_LOGIN,
  INVALID_INVOICE,
  INVALID_APPRN_STD,
  DUPLICATE_SAMPLING_TYPE_AND_LEVEL
};
