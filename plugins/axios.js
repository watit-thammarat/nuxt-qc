import https from 'https';

export default ({ $axios, store, redirect, route }) => {
  $axios.defaults.httpsAgent = new https.Agent({ rejectUnauthorized: false });

  $axios.onRequest(config => {
    const token = store.getters['auth/token'];
    if (token) {
      config.headers = { Authorization: `Bearer ${token}` };
    }
    return config;
  });

  $axios.onError(error => {
    const code = parseInt(error.response && error.response.status);
    if (code === 401) {
      store.dispatch('auth/signout');
      redirect(`/account/sign-in?redirectUrl=${route.path}`);
    }
  });
};
