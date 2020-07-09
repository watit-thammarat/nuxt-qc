import Vue from 'vue';
import VueMq from 'vue-mq';

Vue.use(VueMq, {
  breakpoints: {
    sm: 600,
    md: 992,
    l: 1200,
    xl: Infinity
  }
});
