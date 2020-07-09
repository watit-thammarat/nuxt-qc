export default ({ store, redirect, route }) => {
  if (!store.getters['auth/isQC']) {
    store.dispatch('auth/signout');
    store.dispatch('auth/setUnauthorized', true);
    redirect(`/account/sign-in?redirectUrl=${route.path}`);
  }
};
