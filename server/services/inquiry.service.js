const _ = require('lodash');

const { sequelize } = require('../database/models');
const { WAITING } = require('../constants/statusPart');
const { getLimitOffset } = require('../utils/pagination');
const table = require('../constants/table');
const inquiryDto = require('../dto/inquiry.dto');
const vendorGroupDto = require('../dto/vendorGroup.dto');
const vendorRepo = require('../repositories/vendor.repo');
const { USER_VDABBR } = require('../constants/model');
const { DCN, SPECIAL_FOLLOW, EXPORT, PRR } = require('../constants/partType');

const getTempTables = (partNo, date) => `
  (
    SELECT B.*, location
    FROM
    (
      SELECT a.*
      FROM
      (
        SELECT DISTINCT c.vdcd,
                        c.vdabbr as vdnam,
                        a.partno,
                        b.partnam,
                        b.model,
                        a.receives as qty,
                        a.recvdt as date,
                        CASE WHEN a.part_typ = '1' THEN '${DCN.name}'
                            WHEN a.part_typ = '2' THEN '${SPECIAL_FOLLOW.name}'
                            WHEN a.part_typ = '3' THEN '${EXPORT.name}'
                            WHEN a.part_typ = '4' THEN '${PRR.name}'
                            ELSE 'ALL'
                        END AS detail_follow,
                        a.status_part,
                        a.vd_invoino AS invoice_no
        FROM ${table.FOLLOW_PART} a
            INNER JOIN ${table.PART} b ON a.partno = b.partno
            INNER JOIN ${table.VENDOR} c ON a.vdcd = c.vdcd
        WHERE a.status_part = '${WAITING}' 
              AND c.vdabbr IN (:vendorGroups) 
              AND a.part_typ IN (:partTypes) 
              AND a.factory IN (:factories)
              ${_.isEmpty(partNo) ? '' : 'AND a.partNo LIKE :partNo'}
              ${_.isEmpty(date) ? '' : 'AND a.recvdt = :date'}
      ) AS a
    ) AS B
    LEFT JOIN ${
      table.LOCATION
    } AS C on B.partno = C.partno AND B.date = C.recv_dt
  )
`;

const getCountQuery = (partNo, date) => {
  return `
    SELECT CAST(count(*) AS int) AS count
    FROM ${getTempTables(partNo, date)} AS a
  `;
};

const getItemsQuery = (
  pageSize,
  pageNumber,
  sortColumn,
  sortDirection,
  partNo,
  date
) => {
  const { limit, offset } = getLimitOffset(pageSize, pageNumber);
  return `
    SELECT a.vdcd,
        a.vdnam,
        a.partno,
        a.partnam,
        a.model,
        a.qty,
        a.detail_follow,
        a.date,
        a.status_part,
        a.location,
        a.invoice_no
    FROM ${getTempTables(partNo, date)} AS a
    ORDER BY a.${sortColumn} ${sortDirection}
    LIMIT ${limit} OFFSET ${offset}
  `;
};

const getArrayQuery = value => _.split(value, ',').filter(v => !_.isEmpty(v));

const search = async (
  vendorGroups,
  factories,
  partTypes,
  sortColumn,
  sortDirection,
  pageNumber,
  pageSize,
  partNo,
  date
) => {
  const options = {
    replacements: {
      vendorGroups: getArrayQuery(vendorGroups),
      partTypes: getArrayQuery(partTypes),
      factories: getArrayQuery(factories),
      partNo: `%${partNo}%`,
      date
    },
    type: sequelize.QueryTypes.SELECT
  };
  const itemsQuery = getItemsQuery(
    pageSize,
    pageNumber,
    sortColumn,
    sortDirection,
    partNo,
    date
  );
  const countQuery = getCountQuery(partNo, date);
  const entries = await sequelize.query(itemsQuery, options);
  const [{ count }] = await sequelize.query(countQuery, options);
  return { items: inquiryDto.getList(entries), count };
};

const getVendorGroups = async user => {
  let entries = null;
  if (!_.isNil(user)) {
    entries = _.orderBy(user[USER_VDABBR], ['vdabbr'], ['asc']);
  } else {
    entries = await vendorRepo.getGroupList();
  }
  return vendorGroupDto.getList(entries);
};

module.exports = {
  search,
  getVendorGroups
};
