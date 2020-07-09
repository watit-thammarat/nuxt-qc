<template>
  <div class="preloader__container">
    <div :class="classNames">
      <div class="spinner-layer spinner-blue">
        <div class="circle-clipper left">
          <div class="circle"></div>
        </div>
        <div class="gap-patch">
          <div class="circle"></div>
        </div>
        <div class="circle-clipper right">
          <div class="circle"></div>
        </div>
      </div>

      <div class="spinner-layer spinner-red">
        <div class="circle-clipper left">
          <div class="circle"></div>
        </div>
        <div class="gap-patch">
          <div class="circle"></div>
        </div>
        <div class="circle-clipper right">
          <div class="circle"></div>
        </div>
      </div>

      <div class="spinner-layer spinner-yellow">
        <div class="circle-clipper left">
          <div class="circle"></div>
        </div>
        <div class="gap-patch">
          <div class="circle"></div>
        </div>
        <div class="circle-clipper right">
          <div class="circle"></div>
        </div>
      </div>

      <div class="spinner-layer spinner-green">
        <div class="circle-clipper left">
          <div class="circle"></div>
        </div>
        <div class="gap-patch">
          <div class="circle"></div>
        </div>
        <div class="circle-clipper right">
          <div class="circle"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash';

import mixins from '~/mixins';

export default {
  name: 'Preloader',

  mixins: [mixins],

  props: {
    size: {
      type: String,
      default: ''
    },

    active: {
      type: Boolean,
      default: true
    }
  },

  computed: {
    classNames() {
      let data = 'preloader-wrapper';
      if (!_.isEmpty(this.size)) {
        data = `${data} ${this.size}`;
      }
      if (this.active) {
        data = `${data} active`;
      }
      return data;
    }
  }
};
</script>

<style lang="scss" scoped>
.preloader__container {
  display: inline-block;

  .tiny {
    width: 24px;
    height: 24px;
  }
}
</style>
