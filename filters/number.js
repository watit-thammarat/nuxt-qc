import _ from 'lodash';

export default value => {
  if (_.isNaN(value)) {
    return 'N/A';
  }
  const formatter = new Intl.NumberFormat();
  return formatter.format(+value);
};
