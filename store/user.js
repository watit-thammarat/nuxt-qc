import { PAGE_SIZE } from '../constants/pagination';

const BASE_URL = '/users';

const defaultValues = {
  keyword: '',
  pageNumber: 1,
  pageSize: PAGE_SIZE,
  sortColumn: 'upddttm',
  sortDirection: 'desc'
};

export const state = () => ({
  users: null,
  userCount: 0,
  roles: null,
  vendorGroups: null,
  tnsUsers: null,
  searchUsers: null,
  defaultValues
});

export const mutations = {
  setUsers(state, users) {
    state.users = users;
  },

  setUserCount(state, userCount) {
    state.userCount = userCount;
  },

  setRoles(state, roles) {
    state.roles = roles;
  },

  setVendorGroups(state, vendorGroups) {
    state.vendorGroups = vendorGroups;
  },

  setTnsUsers(state, tnsUsers) {
    state.tnsUsers = tnsUsers;
  },

  setSearchUsers(state, tnsUsers) {
    state.searchUsers = tnsUsers.reduce((acc, { fullName }) => {
      acc[fullName] = null;
      return acc;
    }, {});
  },

  updateUser(state, user) {
    const i = state.users.findIndex(u => u.id === user.id);
    const users = [...state.users];
    users[i] = user;
    state.users = users;
  }
};

export const actions = {
  async getUsers(
    { commit },
    { keyword, pageNumber, pageSize, sortColumn, sortDirection } = defaultValues
  ) {
    pageSize = encodeURIComponent(pageSize);
    pageNumber = encodeURIComponent(pageNumber);
    keyword = encodeURIComponent(keyword);
    sortColumn = encodeURIComponent(sortColumn);
    sortDirection = encodeURIComponent(sortDirection);
    const { data } = await this.$axios.$get(
      `${BASE_URL}?pageSize=${pageSize}&pageNumber=${pageNumber}&keyword=${keyword}&sortColumn=${sortColumn}&sortDirection=${sortDirection}`
    );
    commit('setUsers', data.items);
    commit('setUserCount', data.count);
    return data;
  },

  async getRoles({ commit }) {
    const { data } = await this.$axios.$get('/roles');
    commit('setRoles', data);
  },

  async getVendorGroups({ commit }) {
    const { data } = await this.$axios.$get('/vendors/groups');
    commit('setVendorGroups', data);
  },

  async getTnsUsers({ commit }) {
    const { data } = await this.$axios.$get('/tns-users');
    commit('setTnsUsers', data);
    commit('setSearchUsers', data);
  },

  async createUser({ dispatch }, { id, roles, vendorGroups }) {
    await this.$axios.$post(BASE_URL, {
      id,
      roles,
      vendorGroups
    });
    dispatch('getTnsUsers');
  },

  async updateUser({ commit }, { id, roles, vendorGroups }) {
    id = encodeURIComponent(id);
    const { data } = await this.$axios.$put(`${BASE_URL}/${id}`, {
      id,
      roles,
      vendorGroups
    });
    commit('updateUser', data);
  },

  async deleteUser({ dispatch }, { id }) {
    id = encodeURIComponent(id);
    await this.$axios.$delete(`${BASE_URL}/${id}`);
    dispatch('getTnsUsers');
  }
};

export const getters = {
  users: state => state.users,
  userCount: state => state.userCount,
  vendorGroups: state => state.vendorGroups,
  roles: state => state.roles,
  tnsUsers: state => state.tnsUsers,
  searchUsers: state => state.searchUsers,
  defaultValues: state => state.defaultValues
};
