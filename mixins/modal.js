export default {
  data() {
    return {
      isAdd: true,
      modal: null,
      loading: false
    };
  },

  mounted() {
    if (process.client) {
      this.modal = M.Modal.init(this.$refs.modal, {
        dismissible: false
      });
    }
  },

  destroyed() {
    if (this.modal) {
      this.modal.destroy();
    }
  }
};
