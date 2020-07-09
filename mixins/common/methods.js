import { eventBus } from '../../plugins/eventBus';
import { SHOW_POPUP_PDF } from '../../constants/eventBus';

export default {
  showError(err) {
    console.error(err);
    const html = err.response ? err.response.data.message : err.message || err;
    M.toast({ html });
  },

  showImage(name, { pageX, pageY }) {
    this.$store.dispatch('ui/showPopupImage', {
      name,
      top: pageY,
      left: pageX
    });
  },

  showPDF(pdf) {
    eventBus.$emit(SHOW_POPUP_PDF, pdf);
  },

  updateTextFields() {
    this.$nextTick(() => {
      M.updateTextFields();
    });
  },

  hideScrollbar() {
    this.$nextTick(() => {
      document.body.style.overflow = 'hidden';
    });
  },

  showScrollbar() {
    this.$nextTick(() => {
      document.body.style.overflow = 'scroll';
    });
  }
};
