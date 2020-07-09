<template>
  <div class="search__container row">
    <div class="card col s12 l10 offset-l1 xl8 offset-xl2 ">
      <div class="card-content">
        <div class="row">
          <div class="input-field col s12">
            <select
              ref="vendorGroups"
              v-model="vendorGroups"
            >
              <option
                v-for="v in allVendorGroups"
                :key="v.id"
                :value="v.id"
                :selected="v.id === vendorGroups"
              >{{ v.name }}</option>
            </select>
            <label>Vendor Group Name</label>
          </div>
        </div>
        <div class="row">
          <div class="input-field col s12">
            <input
              id="partNo"
              type="text"
              v-model="partNo"
            >
            <label for="partNo">PART NO</label>
          </div>
        </div>
        <div class="row">
          <div class="input-field col s12">
            <input
              id="datePicker"
              ref="datePicker"
              type="text"
              class="datepicker"
            >
            <label for="datePicker">DATE</label>
          </div>
        </div>
        <div class="row">
          <div class="col s12">
            <h6>View Status</h6>
            <span
              class="checkbox__container"
              :class="{sm: isSmall, md: isMedium}"
              v-for="p in allPartTypes"
              :key="p.id"
            >
              <label>
                <input
                  v-model="partTypes"
                  :value="p.id"
                  type="checkbox"
                  @change="onPartTypeChanged"
                />
                <span>{{ p.name }}</span>
              </label>
            </span>
          </div>
        </div>
        <div class="row">
          <div class="col s12">
            <h6>Factory</h6>
            <span
              class="checkbox__container"
              :class="{ md: isMedium}"
              v-for="f in allFactories"
              :key="f.id"
            >
              <label>
                <input
                  v-model="factories"
                  :value="f.id"
                  type="checkbox"
                  @change="onFactoryChanged"
                />
                <span>{{ f.name }}</span>
              </label>
            </span>
          </div>
        </div>
        <div class="row">
          <div class="col s12">
            <preloader
              v-if="searching"
              size="small"
            />
            <button
              v-else
              :disabled="!isValid()"
              @click="search"
              class="waves-effect waves-light btn light-blue darken-1"
            >
              <i class="material-icons left">search</i>
              Search
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash';
import moment from 'moment';
import { mapGetters } from 'vuex';

import mixins from '~/mixins';
import { eventBus } from '~/plugins/eventBus';
import { CLOSE_QC_POPUP } from '~/constants/eventBus';

const PICKER_DATE_FORMAT = 'dd mmm yyyy';
const MOMENT_DATE_FORMAT = 'DD MMM YYYY';
const DB_DATE_FORMAT = 'YYYYMMDD';

export default {
  name: 'InquirySearch',

  mixins: [mixins],

  props: {
    searching: {
      type: Boolean,
      required: true
    }
  },

  computed: {
    allVendorGroups() {
      const vendorGroups = this.$store.getters['inquiry/vendorGroups'];
      return vendorGroups
        ? [{ id: 'all', name: 'ALL' }, ...vendorGroups]
        : null;
    },

    allFactories() {
      const factories = this.$store.getters['inquiry/factories'];
      return factories ? [{ id: 'all', name: 'ALL' }, ...factories] : null;
    },

    allPartTypes() {
      const partTypes = this.$store.getters['inquiry/partTypes'];
      return partTypes ? [{ id: 'all', name: 'ALL' }, ...partTypes] : null;
    }
  },

  watch: {
    partTypes(value) {
      if (value.length === this.allPartTypes.length - 1) {
        if (value.some(v => v === 'all')) {
          this.partTypes = this.partTypes.filter(p => p !== 'all');
        } else {
          this.partTypes = ['all', ...this.partTypes];
        }
      }
    },

    factories(value) {
      if (value.length === this.allFactories.length - 1) {
        if (value.some(v => v === 'all')) {
          this.factories = this.factories.filter(p => p !== 'all');
        } else {
          this.factories = ['all', ...this.factories];
        }
      }
    }
  },

  data() {
    let { vendorGroups, partTypes, factories, partNo } = this.$store.getters[
      'inquiry/defaultValues'
    ];
    vendorGroups = vendorGroups ? 'all' : null;
    partTypes = ['all', ...partTypes];
    factories = ['all', ...factories];
    return {
      vendorGroups,
      partTypes,
      factories,
      partNo,
      vendorGroupsRef: null,
      datePickerRef: null
    };
  },

  methods: {
    getVendorGroups() {
      if (_.isEmpty(this.vendorGroups)) {
        return null;
      }
      return this.vendorGroups === 'all'
        ? this.$store.getters['inquiry/vendorGroups'].map(v => v.id)
        : [this.vendorGroups];
    },

    getDate() {
      const date = this.$refs.datePicker.value;
      return _.isEmpty(date)
        ? ''
        : moment(date, MOMENT_DATE_FORMAT).format(DB_DATE_FORMAT);
    },

    search() {
      const vendorGroups = this.getVendorGroups();
      const partTypes = this.partTypes.filter(p => p !== 'all');
      const factories = this.factories.filter(f => f !== 'all');
      const payload = {
        vendorGroups,
        partTypes,
        factories,
        partNo: this.partNo,
        date: this.getDate()
      };
      this.$emit('onSearch', payload);
    },

    onPartTypeChanged(e) {
      const { value, checked } = e.target;
      if (value === 'all') {
        if (checked) {
          this.partTypes = [...this.allPartTypes.map(p => p.id)];
        } else {
          this.partTypes = [];
        }
      }
    },

    onFactoryChanged(e) {
      const { value, checked } = e.target;
      if (value === 'all') {
        if (checked) {
          this.factories = [...this.allFactories.map(f => f.id)];
        } else {
          this.factories = [];
        }
      }
    },

    onDatePickerClosed() {
      this.updateTextFields();
    },

    isValid() {
      return (
        !_.isEmpty(this.vendorGroups) &&
        !_.isEmpty(this.factories) &&
        !_.isEmpty(this.partTypes)
      );
    }
  },

  mounted() {
    if (process.client) {
      this.vendorGroupsRef = M.FormSelect.init(this.$refs.vendorGroups);
      this.datePickerRef = M.Datepicker.init(this.$refs.datePicker, {
        format: PICKER_DATE_FORMAT,
        showClearBtn: true,
        onClose: this.onDatePickerClosed
      });
    }
    this.$nextTick(() => {
      this.$forceUpdate();
    });
  },

  created() {
    eventBus.$on(CLOSE_QC_POPUP, this.search);
  },

  destroyed() {
    if (this.vendorGroupsRef) {
      this.vendorGroupsRef.destroy();
    }
    if (this.datePickerRef) {
      this.datePickerRef.destroy();
    }
    eventBus.$off(CLOSE_QC_POPUP, this.search);
  }
};
</script>

<style lang="scss" scoped>
.search__container {
  margin-top: 0;
  margin-bottom: 16px;

  .row:nth-child(1),
  .row:nth-child(2),
  .row:nth-child(3) {
    margin-bottom: 0;
  }

  .checkbox__container:not(:last-child) {
    margin-right: 36px;

    &.md {
      margin-right: 24px;
    }

    &.sm {
      display: block;
      margin-block-start: 1em;
      margin-block-end: 1em;
      margin-inline-start: 0px;
      margin-inline-end: 0px;
    }
  }

  .card {
    margin-top: 0;
    margin-bottom: 0;

    .row:last-child {
      margin-top: 36px;
      margin-bottom: 0;
    }
  }

  h6 {
    margin-bottom: 16px;
  }
}
</style>
