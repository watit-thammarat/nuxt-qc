<template>
  <div>
    <popup-qc ref="popupQc" />
    <qc-modal
      @onDataLoaded="onDataLoaded"
      ref="modal"
    />
    <search
      :searching="searching"
      @onSearch="onSearch"
    />
    <inquiry-table
      @inspect="inspect"
      @onPageChanged="onPageChanged"
      @onSort="onSort"
    />
  </div>
</template>

<script>
import mixins from '~/mixins';
import Search from '~/components/Inquiry/Search';
import InquiryTable from '~/components/Inquiry/Table';
import QcModal from '~/components/QC/Modal';
import PopupQc from '~/components/QC/Popup';

export default {
  async fetch({ store }) {
    await store.dispatch('inquiry/getVendorGroups');
    const payload = store.getters['inquiry/defaultValues'];
    await store.dispatch('inquiry/search', payload);
    store.dispatch('setTitle', 'QC LIST');
  },

  mixins: [mixins],

  components: {
    Search,
    InquiryTable,
    QcModal,
    PopupQc
  },

  data() {
    const {
      vendorGroups,
      partTypes,
      factories,
      pageNumber,
      pageSize,
      sortColumn,
      sortDirection,
      partNo,
      date
    } = this.$store.getters['inquiry/defaultValues'];
    return {
      payload: {
        vendorGroups,
        partTypes,
        factories,
        pageNumber,
        pageSize,
        sortColumn,
        sortDirection,
        partNo,
        date
      },
      searching: false
    };
  },

  methods: {
    inspect(data) {
      this.$refs.modal.open(data);
    },

    onDataLoaded() {
      this.$refs.popupQc.open();
    },

    async onPageChanged(pageNumber) {
      this.payload.pageNumber = pageNumber;
      await this.search();
    },

    async onSearch({ vendorGroups, partTypes, factories, partNo, date }) {
      this.searching = true;
      this.payload.vendorGroups = vendorGroups;
      this.payload.partTypes = partTypes;
      this.payload.factories = factories;
      this.payload.pageNumber = 1;
      this.payload.partNo = partNo;
      this.payload.date = date;
      await this.search();
      this.searching = false;
    },

    async onSort({ sortColumn, sortDirection }) {
      this.payload.sortColumn = sortColumn;
      this.payload.sortDirection = sortDirection;
      this.pageNumber = 1;
      await this.search();
    },

    async search() {
      try {
        await this.$store.dispatch('inquiry/search', this.payload);
      } catch (err) {
        this.showError(err);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
