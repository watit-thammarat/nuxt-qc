<template>
  <div
    ref="modal"
    class="modal"
  >
    <div class="modal-content">
      <div class="row">
        <div class="input-field col s12">
          <textarea
            ref="detail"
            v-model.trim="detail"
            id="detail"
            class="materialize-textarea"
            :class="{invalid: $v.detail.$dirty && $v.detail.$invalid}"
            @input="$v.detail.$touch()"
          ></textarea>
          <label for="detail">Detail</label>
          <span
            v-if="$v.detail.$dirty && !$v.detail.required"
            class="helper-text"
            data-error="Detail is empty"
          ></span>
        </div>
      </div>
      <file-input
        ref="picture"
        title="Picture"
        :fileType="file.image"
        :fileName="pictureName"
        @onFileSelected="onPictureSelected"
        @onDeleted="onPictureDeleted"
      />
    </div>
    <div class="modal-footer">
      <button
        :disabled="loading"
        class="modal-close waves-effect waves-light btn red"
      >
        <i class="material-icons left">cancel</i>
        Cancel
      </button>
      <button
        :disabled="loading"
        class="waves-effect waves-light btn light-blue darken-1"
        @click="save"
      >
        <i class="material-icons left">save</i>
        {{ loading ? 'Saving...' : 'Save' }}
      </button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import _ from 'lodash';
import { required } from 'vuelidate/lib/validators';

import mixins from '~/mixins';
import modalMixins from '~/mixins/modal';

export default {
  name: 'ApprnStdSaveModal',

  mixins: [mixins, modalMixins],

  computed: {
    ...mapGetters({ items: 'part/apprnStds' }),
    pictureName() {
      return this.picture ? this.picture.name || this.picture : '';
    }
  },

  data() {
    return {
      partNo: null,
      itemNo: null,
      detail: null,
      picture: null
    };
  },

  validations: {
    detail: {
      required
    }
  },

  methods: {
    updateTextArea() {
      this.$nextTick(() => {
        M.textareaAutoResize(this.$refs.detail);
      });
    },

    updateForm() {
      this.updateTextFields();
      this.updateTextArea();
      this.$v.$reset();
      this.modal.open();
    },

    showAdd(partNo) {
      this.isAdd = true;
      this.partNo = partNo;
      this.itemNo = null;
      this.detail = null;
      this.picture = null;
      this.$refs.picture.isValid = true;
      this.updateForm();
    },

    showEdit(partNo, itemNo) {
      this.isAdd = false;
      this.partNo = partNo;
      const item = _.find(
        this.items,
        i => i.part.id === this.partNo && i.itemNo === itemNo
      );
      this.itemNo = item.itemNo;
      this.detail = item.detail;
      this.picture = item.picture;
      this.$refs.picture.isValid = true;
      this.updateForm();
    },

    onPictureSelected(file) {
      this.picture = file;
    },

    onPictureDeleted() {
      this.picture = null;
    },

    async save() {
      this.$v.$touch();
      const isValidPicture = this.$refs.picture.validateOnSave();
      if (this.$v.$invalid || !isValidPicture) {
        return;
      }
      try {
        this.loading = true;
        const payload = {
          partNo: this.partNo,
          itemNo: this.itemNo,
          detail: this.detail,
          picture: this.picture
        };
        if (this.isAdd) {
          await this.$store.dispatch('part/createApprnStd', payload);
        } else {
          await this.$store.dispatch('part/updateApprnStd', payload);
        }
        this.modal.close();
        M.toast({ html: 'Apprn Std has been successfully saved' });
      } catch (err) {
        this.showError(err);
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.row:last-child {
  margin-bottom: 0;
}
</style>
