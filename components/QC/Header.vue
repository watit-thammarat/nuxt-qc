<template>
  <div class="card">
    <div class="card-content">
      <div class="row">
        <div class="col m3 l4">PART NO:</div>
        <div class="col m9 l8 title">{{ partNo }}</div>
      </div>
      <div class="row">
        <div class="col m3 l4">PART NAME:</div>
        <div class="col m9 l8 title">{{ partName }}</div>
      </div>
      <div class="row">
        <div class="col m3 l4">VENDOR:</div>
        <div class="col m9 l8 title">{{ vendor }}</div>
      </div>
      <div class="row">
        <div class="col m3 l4">INVOICE NO:</div>
        <div class="col m9 l8 title">{{ invoice }}</div>
      </div>
      <div class="row">
        <div class="col m3 l4">RECEIVE DATE:</div>
        <div class="col m9 l8 title">{{ receivedAt | date }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

import mixins from '~/mixins';

export default {
  name: 'QcHeader',

  mixins: [mixins],

  computed: {
    ...mapGetters({ data: 'qc/data' }),

    partNo() {
      return this.data && this.data.part ? this.data.part.id : this.empty;
    },

    partName() {
      return this.data && this.data.part ? this.data.part.name : this.empty;
    },

    invoice() {
      return this.data && this.data ? this.data.invoice : this.empty;
    },

    receivedAt() {
      return this.data && this.data.receivedAt
        ? this.data.receivedAt
        : this.empty;
    },

    vendor() {
      return this.data && this.data.vendor ? this.data.vendor.name : this.empty;
    }
  }
};
</script>

<style lang="scss" scoped>
.card {
  .card-content {
    padding: 16px;

    .title {
      font-weight: 500;
    }

    .row:last-child {
      margin-bottom: 0;
    }
  }
}
</style>
