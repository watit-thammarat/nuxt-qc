import _ from 'lodash';

import { PAGE_SIZE } from '../constants/pagination';

const PART_URL = '/parts';
const UPLOAD_URL = '/uploads';

const defaultValues = {
  keyword: '',
  pageNumber: 1,
  pageSize: PAGE_SIZE,
  sortColumn: 'partno',
  sortDirection: 'desc'
};

export const state = () => ({
  parts: null,
  searchParts: null,
  fileStds: null,
  fileStdCount: 0,
  apprnStds: null,
  defaultValues
});

export const mutations = {
  setParts(state, parts) {
    state.parts = parts;
  },

  setSearchParts(state, parts) {
    if (!parts) {
      state.searchParts = {};
    } else {
      state.searchParts = parts.reduce((acc, { id }) => {
        acc[id] = null;
        return acc;
      }, {});
    }
  },

  setFileStds(state, fileStds) {
    state.fileStds = fileStds;
  },

  setFileStdCount(state, fileStdCount) {
    state.fileStdCount = fileStdCount;
  },

  setApprnStds(state, apprnStds) {
    state.apprnStds = apprnStds;
  },

  updateFileStd(state, fileStd) {
    const i = state.fileStds.findIndex(f => f.part.id === fileStd.part.id);
    const fileStds = [...state.fileStds];
    fileStds[i] = fileStd;
    state.fileStds = fileStds;
  },

  appendApprnStd(state, apprnStd) {
    if (_.isNil(state.apprnStds)) {
      state.apprnStds = [];
    }
    state.apprnStds = [...state.apprnStds, apprnStd];
  },

  updateApprnStd(state, apprnStd) {
    const i = state.apprnStds.findIndex(
      f => f.part.id === apprnStd.part.id && f.itemNo === apprnStd.itemNo
    );
    const apprnStds = [...state.apprnStds];
    apprnStds[i] = apprnStd;
    state.apprnStds = apprnStds;
  },

  deleteApprnStd(state, { partNo, itemNo }) {
    state.apprnStds = state.apprnStds.filter(
      f => !(f.part.id === partNo && f.itemNo === itemNo)
    );
  },

  clearApprnStds(state) {
    state.apprnStds = null;
  }
};

export const actions = {
  async getParts({ commit }) {
    const { data } = await this.$axios.$get('/parts');
    commit('setParts', data);
    commit('setSearchParts', data);
  },

  async getFileStds(
    { commit },
    { keyword, pageNumber, pageSize, sortColumn, sortDirection } = defaultValues
  ) {
    pageSize = encodeURIComponent(pageSize);
    pageNumber = encodeURIComponent(pageNumber);
    keyword = encodeURIComponent(keyword);
    sortColumn = encodeURIComponent(sortColumn);
    sortDirection = encodeURIComponent(sortDirection);
    const url = `${PART_URL}/file-std?pageSize=${pageSize}&pageNumber=${pageNumber}&keyword=${keyword}&sortColumn=${sortColumn}&sortDirection=${sortDirection}`;
    const { data } = await this.$axios.$get(url);
    commit('setFileStds', data.items);
    commit('setFileStdCount', data.count);
  },

  async getApprnStdsByPartNo({ commit }, { partNo }) {
    commit('setApprnStds', null);
    partNo = encodeURIComponent(partNo);
    const { data } = await this.$axios.$get(`${PART_URL}/${partNo}/apprn-std`);
    commit('setApprnStds', data);
  },

  async deleteFileStd({ dispatch }, { partNo }) {
    partNo = encodeURIComponent(partNo);
    await this.$axios.$delete(`${PART_URL}/${partNo}/file-std`);
    await dispatch('getParts');
  },

  async createFileStd({ dispatch }, { partNo, trouble, appearance }) {
    let troubleResult = null;
    if (!_.isNil(trouble)) {
      const troubleForm = new FormData();
      troubleForm.append('file', trouble);
      troubleResult = await this.$axios.$post(
        `${UPLOAD_URL}/pdf`,
        troubleForm,
        {
          headers: { 'Content-Type': 'multipart/form-data' }
        }
      );
    }
    const appearanceForm = new FormData();
    appearanceForm.append('file', appearance);
    const appearanceResult = await this.$axios.$post(
      `${UPLOAD_URL}/pdf`,
      appearanceForm,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    const body = {
      partNo,
      trouble: _.get(troubleResult, 'data.filename', null),
      appearance: appearanceResult.data.filename
    };
    partNo = encodeURIComponent(partNo);
    await this.$axios.$post(`${PART_URL}/${partNo}/file-std`, body);
    await dispatch('getParts');
  },

  async updateFileStd({ commit }, { partNo, trouble, appearance }) {
    let troubleName = trouble;
    if (_.isObject(trouble)) {
      const troubleForm = new FormData();
      troubleForm.append('file', trouble);
      const troubleResult = await this.$axios.$post(
        `${UPLOAD_URL}/pdf`,
        troubleForm,
        {
          headers: { 'Content-Type': 'multipart/form-data' }
        }
      );
      troubleName = troubleResult.data.filename;
    }
    let appearanceName = appearance;
    if (_.isObject(appearance)) {
      const appearanceForm = new FormData();
      appearanceForm.append('file', appearance);
      const appearanceResult = await this.$axios.$post(
        `${UPLOAD_URL}/pdf`,
        appearanceForm,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      appearanceName = appearanceResult.data.filename;
    }
    const body = {
      partNo,
      trouble: troubleName,
      appearance: appearanceName
    };
    partNo = encodeURIComponent(partNo);
    const { data } = await this.$axios.$put(
      `${PART_URL}/${partNo}/file-std`,
      body
    );
    commit('updateFileStd', data);
  },

  async createApprnStd({ commit }, { partNo, detail, picture }) {
    const form = new FormData();
    form.append('file', picture);
    const pictureResult = await this.$axios.$post(`${UPLOAD_URL}/image`, form, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    const body = {
      partNo,
      detail,
      picture: pictureResult.data.filename
    };
    partNo = encodeURIComponent(partNo);
    const { data } = await this.$axios.$post(
      `${PART_URL}/${partNo}/apprn-std`,
      body
    );
    commit('appendApprnStd', data);
  },

  async updateApprnStd({ commit }, { partNo, itemNo, detail, picture }) {
    let pictureName = picture;
    if (_.isObject(picture)) {
      const form = new FormData();
      form.append('file', picture);
      const pictureResult = await this.$axios.$post(
        `${UPLOAD_URL}/image`,
        form,
        {
          headers: { 'Content-Type': 'multipart/form-data' }
        }
      );
      pictureName = pictureResult.data.filename;
    }
    const body = {
      partNo,
      itemNo,
      detail,
      picture: pictureName
    };
    partNo = encodeURIComponent(partNo);
    const { data } = await this.$axios.$put(
      `${PART_URL}/${partNo}/apprn-std/${itemNo}`,
      body
    );
    commit('updateApprnStd', data);
  },

  async deleteApprnStd({ commit }, { partNo, itemNo }) {
    partNo = encodeURIComponent(partNo);
    itemNo = encodeURIComponent(itemNo);
    await this.$axios.$delete(`${PART_URL}/${partNo}/apprn-std/${itemNo}`);
    commit('deleteApprnStd', { partNo, itemNo });
  },

  clearApprnStds({ commit }) {
    commit('clearApprnStds');
  }
};

export const getters = {
  parts: state => state.parts,
  searchParts: state => state.searchParts,
  fileStds: state => state.fileStds,
  fileStdCount: state => state.fileStdCount,
  apprnStds: state => state.apprnStds,
  defaultValues: state => state.defaultValues
};
