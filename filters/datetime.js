import moment from 'moment';
import _ from 'lodash';

const DATE_FORMAT = 'DD MMM YYYY HH:mm:ss';

export default (value, format = DATE_FORMAT) => {
  if (_.isNil(value)) {
    return 'N/A';
  }
  return moment.unix(value).format(format);
};
