<template>
  <div class="pdf__container">
    <div class="loader__container grey lighten-2">
      <preloader size="big" />
    </div>
    <iframe
      @load="onPdfLoaded"
      v-if="show"
      :src="url"
      frameborder="0"
    ></iframe>
  </div>
</template>

<script>
import mixins from '~/mixins';

export default {
  name: 'Pdf',

  mixins: [mixins],

  props: {
    pdf: {
      type: String,
      required: true
    }
  },

  computed: {
    url() {
      // return `https://docs.google.com/gview?url=${this.config.baseAssetUrl}/${
      //   this.pdf
      // }&embedded=true`;
      return `${this.config.baseAssetUrl}/${this.pdf}`;
    }
  },

  data() {
    return {
      show: false,
      timer: null
    };
  },

  methods: {
    configureLoadingStrategy() {
      this.timer = setInterval(() => {
        this.show = false;
        this.$nextTick(() => {
          this.show = true;
        });
      }, 15000);
    },

    onPdfLoaded() {
      this.clearTimer();
    },

    clearTimer() {
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
    }
  },

  mounted() {
    this.show = true;
    this.configureLoadingStrategy();
  },

  destroyed() {
    this.clearTimer();
  }
};
</script>

<style lang="scss" scoped>
.pdf__container {
  position: relative;
  width: 100%;
  height: 100%;

  .loader__container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
}
</style>
