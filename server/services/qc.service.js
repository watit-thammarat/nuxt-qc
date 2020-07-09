const _ = require('lodash');

const { sequelize } = require('../database/models');
const receiveSerialRepo = require('../repositories/receiveSerial.repo');
const followPartRepo = require('../repositories/followPart.repo');
const samplingRepo = require('../repositories/sampling.repo');
const fileStdRepo = require('../repositories/fileStd.repo');
const apprnStdRepo = require('../repositories/apprnStd.repo');
const qcPartRepo = require('../repositories/qcPart.repo');
const apprnResultRepo = require('../repositories/apprnResult.repo');
const dto = require('../dto/qc.dto');
const { INVALID_INVOICE, INVALID_APPRN_STD } = require('../utils/errors');
const { PRR } = require('../constants/partType');

const checkInvoice = async (invoice, vendor, serial) => {
  const entry = await receiveSerialRepo.get(vendor, serial);
  if (_.isNil(entry) || entry.vd_invoino !== invoice) {
    throw INVALID_INVOICE;
  }
};

const getSamplings = async qty => {
  const data = { typeOne: null, typeTwo: null };
  const entries = await samplingRepo.getByLotSize(qty);
  if (!_.isEmpty(entries)) {
    data.typeOne = entries.find(e => e.sampling_typ == 1);
    data.typeTwo = entries.find(e => e.sampling_typ == 2);
  }
  return data;
};

const getMain = async (partNo, vendorCode, invoiceNo) => {
  const entry = await followPartRepo.getQCMain(partNo, vendorCode, invoiceNo);
  return entry;
};

const getTroubleStds = async (partNo, vendorCode, invoiceNo) => {
  const entries = await followPartRepo.getTroubleStds(
    partNo,
    vendorCode,
    invoiceNo
  );
  return entries;
};

const getPDF = async partNo => {
  const entry = await fileStdRepo.get(partNo);
  if (_.isNil(entry)) {
    throw INVALID_APPRN_STD;
  }
  return entry;
};

const getApprnStds = async partNo => {
  const entries = await apprnStdRepo.getListByParyNo(partNo);
  if (_.isEmpty(entries)) {
    throw INVALID_APPRN_STD;
  }
  return entries;
};

const get = async (part, invoice, serial, vendor) => {
  await checkInvoice(invoice, vendor, serial);
  const pdf = await getPDF(part);
  const apprnStds = await getApprnStds(part);
  const troubleStds = await getTroubleStds(part, vendor, invoice);
  const main = await getMain(part, vendor, invoice);
  const samplings = await getSamplings(+main.receives);
  return dto.get(main, samplings, pdf, troubleStds, apprnStds);
};

const saveTroubles = async (part, vendor, invoice, items, user, t) => {
  if (_.isEmpty(items)) {
    return;
  }
  const entries = await followPartRepo.getTroubleStds(part, vendor, invoice);
  for (const entry of entries) {
    const item = _.find(items, i => i.detailFollow === entry.detail_follow);
    if (!_.isNil(item)) {
      await followPartRepo.update(entry, item, user, t);
      if (entry.part_typ !== PRR.id && item.statusPart === 'CLOSE') {
        await qcPartRepo.update(entry, user, t);
      }
    }
  }
};

const saveAppearances = async (part, invoice, items, user, pass, t) => {
  const entries = await apprnStdRepo.getListByParyNo(part);
  for (const entry of entries) {
    const item = _.find(items, i => i.itemNo == entry.item_no);
    if (!_.isNil(item)) {
      await apprnResultRepo.save(invoice, entry, item.checked, user, pass, t);
    }
  }
};

const save = async ({ part, vendor, invoice, standard, pass }, user) => {
  const { troubles, appearances } = standard;
  let t;
  try {
    t = await sequelize.transaction();
    await saveTroubles(part, vendor, invoice, troubles, user.id, t);
    await saveAppearances(part, invoice, appearances, user.id, pass, t);
    await t.commit();
  } catch (err) {
    await t.rollback();
    throw err;
  }
};

module.exports = {
  get,
  save
};
