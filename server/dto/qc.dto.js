const _ = require('lodash');

const { PART, VENDOR } = require('../constants/model');
const partDto = require('./part.dto');
const vendorDto = require('./vendor.dto');
const apprnStdDto = require('./apprnStd.dto');
const troubleStdDto = require('./troubleStd.dto');
const { toTimestamp } = require('../utils/date');

const get = (main, samplings, pdf, troubleStds, apprnStds) => {
  return {
    part: partDto.get(main[PART]),
    vendor: vendorDto.get(main[VENDOR]),
    invoice: main.vd_invoino,
    receivedAt: toTimestamp(main.recvdt),
    sampling: {
      lotSize: +main.receives,
      typeOne: samplings.typeOne ? +samplings.typeOne.sampling_size : null,
      typeTwo: samplings.typeTwo ? +samplings.typeTwo.sampling_size : null
    },
    standard: {
      trouble: {
        pdf: pdf.file_trouble,
        items: troubleStdDto.getList(troubleStds)
      },
      appearance: {
        pdf: pdf.file_apprn,
        items: apprnStdDto.getList(apprnStds)
      }
    }
  };
};

module.exports = {
  get
};
