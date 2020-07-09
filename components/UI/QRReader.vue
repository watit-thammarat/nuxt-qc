<template>
  <div
    ref="modal"
    class="modal"
  >
    <div class="modal-content center-align">
      <button
        @click="close()"
        class="btn-floating waves-effect waves-light red"
      >
        <i class="material-icons">close</i>
      </button>
      <qrcode-reader
        v-if="show"
        :class="{ hide: !ready }"
        @init="onInit"
        @decode="onDecode"
      />
      <preloader v-if="!ready" />
      <h6 v-if="error">{{ error }}</h6>
    </div>
  </div>
</template>

<script>
import mixins from '~/mixins';
import modalMixins from '~/mixins/modal';
import { eventBus } from '~/plugins/eventBus';
import { GET_QC_CODE_VALUE } from '~/constants/eventBus';

export default {
  name: 'QrReader',

  mixins: [mixins, modalMixins],

  data() {
    return {
      show: false,
      loading: false,
      ready: false,
      error: null
    };
  },

  methods: {
    onDecode(value) {
      eventBus.$emit(GET_QC_CODE_VALUE, value);
      this.close();
    },

    async onInit(promise) {
      try {
        await promise;
      } catch (error) {
        if (error.name === 'NotAllowedError') {
          this.error = 'user denied camera access permisson';
        } else if (error.name === 'NotFoundError') {
          this.error = 'no suitable camera device installed';
        } else if (error.name === 'NotSupportedError') {
          this.error = 'page is not served over HTTPS (or localhost)';
        } else if (error.name === 'NotReadableError') {
          this.error = 'maybe camera is already in use';
        } else if (error.name === 'OverconstrainedError') {
          // passed constraints don't match any camera.
          this.error =
            'Did you requested the front camera although there is none?';
        } else {
          this.error = 'browser might be lacking features (WebRTC, ...)';
        }
        this.show = false;
      } finally {
        this.ready = true;
      }
    },

    open() {
      this.show = true;
      this.modal.open();
    },

    close() {
      this.show = false;
      this.ready = false;
      this.error = null;
      this.modal.close();
    }
  }
};
</script>

<style lang="scss" scoped>
.modal {
  overflow: visible;
  max-width: 640px;
  max-height: 100%;

  .modal-content {
    position: relative;
    overflow: visible;
    max-width: 640px;
    max-height: 100%;

    .hide {
      display: none;
    }

    button {
      position: absolute;
      top: -16px;
      right: -16px;
    }
  }
}
</style>
