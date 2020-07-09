<template>
  <div
    class="slide-popup__container"
    :class="containerClass"
  >
    <nav>
      <div class="nav-wrapper">
        <span class="brand-logo">PDF</span>
        <a
          @click.prevent="close()"
          href="#!"
        ><i class="material-icons small">close</i></a>
      </div>
    </nav>
    <main v-if="pdf">
      <pdf :pdf="pdf" />
    </main>
  </div>
</template>

<script>
import mixins from '~/mixins';

export default {
  name: 'PopuupPDF',

  mixins: [mixins],

  data() {
    return {
      containerClass: '',
      pdf: null
    };
  },

  methods: {
    open(pdf) {
      this.pdf = pdf;
      this.containerClass = 'up';
      this.hideScrollbar();
    },

    close() {
      this.containerClass = 'down';
      this.showScrollbar();
      setTimeout(() => {
        this.pdf = null;
      }, 500);
    }
  }
};
</script>

<style lang="scss" scoped>
main {
  width: 100%;
  height: calc(100vh - 69px);
}
</style>
