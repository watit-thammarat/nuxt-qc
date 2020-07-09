import _ from 'lodash';

import { PAGE_SIZE } from '../constants/pagination';

const BASE_URL = '/sampling';

const samplingTypes = [
  {
    id: '1',
    name: 'สุ่มแบบปกติ'
  },
  {
    id: '2',
    name: 'สุ่มแบบเข้มงวด'
  }
];

const defaultValues = {
  keyword: '',
  pageNumber: 1,
  pageSize: PAGE_SIZE,
  sortColumn: 'upddttm',
  sortDirection: 'desc'
};

export const state = () => ({
  items: null,
  itemCount: 0,
  defaultValues,
  samplingTypes
});

export const mutations = {
  setItems(state, items) {
    state.items = items;
  },

  setItemCount(state, itemCount) {
    state.itemCount = itemCount;
  }
};

export const actions = {
  async getItems(
    { commit },
    { keyword, pageNumber, pageSize, sortColumn, sortDirection } = defaultValues
  ) {
    keyword = encodeURIComponent(keyword);
    pageNumber = encodeURIComponent(pageNumber);
    pageSize = encodeURIComponent(pageSize);
    sortColumn = encodeURIComponent(sortColumn);
    sortDirection = encodeURIComponent(sortDirection);
    const url = `${BASE_URL}?keyword=${keyword}&pageNumber=${pageNumber}&pageSize=${pageSize}&sortColumn=${sortColumn}&sortDirection=${sortDirection}`;
    const { data } = await this.$axios.$get(url);
    commit('setItems', data.items);
    commit('setItemCount', data.count);
  },

  async addItem(_, payload) {
    await this.$axios.$post(BASE_URL, payload);
  },

  async updateItem(_, { type, level }) {
    type = encodeURIComponent(type);
    level = encodeURIComponent(level);
    const url = `${BASE_URL}/${type}/${level}`;
    await this.$axios.$put(url, payload);
  },

  async deleteItem(_, { type, level }) {
    type = encodeURIComponent(type);
    level = encodeURIComponent(level);
    const url = `${BASE_URL}/${type}/${level}`;
    await this.$axios.$delete(url);
  }
};

export const getters = {
  items: state => state.items,
  itemCount: state => state.itemCount,
  defaultValues: state => state.defaultValues,
  samplingTypes: state => state.samplingTypes
};
