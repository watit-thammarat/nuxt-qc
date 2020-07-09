<template>
  <div class="row">
    <div class="col s12">
      <div class="file-input__container">
        <button
          :disabled="hasFileName()"
          @click="handleClick"
          class="waves-effect waves-light btn btn-large "
          :class="isValid ? 'light-blue darken-1' :'red'"
        >
          <i class=" material-icons left ">{{ getFileIcon() }}</i>
          {{ title }} {{ isValid ? '' : 'is required' }}
        </button>
        <div
          class="file-button"
          v-if=" hasFileName()"
        >
          <i class="material-icons medium large light-blue-text text-darken-1">
            {{ getFileIcon() }}
          </i>
          <button
            @click="handleDelete"
            class="btn-small btn-floating waves-effect waves-light red"
            :class="{ image: fileType === file.image }"
          >
            <i class="material-icons">delete</i>
          </button>
        </div>
        <input
          style="display: none;"
          :accept="fileType"
          ref="file"
          type="file"
          @change="handleChange"
        >
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash';

import mixins from '~/mixins';

export default {
  name: 'FileInput',

  mixins: [mixins],

  props: {
    title: {
      type: String,
      required: true
    },
    fileName: {
      type: String,
      required: false
    },
    fileType: {
      type: String,
      required: false
    }
  },

  data() {
    return {
      isValid: true
    };
  },

  methods: {
    getFileIcon() {
      return this.fileType === this.file.pdf ? 'picture_as_pdf' : 'image';
    },

    validate(file) {
      if (file.size > this.file.size * 1024 * 1024) {
        this.showError(`File size exceeds limit (${this.file.size} MB)`);
        return false;
      }
      return true;
    },

    validateOnSave() {
      if (!this.hasFileName()) {
        this.isValid = false;
        return false;
      }
      return true;
    },

    handleClick() {
      this.$refs.file.click();
    },

    handleChange(e) {
      this.isValid = true;
      const file = e.target.files[0];
      if (this.validate(file)) {
        this.$emit('onFileSelected', file);
      }
      this.$refs.file.value = '';
    },

    handleDelete() {
      this.$emit('onDeleted');
    },

    hasFileName() {
      return !_.isEmpty(this.fileName);
    }
  }
};
</script>

<style lang="scss" scoped>
.file-input__container {
  display: flex;
  align-items: center;

  .file-button {
    display: block;
    position: relative;
    margin-left: 16px;

    button {
      position: absolute;
      top: -8px;
      right: -8px;

      &.image {
        top: -4px;
        right: -4px;
      }
    }
  }
}
</style>
