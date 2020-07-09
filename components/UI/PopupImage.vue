<template>
  <img
    v-if="image"
    :style="{top: top, left: left}"
    class="materialboxed"
    :src="src"
    @error="onImageError"
    @load="onImageLoaded"
  >
</template>

<script>
import { mapGetters } from 'vuex';

import mixins from '~/mixins';

export default {
  name: 'PopupImage',

  mixins: [mixins],

  computed: {
    ...mapGetters({ image: 'ui/popupImage' }),
    src() {
      const { name } = this.image;
      console.log(this.config.baseAssetUrl);
      return name ? `${this.config.baseAssetUrl}/${name}` : '';
    },

    top() {
      const { top } = this.image;
      return top ? `${top}px` : 0;
    },

    left() {
      const { left } = this.image;
      return left ? `${left}px` : 0;
    }
  },

  methods: {
    reset() {
      this.$store.dispatch('ui/hidePopupImage');
    },

    getContainerDOM() {
      return document.querySelector('.material-placeholder');
    },

    getImageDOM() {
      return document.querySelector('.materialboxed');
    },

    onImageError() {
      this.reset();
      alert('Cannot open image');
    },

    onImageLoaded() {
      this.$store.dispatch('ui/setLoadingPopupImage', false);
      const imageDOM = this.getImageDOM();
      let containerDOM;
      const ref = M.Materialbox.init(imageDOM, {
        onOpenStart: () => {
          containerDOM = this.getContainerDOM();
          containerDOM.style.zIndex = '3000';
        },
        onCloseStart: () => {
          containerDOM = this.getContainerDOM();
          containerDOM.style.top = this.top;
          containerDOM.style.left = this.left;
        },
        onCloseEnd: () => {
          ref.destroy();
          this.reset();
        }
      });
      const image = M.Materialbox.getInstance(imageDOM);
      image.open();
    }
  }
};
</script>

<style lang="scss" scoped>
.materialboxed {
  position: absolute;
  width: 24px;
}
</style>
