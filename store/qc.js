import _ from 'lodash';

import { PRR } from '../constants/partTypes';

const BASE_URL = '/qc';

export const state = () => ({
  data: null,
  PRR
});

export const mutations = {
  setData(state, data) {
    state.data = data;
  },

  clearData(state) {
    state.data = null;
  }
};

export const actions = {
  async getQC({ commit }, { part, serial, invoice, vendor }) {
    part = encodeURIComponent(part);
    serial = encodeURIComponent(serial);
    invoice = encodeURIComponent(invoice);
    vendor = encodeURIComponent(vendor);
    const url = `${BASE_URL}?part=${part}&serial=${serial}&invoice=${invoice}&vendor=${vendor}`;
    const { data } = await this.$axios.$get(url);
    commit('setData', data);
  },

  async saveQC(_, payload) {
    await this.$axios.$post(BASE_URL, payload);
  },

  clearData({ commit }) {
    commit('clearData');
  }
};

export const getters = {
  data: state => state.data,
  PRR: state => state.PRR
};
