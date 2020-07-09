<template>
  <div
    ref="modal"
    class="modal"
  >
    <div class="modal-content">
      <div class="row">
        <div class="input-field col s12">
          <input
            :disabled="!isAdd"
            ref="autocomplete"
            :class="{ invalid: !isValidPartNo}"
            id="partNo"
            type="text"
            @input="onPartNoChanged"
          >
          <label for="partNo">Part No</label>
          <span
            v-if="!isValidPartNo"
            class="helper-text"
            data-error="Invalid part no"
          ></span>
        </div>
      </div>
      <file-input
        title="Trouble"
        :fileType="file.pdf"
        :fileName="trouble"
        @onFileSelected="onTroubleSelected"
        @onDeleted="onTrobleDeleted"
      />
      <file-input
        ref="appearance"
        title="Appearance"
        :fileType="file.pdf"
        :fileName="appearance"
        @onFileSelected="onAppearanceSelected"
        @onDeleted="onAppearanceDeleted"
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

import mixins from '~/mixins';
import modalMixins from '~/mixins/modal';

export default {
  name: 'FileStdModal',

  mixins: [mixins, modalMixins],

  computed: {
    ...mapGetters({
      searchItems: 'part/searchParts',
      parts: 'part/parts',
      fileStds: 'part/fileStds'
    }),
    trouble() {
      return this.item.trouble
        ? this.item.trouble.name || this.item.trouble
        : '';
    },
    appearance() {
      return this.item.appearance
        ? this.item.appearance.name || this.item.appearance
        : '';
    }
  },

  data() {
    return {
      autocomplete: null,
      isValidPartNo: true,
      item: {
        partNo: null,
        trouble: null,
        appearance: null
      }
    };
  },

  watch: {
    searchItems(value) {
      this.autocomplete.updateData(value);
    }
  },

  methods: {
    updateForm() {
      this.updateTextFields();
      this.modal.open();
    },

    showAdd() {
      this.isAdd = true;
      this.item = { partNo: null, trouble: null, appearance: null };
      this.isValidPartNo = true;
      this.$refs.appearance.isValid = true;
      this.$refs.autocomplete.value = '';
      this.updateForm();
    },

    showEdit(id) {
      this.isAdd = false;
      const { part, trouble, appearance } = _.find(
        this.fileStds,
        i => i.part.id === id
      );
      this.item = { partNo: part.id, trouble, appearance };
      this.isValidPartNo = true;
      this.$refs.appearance.isValid = true;
      this.$refs.autocomplete.value = part.id;
      this.updateForm();
    },

    onSearchCompleted(partNo) {
      this.item.partNo = partNo;
      this.isValidPartNo = true;
    },

    onPartNoChanged(e) {
      this.item.partNo = e.target.value;
      this.isValidPartNo = true;
    },

    onTroubleSelected(file) {
      this.item.trouble = file;
    },

    onTrobleDeleted() {
      this.item.trouble = null;
    },

    onAppearanceSelected(file) {
      this.item.appearance = file;
    },

    onAppearanceDeleted() {
      this.item.appearance = null;
    },

    validate() {
      if (this.isAdd && !_.some(this.parts, i => i.id === this.item.partNo)) {
        this.isValidPartNo = false;
      }
      const isValidAppearance = this.$refs.appearance.validateOnSave();
      return this.isValidPartNo && isValidAppearance;
    },

    async save() {
      if (!this.validate()) {
        return;
      }
      try {
        this.loading = true;
        if (this.isAdd) {
          await this.$store.dispatch('part/createFileStd', this.item);
        } else {
          await this.$store.dispatch('part/updateFileStd', this.item);
        }
        this.$emit('onSaveCompleted');
        this.modal.close();
        M.toast({ html: 'File Std has been successfully saved' });
      } catch (err) {
        this.showError(err);
      } finally {
        this.loading = false;
      }
    }
  },
  mounted() {
    if (process.client) {
      this.autocomplete = M.Autocomplete.init(this.$refs.autocomplete, {
        data: this.searchItems,
        limit: 10,
        onAutocomplete: this.onSearchCompleted
      });
    }
  },

  destroyed() {
    if (this.autocomplete) {
      this.autocomplete.destroy();
    }
  }
};
</script>

<style lang="scss" scoped>
.row:last-child {
  margin-bottom: 0;
}
</style>
