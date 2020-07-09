<template>
  <div
    ref="modal"
    class="modal"
  >
    <div class="modal-content center-align">
      <preloader size="big" />
    </div>
  </div>
</template>

<script>
import mixins from '~/mixins';
import modalMixins from '~/mixins/modal';

export default {
  name: 'QcModal',

  mixins: [mixins, modalMixins],

  methods: {
    async open(payload) {
      try {
        this.modal.open();
        await this.$store.dispatch('qc/getQC', payload);
        this.$emit('onDataLoaded');
      } catch (err) {
        this.showError(err);
      } finally {
        this.modal.close();
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.modal-content {
  padding: 28px;
}
</style>
