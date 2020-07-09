<template>
  <div class="admin__container">
    <save-modal
      ref="saveModal"
      @onSaveCompleted="onSaveCompleted"
    />
    <search
      @onSearch="onSearch"
      :searching="searching"
      placeholder="Search (by Type, Level)"
    />
    <button
      class="waves-effect waves-light btn light-blue darken-1"
      @click="showAddModal"
    >
      <i class="material-icons left">add</i>
      Add
    </button>
    <sampling-table
      @onSort="onSort"
      @onEdit="showEditModal"
      @onDelete="destroy"
      @onPageChanged="onPageChanged"
    />
  </div>
</template>

<script>
import mixins from '~/mixins';
import adminMixins from '~/mixins/admin';
import SamplingTable from '~/components/Sampling/Table';
import SaveModal from '~/components/Sampling/Modal';

export default {
  name: 'SamplingPage',

  middleware: ['isAdmin'],

  mixins: [mixins, adminMixins],

  components: {
    SamplingTable,
    SaveModal
  },

  async fetch({ store }) {
    await store.dispatch('sampling/getItems');
    store.dispatch('setTitle', 'QC SAMPLING');
  },

  data() {
    const {
      keyword,
      pageNumber,
      pageSize,
      sortColumn,
      sortDirection
    } = this.$store.getters['sampling/defaultValues'];
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
    showAddModal() {
      this.$refs.saveModal.showAdd();
    },

    showEditModal(id) {
      this.$refs.saveModal.showEdit(this.getTypeAndLevel(id));
    },

    getTypeAndLevel(id) {
      const [type, level] = id.split('_');
      return { type, level };
    },

    async search() {
      try {
        await this.$store.dispatch('sampling/getItems', this.payload);
      } catch (err) {
        this.showError(err);
      }
    },

    async destroy(id) {
      if (confirm('Are you sure you want to delete this item?')) {
        try {
          await this.$store.dispatch(
            'sampling/deleteItem',
            this.getTypeAndLevel(id)
          );
          await this.search();
          M.toast({ html: 'Sampling data has been successfully deleted' });
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
