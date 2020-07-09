<template>
  <div>
    <popup-image />
    <popup-pdf ref="popupPDF" />
    <qr-reader ref="qrCode" />
    <navbar />
    <main class="app-container">
      <nuxt />
    </main>
  </div>
</template>

<script>
import mixins from '~/mixins';
import Navbar from '~/components/Navbar';
import { eventBus } from '~/plugins/eventBus';
import { SHOW_QC_CODE, SHOW_POPUP_PDF } from '~/constants/eventBus';

export default {
  name: 'Layout',

  mixins: [mixins],

  components: {
    Navbar
  },

  methods: {
    showPopupPDF(pdf) {
      this.$refs.popupPDF.open(pdf);
    },

    showQRCode() {
      this.$refs.qrCode.open();
    }
  },

  created() {
    eventBus.$on(SHOW_POPUP_PDF, this.showPopupPDF);
    eventBus.$on(SHOW_QC_CODE, this.showQRCode);
  },

  mounted() {
    this.$nextTick(() => {
      this.$forceUpdate();
    });
  },

  destroyed() {
    eventBus.$off(SHOW_POPUP_PDF, this.showPopupPDF);
    eventBus.$off(SHOW_QC_CODE, this.showQRCode);
  }
};
</script>

<style lang="scss" scoped>
</style>
