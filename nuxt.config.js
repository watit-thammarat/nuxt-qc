require('dotenv-flow').config();

const pkg = require('./package');

const BASE_URL = process.env.BASE_URL;
const BASE_API_URL = `${BASE_URL}/api`;
const BASE_ASSET_URL = `${BASE_URL}/files`;

module.exports = {
  mode: 'universal',

  /*
   ** Headers of the page
   */
  head: {
    title: 'TNS QC INSPECTION',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: pkg.description }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
  },

  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#fff', height: '4px', duration: 7000 },

  /*
   ** Global CSS
   */
  css: ['~/assets/css/app.scss'],

  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    '~/plugins/axios.js',
    { src: '~/plugins/materializeCss.js', ssr: false },
    '~/plugins/vuelidate.js',
    '~/plugins/components.js',
    { src: '~/plugins/mediaQuery.js', ssr: false },
    '~/plugins/filter.js',
    '~/plugins/eventBus.js',
    { src: '~/plugins/qrReader.js', ssr: false }
  ],

  /*
   ** Nuxt.js modules
   */
  modules: ['@nuxtjs/axios'],

  /*
   ** Build configuration
   */
  build: {
    extend(config, ctx) {}
  },

  server: {
    port: 4000,
    host: '0.0.0.0'
  },

  env: {
    baseUrl: BASE_URL,
    baseApiUrl: BASE_API_URL,
    baseAssetUrl: BASE_ASSET_URL
  },

  axios: {
    baseURL: BASE_API_URL,
    credentials: false
  },

  router: {
    middleware: ['initAuth'],
    extendRoutes(routes, resolve) {
      routes.push({
        path: '*',
        component: resolve(__dirname, 'pages/index.vue')
      });
    }
  },

  transition: {
    name: 'fade',
    mode: 'out-in'
  }
};
