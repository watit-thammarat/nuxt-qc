import _ from 'lodash';

import { PAGE_SIZE } from '../constants/pagination';
import { DCN, SPECIAL_FOLLOW, EXPORT, PRR } from '../constants/partTypes';

const BASE_URL = '/inquiry';

const partTypes = [DCN, SPECIAL_FOLLOW, EXPORT, PRR];
const factories = [{ id: '1', name: '1' }, { id: '2', name: '2' }];

const defaultValues = {
  vendorGroups: null,
  factories: factories.map(f => f.id),
  partTypes: partTypes.map(p => p.id),
  sortColumn: 'vdnam',
  sortDirection: 'desc',
  pageNumber: 1,
  pageSize: PAGE_SIZE,
  partNo: '',
  date: ''
};

export const state = () => ({
  vendorGroups: null,
  items: null,
  itemCount: 0,
  partTypes,
  factories,
  defaultValues
});

export const mutations = {
  setVendorGroups(state, vendorGroups) {
    state.vendorGroups = vendorGroups;
    const defaultValues = { ...state.defaultValues };
    defaultValues.vendorGroups = _.isEmpty(vendorGroups)
      ? null
      : vendorGroups.map(v => v.id);
    state.defaultValues = defaultValues;
  },

  setItems(state, items) {
    state.items = items;
  },

  setItemCount(state, itemCount) {
    state.itemCount = itemCount;
  }
};

export const actions = {
  async search(
    { commit },
    {
      vendorGroups,
      factories,
      partTypes,
      sortColumn,
      sortDirection,
      pageNumber,
      pageSize,
      partNo,
      date
    }
  ) {
    if (_.isNil(vendorGroups)) {
      commit('setItems', null);
      commit('setItemCount', 0);
    } else {
      vendorGroups = encodeURIComponent(vendorGroups.join(','));
      factories = encodeURIComponent(factories.join(','));
      partTypes = encodeURIComponent(partTypes.join(','));
      sortColumn = encodeURIComponent(sortColumn);
      sortDirection = encodeURIComponent(sortDirection);
      pageNumber = encodeURIComponent(pageNumber);
      pageSize = encodeURIComponent(pageSize);
      partNo = encodeURIComponent(partNo);
      date = encodeURIComponent(date);
      const { data } = await this.$axios.$get(
        `${BASE_URL}?vendorGroups=${vendorGroups}&factories=${factories}&partTypes=${partTypes}&sortColumn=${sortColumn}&sortDirection=${sortDirection}&pageNumber=${pageNumber}&pageSize=${pageSize}&partNo=${partNo}&date=${date}`
      );
      commit('setItems', data.items);
      commit('setItemCount', data.count);
    }
  },

  async getVendorGroups({ commit }) {
    const { data } = await this.$axios.$get(`${BASE_URL}/vendor-groups`);
    if (_.isEmpty(data)) {
      commit('setVendorGroups', null);
    } else {
      commit(
        'setVendorGroups',
        data.map(d => ({
          id: d.name,
          name: d.name
        }))
      );
    }
  }
};

export const getters = {
  vendorGroups: state => state.vendorGroups,
  items: state => state.items,
  itemCount: state => state.itemCount,
  partTypes: state => state.partTypes,
  factories: state => state.factories,
  defaultValues: state => state.defaultValues
};
