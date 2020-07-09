import { mapGetters } from 'vuex';

export default {
  ...mapGetters({
    isAuthenticated: 'auth/isAuthenticated',
    profile: 'auth/profile',
    isAdmin: 'auth/isAdmin',
    isQC: 'auth/isQC'
  }),

  isSmall() {
    return this.$mq === 'sm';
  },

  isMedium() {
    return this.$mq === 'md';
  },

  isLarge() {
    return this.$mq === 'l';
  },

  isExtraLarge() {
    return this.$mq === 'xl';
  },

  isSmallAndUp() {
    return ['sm', 'md', 'l', 'xl'].some(x => x === this.$mq);
  },

  isMediumAndUp() {
    return ['md', 'l', 'xl'].some(x => x === this.$mq);
  },

  isLargeAndUp() {
    return ['l', 'xl'].some(x => x === this.$mq);
  },

  isLargeAndDown() {
    return ['sm', 'md', 'l'].some(x => x === this.$mq);
  },

  isMediumAndDown() {
    return ['sm', 'md'].some(x => x === this.$mq);
  }
};
