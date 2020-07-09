<template>
  <div
    class="slide-popup__container"
    :class="containerClass"
  >
    <nav>
      <div class="nav-wrapper">
        <span class="brand-logo">QC INSPECTION</span>
        <a
          @click.prevent="close()"
          href="#!"
        ><i class="material-icons small">close</i></a>
      </div>
    </nav>
    <main
      v-if="hasData"
      class="qc__container"
    >
      <div class="row ">
        <div class="col s12 l6">
          <qc-header />
        </div>
        <div
          class="col s12 l6"
          :class="{ 'sampling-sm': isMediumAndDown, 'sampling-lg': isLargeAndUp }"
        >
          <sampling />
        </div>
      </div>
      <div class="row card tabs__container">
        <div class="col s12 card-content">
          <div class="row">
            <div class="col s12">
              <ul
                ref="tabs"
                class="tabs"
              >
                <li
                  v-if="hasTrouble"
                  class="tab col s3"
                ><a
                    class="active"
                    href="#trouble-std"
                  >TROUBLE STD</a></li>
                <li class="tab col s3"><a
                    :class="{ active: !hasTrouble }"
                    href="#apprn-std"
                  >APPEARANCE STD</a></li>
              </ul>
              <hr>
            </div>
            <div
              v-if="hasTrouble"
              id="trouble-std"
              class="col s12"
            >
              <div class="row ">
                <div class="col s12 l6 pdf__container grey lighten-2">
                  <pdf
                    v-if="troublePdf"
                    :pdf="troublePdf"
                  />
                  <h1
                    v-else
                    class="center-align"
                  >NO PDF</h1>
                </div>
                <div
                  class="col s12 l6"
                  :class="{ 'sampling-sm': isMediumAndDown, 'sampling-lg': isLargeAndUp }"
                >
                  <div class="input_container">
                    <trouble-input
                      @onPartStatusChanged="onPartStatusChanged"
                      @onIppChanged="onIppChanged"
                    />
                    <div class="button_container">
                      <button
                        @click="goToApprnStdTab"
                        class="btn waves-effect waves-light green"
                      >
                        Next
                        <i class="material-icons right">arrow_forward</i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              id="apprn-std"
              class="col s12"
            >
              <div class="row ">
                <div class="col s12 l6 pdf__container grey lighten-2">
                  <pdf :pdf="appearancePdf" />
                </div>
                <div
                  class="col s12 l6"
                  :class="{ 'sampling-sm': isMediumAndDown, 'sampling-lg': isLargeAndUp }"
                >
                  <div class="input_container">
                    <appearance-input @onCheckChanged="onCheckChanged" />
                    <div class="pass_container">
                      <span>
                        <label>
                          <input
                            name="pass"
                            type="radio"
                            v-model="payload.pass"
                            value="Y"
                          />
                          <span class="pass green-text">Pass</span>
                        </label>
                      </span>
                      <span>
                        <label>
                          <input
                            name="pass"
                            type="radio"
                            v-model="payload.pass"
                            value="N"
                          />
                          <span class="reject red-text">Reject</span>
                        </label>
                      </span>
                    </div>
                    <div class="button_container">
                      <button
                        :disabled="loading"
                        @click="cancel"
                        class="btn waves-effect waves-light red"
                      >
                        <i class="material-icons left">cancel</i>
                        Cancel
                      </button>
                      <button
                        :disabled="loading"
                        @click="save"
                        class="btn waves-effect waves-light light-blue darken-1"
                      >
                        <i class="material-icons left">save</i>
                        {{ loading ? 'Saving...' : 'Save' }}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import _ from 'lodash';
import { mapGetters } from 'vuex';

import mixins from '~/mixins';
import Sampling from '~/components/QC/Sampling';
import QcHeader from '~/components/QC/Header';
import TroubleInput from '~/components/QC/TroubleInput';
import AppearanceInput from '~/components/QC/AppearanceInput';
import { eventBus } from '~/plugins/eventBus';
import { CLOSE_QC_POPUP } from '~/constants/eventBus';

export default {
  name: 'PopupQC',

  mixins: [mixins],

  components: {
    QcHeader,
    Sampling,
    TroubleInput,
    AppearanceInput
  },

  computed: {
    ...mapGetters({ data: 'qc/data' }),

    hasData() {
      return !_.isNil(this.data);
    },

    hasTrouble() {
      return !_.chain(this.data)
        .get('standard.trouble.items', null)
        .isEmpty()
        .value();
    },

    troublePdf() {
      return this.data.standard.trouble.pdf;
    },

    appearancePdf() {
      return this.data.standard.appearance.pdf;
    }
  },

  data() {
    return {
      containerClass: '',
      tabs: null,
      payload: { pass: 'N' },
      loading: false
    };
  },

  methods: {
    initPayload() {
      const {
        part,
        vendor,
        invoice,
        standard: { trouble, appearance }
      } = this.data;
      this.payload = {
        ...this.payload,
        part: part.id,
        vendor: vendor.id,
        invoice,
        standard: {
          troubles: _.isNil(trouble)
            ? null
            : _.map(trouble.items, i => ({
                detailFollow: i.detailFollow,
                statusPart: 'REJECT',
                ipp: ''
              })),
          appearances: _.map(appearance.items, i => ({
            itemNo: i.itemNo,
            checked: 'N'
          }))
        }
      };
    },

    open() {
      this.destroyTabs();
      this.tabs = M.Tabs.init(this.$refs.tabs);
      this.hideScrollbar();
      this.initPayload();
      this.containerClass = 'up';
    },

    close() {
      this.showScrollbar();
      this.containerClass = 'down';
      this.destroyTabs();
      this.$store.dispatch('qc/clearData');
    },

    getTroubleItem(detailFollow) {
      return _.find(
        this.payload.standard.troubles,
        t => t.detailFollow === detailFollow
      );
    },

    onPartStatusChanged({ detailFollow, statusPart }) {
      const item = this.getTroubleItem(detailFollow);
      item.statusPart = statusPart;
    },

    onIppChanged({ detailFollow, ipp }) {
      const item = this.getTroubleItem(detailFollow);
      item.ipp = ipp;
    },

    onCheckChanged({ itemNo, checked }) {
      const item = _.find(
        this.payload.standard.appearances,
        a => a.itemNo === itemNo
      );
      item.checked = checked ? 'Y' : 'N';
    },

    goToApprnStdTab() {
      const instance = M.Tabs.getInstance(this.$refs.tabs);
      instance.select('apprn-std');
    },

    cancel() {
      if (confirm('Are you sure you want to cancel this item ?')) {
        this.close();
      }
    },

    async save() {
      try {
        this.loading = true;
        await this.$store.dispatch('qc/saveQC', this.payload);
        eventBus.$emit(CLOSE_QC_POPUP);
        this.close();
        M.toast({ html: 'QC inspection have been successfully saved' });
      } catch (err) {
        this.showError(err);
      } finally {
        this.loading = false;
      }
    },

    destroyTabs() {
      if (this.tabs) {
        this.tabs.destroy();
        this.tabs = null;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.qc__container {
  margin: 16px;

  .row {
    margin-top: 0;
    margin-bottom: 0;

    .col {
      padding: 0;

      &.sampling {
        &-sm {
          margin-top: 16px;
        }

        &-lg {
          padding-left: 0.75rem;
        }
      }
    }
  }
}

.tabs__container {
  .col .row {
    margin-left: 0;
    margin-right: 0;
  }

  hr {
    margin-top: -1px;
  }

  &.card {
    margin-top: 16px;
  }
}

.pdf__container {
  width: 100%;
  height: calc(100vh - 48px);
}

.input_container {
  display: flex;
  flex-direction: column;

  .pass_container {
    margin: 24px 16px 8px 16px;
    align-self: flex-end;

    .pass,
    .reject {
      font-size: 18px;
      font-weight: bold;
    }

    .pass {
      margin-right: 24px;
    }
  }

  .button_container {
    margin: 16px;
    align-self: flex-end;

    button + button {
      margin-left: 8px;
    }
  }
}

.card {
  margin: 0;
}
</style>
