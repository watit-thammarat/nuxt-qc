export const state = () => ({
  title: 'TNS QC'
});

export const mutations = {
  setTitle(state, title) {
    state.title = title;
  }
};

export const actions = {
  setTitle({ commit }, payload) {
    commit('setTitle', payload);
  }
};

export const getters = {
  title: state => state.title
};
