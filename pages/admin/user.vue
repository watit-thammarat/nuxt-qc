<template>
  <div class="admin__container">
    <save-modal
      ref="saveModal"
      @onSaveCompleted="onSaveCompleted"
    />
    <search
      @onSearch="onSearch"
      :searching="searching"
      placeholder="Search (by First Name, Last Name)"
    />
    <button
      :disabled="!haveTnsUsers()"
      class="waves-effect waves-light btn light-blue darken-1"
      @click="showAddModal"
    >
      <i class="material-icons left">add</i>
      Add
    </button>
    <user-table
      @onSort="onSort"
      @onEdit="showEditModal"
      @onDelete="destroy"
      @onPageChanged="onPageChanged"
    />
  </div>
</template>

<script>
import _ from 'lodash';
import { mapGetters } from 'vuex';

import mixins from '~/mixins';
import adminMixins from '~/mixins/admin';
import SaveModal from '~/components/User/Modal';
import UserTable from '~/components/User/Table';

export default {
  name: 'UserPage',

  middleware: ['isAdmin'],

  mixins: [mixins, adminMixins],

  async fetch({ store }) {
    const promises = Promise.all([
      store.dispatch('user/getUsers'),
      store.dispatch('user/getTnsUsers'),
      store.dispatch('user/getVendorGroups'),
      store.dispatch('user/getRoles')
    ]);
    await promises;
    store.dispatch('setTitle', 'QC USER');
  },

  components: {
    SaveModal,
    UserTable
  },

  computed: {
    ...mapGetters({ tnsUsers: 'user/tnsUsers' })
  },

  data() {
    const {
      keyword,
      pageNumber,
      pageSize,
      sortColumn,
      sortDirection
    } = this.$store.getters['user/defaultValues'];
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
    haveTnsUsers() {
      return !_.isEmpty('tnsUsers');
    },

    showAddModal() {
      this.$refs.saveModal.showAdd();
    },

    showEditModal(id) {
      this.$refs.saveModal.showEdit(id);
    },

    async search() {
      try {
        await this.$store.dispatch('user/getUsers', this.payload);
      } catch (err) {
        this.showError(err);
      }
    },

    async destroy(id) {
      if (confirm('Are you sure you want to delete this item?')) {
        try {
          await this.$store.dispatch('user/deleteUser', { id });
          await this.search();
          M.toast({ html: 'User has been successfully deleted' });
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
