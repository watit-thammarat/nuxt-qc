export default ({ store, redirect, route }) => {
  if (!store.getters['auth/isAuthenticated']) {
    redirect(`/account/sign-in?redirectUrl=${route.path}`);
  }
};
