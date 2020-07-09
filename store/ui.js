export const state = () => ({
  popupImage: null,
  loadingPopupImage: false
});

export const mutations = {
  setPopupImage(state, popupImage) {
    state.popupImage = popupImage;
  },

  setLoadingPopupImage(state, value) {
    state.loadingPopupImage = value;
  }
};

export const actions = {
  showPopupImage({ commit }, payload) {
    commit('setPopupImage', payload);
    commit('setLoadingPopupImage', true);
  },

  hidePopupImage({ commit }) {
    commit('setPopupImage', null);
    commit('setLoadingPopupImage', false);
  },

  setLoadingPopupImage({ commit }, payload) {
    commit('setLoadingPopupImage', payload);
  }
};

export const getters = {
  popupImage: state => state.popupImage,
  loadingPopupImage: state => state.loadingPopupImage
};
