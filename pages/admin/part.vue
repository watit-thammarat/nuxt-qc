<template>
  <div class="admin__container">
    <apprn-std-modal ref="apprnStdModal" />
    <save-modal
      ref="saveModal"
      @onSaveCompleted="onSaveCompleted"
    />
    <search
      @onSearch="onSearch"
      :searching="searching"
      placeholder="Search (by Part No, Part Name)"
    />

    <button
      :disabled="!haveParts()"
      class="waves-effect waves-light btn light-blue darken-1"
      @click="showAddModal"
    >
      <i class="material-icons left">add</i>
      Add
    </button>

    <file-std-table
      @onSort="onSort"
      @onApprnStdModalOpened="onApprnStdModalOpened"
      @onEdit="showEditModal"
      @onDelete="destroy"
      @onPageChanged="onPageChanged"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import _ from 'lodash';

import mixins from '~/mixins';
import adminMixins from '~/mixins/admin';
import FileStdTable from '~/components/FileStd/Table';
import SaveModal from '~/components/FileStd/Modal';
import ApprnStdModal from '~/components/ApprnStd/Modal';

export default {
  name: 'FileStdPage',

  middleware: ['isAdmin'],

  mixins: [mixins, adminMixins],

  async fetch({ store }) {
    const promise = Promise.all([
      await store.dispatch('part/getParts'),
      await store.dispatch('part/getFileStds')
    ]);
    await promise;
    store.dispatch('setTitle', 'QC PART');
  },

  components: {
    FileStdTable,
    SaveModal,
    ApprnStdModal
  },

  computed: {
    ...mapGetters({ parts: 'part/parts' })
  },

  data() {
    const {
      keyword,
      pageNumber,
      pageSize,
      sortColumn,
      sortDirection
    } = this.$store.getters['part/defaultValues'];
    return {
      payload: {
        keyword,
        pageNumber,
        pageSize,
        sortColumn,
        sortDirection
      }
    };
  },

  methods: {
    onApprnStdModalOpened(id) {
      this.$refs.apprnStdModal.open(id);
    },

    showAddModal() {
      this.$refs.saveModal.showAdd();
    },

    showEditModal(id) {
      this.$refs.saveModal.showEdit(id);
    },

    haveParts() {
      return !_.isEmpty(this.parts);
    },

    async search() {
      try {
        await this.$store.dispatch('part/getFileStds', this.payload);
      } catch (err) {
        this.showError(err);
      }
    },

    async destroy(partNo) {
      if (confirm('Are you sure you want to delete this item?')) {
        try {
          await this.$store.dispatch('part/deleteFileStd', { partNo });
          await this.search();
          M.toast({ html: 'File Std has been successfully deleted' });
        } catch (err) {
          this.showError(err);
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
