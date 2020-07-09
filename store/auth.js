import jwt from 'jsonwebtoken';
import moment from 'moment';
import _ from 'lodash';

import { ADMIN, QC } from '../constants/roles';
import * as ls from '../utils/localStorage';
import * as cookie from '../utils/cookie';

export const state = () => ({
  token: null,
  profile: null,
  unauthorized: false
});

export const mutations = {
  setToken(state, token) {
    state.token = token;
  },

  setProfile(state, profile) {
    state.profile = profile;
  },

  setUnauthorized(state, unauthorized) {
    state.unauthorized = unauthorized;
  }
};

export const actions = {
  async authenticate({ commit }, body) {
    const {
      data: { token, profile }
    } = await this.$axios.$post('/account/sign-in', body);
    commit('setToken', token);
    commit('setProfile', profile);
    ls.setToken(token);
    cookie.setToken(token);
  },

  async initAuth({ commit, dispatch }, req) {
    let token;
    if (process.client) {
      token = ls.getToken();
    } else if (req.headers.cookie) {
      token = cookie.getToken(req.headers.cookie);
    }
    if (!token) {
      return;
    }
    const { id, exp } = jwt.decode(token);
    if (moment().isAfter(moment.unix(exp))) {
      dispatch('signout');
    } else {
      commit('setToken', token);
      await dispatch('setProfile', { id });
    }
  },

  async setProfile({ commit }, { id }) {
    id = encodeURIComponent(id);
    const { data } = await this.$axios.$get(`/profile/${id}`);
    commit('setProfile', data);
  },

  signout({ commit }) {
    commit('setToken', null);
    commit('setProfile', null);
    if (process.client) {
      ls.removeToken();
      cookie.removeToken();
    }
  },

  setUnauthorized({ commit }, payload) {
    commit('setUnauthorized', payload);
  }
};

export const getters = {
  isAuthenticated: state => !!state.token,
  token: state => state.token,
  profile: state => state.profile,
  unauthorized: state => state.unauthorized,
  isAdmin: state =>
    !!(
      state.profile &&
      _.isArray(state.profile.roles) &&
      state.profile.roles.some(r => r.id === ADMIN.id)
    ),
  isQC: state =>
    !!(
      state.profile &&
      _.isArray(state.profile.roles) &&
      state.profile.roles.some(r => r.id === QC.id)
    )
};
