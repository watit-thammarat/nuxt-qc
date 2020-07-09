import Vue from 'vue';

import dateFilter from '../filters/date';
import dateTimeFilter from '../filters/datetime';
import numberFilter from '../filters/number';

Vue.filter('date', dateFilter);
Vue.filter('datetime', dateTimeFilter);
Vue.filter('number', numberFilter);
