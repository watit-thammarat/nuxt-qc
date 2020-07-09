import _ from 'lodash';

const hasNoQCAccess = (store, url) => {
  const isQC = store.getters['auth/isQC'];
  return url.startsWith('/qc') && !isQC;
};

const hasNoAdminAccess = (store, url) => {
  const isAdmin = store.getters['auth/isAdmin'];
  return url.startsWith('/admin') && !isAdmin;
};

export default ({ store, redirect, route }) => {
  if (!store.getters['auth/isAuthenticated']) {
    return;
  }
  const url = route.query.redirectUrl || '/';
  if (hasNoQCAccess(store, url) || hasNoAdminAccess(store, url)) {
    store.dispatch('auth/signout');
    store.dispatch('auth/setUnauthorized', true);
  } else {
    redirect(url);
  }
};
