<template>
  <div class="table__container row">
    <div
      v-if="haveItems"
      class="card col s12"
    >
      <div class="card-content">
        <table class="responsive-table striped">
          <thead>
            <tr>
              <th
                :class="{'sortable': isMediumAndDown}"
                v-for="c in columns"
                :key="c.id"
              >
                <a
                  @click.prevent="handleSort(c.id)"
                  href="#!"
                  class="btn-flat waves-effect waves-light"
                >
                  {{ c.value }}
                  <i
                    v-if="sortColumn === c.id"
                    class="material-icons right"
                  >
                    {{ getSortDirectionIcon() }}
                  </i>
                </a>
              </th>
              <th
                class="actions"
                v-if="isAuthenticated"
              ></th>
            </tr>
          </thead>
          <tbody>
            <template>
              <tr
                v-for="i in items"
                :key="i.id"
              >
                <td>{{ i.vendor.name }}</td>
                <td>{{ i.part.id }}</td>
                <td>{{ i.part.name }}</td>
                <td>{{ i.invoice }}</td>
                <td>{{ i.model }}</td>
                <td>{{ i.qty | number }}</td>
                <td>{{ i.detailFollow }}</td>
                <!-- <td>{{ i.statusPart }}</td> -->
                <td>{{ i.date | date }}</td>
                <td>{{ i.location }}</td>
                <td v-if="isAuthenticated">
                  <button
                    v-if="i.invoice"
                    @click="showQRCode(i)"
                    class=" btn-floating waves-effect waves-light light-blue darken-1"
                  >
                    <i class="material-icons">center_focus_strong</i>
                  </button>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
      <pagination
        class="right-align"
        @onPageChanged="onPageChanged"
        :pageNumber="pageNumber"
        :itemCount="itemCount"
      />
    </div>
    <div
      v-else
      class="card col s12"
    >
      <div class="card-content">
        <h5 class="center-align">NOT FOUND</h5>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

import mixins from '~/mixins';
import tableMixins from '~/mixins/table';
import { eventBus } from '~/plugins/eventBus';
import { SHOW_QC_CODE, GET_QC_CODE_VALUE } from '~/constants/eventBus';

export default {
  name: 'InquiryTable',

  mixins: [mixins, tableMixins],

  computed: {
    ...mapGetters({ items: 'inquiry/items', itemCount: 'inquiry/itemCount' })
  },

  data() {
    const { pageNumber, sortColumn, sortDirection } = this.$store.getters[
      'inquiry/defaultValues'
    ];
    return {
      pageNumber,
      sortColumn,
      sortDirection,
      item: null,
      columns: [
        { id: 'vdnam', value: 'Vendor' },
        { id: 'partno', value: 'Part No' },
        { id: 'partnam', value: 'Part Name' },
        { id: 'invoice_no', value: 'Invoice' },
        { id: 'model', value: 'Model' },
        { id: 'qty', value: 'qty' },
        { id: 'detail_follow', value: 'Detail Follow' },
        // { id: 'status_part', value: 'Status Part' },
        { id: 'date', value: 'Date' },
        { id: 'location', value: 'Location' }
      ]
    };
  },

  methods: {
    // inspect() {
    //   const part = '0514072159R00CT';
    //   const serial = '188003524';
    //   const invoice = '12-KT08046';
    //   const vendor = '1218K';
    //   this.$emit('inspect', { part, serial, invoice, vendor });
    // },

    showQRCode(item) {
      this.item = item;
      eventBus.$emit(SHOW_QC_CODE);
    },

    tryGetPart(value) {
      try {
        return value.substr(16, 23).trim();
      } catch (err) {
        throw new Error('Cannot get part');
      }
    },

    tryGetVendor(value) {
      try {
        return value.substr(3, 5).trim();
      } catch (err) {
        throw new Error('Cannot get vendor');
      }
    },

    tryGetSerial(value) {
      try {
        return value.substr(64, 9).trim();
      } catch (err) {
        throw new Error('Cannot get serial');
      }
    },

    validatePart(part) {
      if (this.item.part.id !== part) {
        throw new Error('Invalid Part');
      }
    },

    validateVendor(vendor) {
      if (this.item.vendor.id !== vendor) {
        throw new Error('Invalid Vendor');
      }
    },

    getQcCodeValue(value) {
      try {
        const part = this.tryGetPart(value);
        const vendor = this.tryGetVendor(value);
        const serial = this.tryGetSerial(value);
        this.validatePart(part);
        this.validateVendor(vendor);
        this.$emit('inspect', {
          part,
          serial,
          invoice: this.item.invoice,
          vendor
        });
      } catch (err) {
        this.showError(err);
      }
    }
  },

  created() {
    eventBus.$on(GET_QC_CODE_VALUE, this.getQcCodeValue);
  },

  mounted() {
    this.$nextTick(() => {
      this.$forceUpdate();
    });
  },

  destroyed() {
    eventBus.$off(GET_QC_CODE_VALUE, this.getQcCodeValue);
  }
};
</script>

<style lang="scss" scoped>
.table__container {
  margin-top: 0;
  margin-bottom: 0;

  .card {
    margin: 0;
  }

  th.actions {
    min-width: 50px;
    width: 50px;
  }
}
</style>
