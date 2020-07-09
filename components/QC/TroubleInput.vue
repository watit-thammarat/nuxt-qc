<template>
  <div class="card">
    <div class="card-content center-align">
      <table v-if="haveItems">
        <thead>
          <tr class="grey white-text">
            <th>Type</th>
            <th>Details</th>
            <th class="title-pass">PASS</th>
            <th class="title-reject">REJECT</th>
            <th
              v-if="showCloseColumn()"
              class="title-close"
            >CLOSE</th>
            <th class="title-ipp">IPP</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(i, k) in items"
            :key="k"
          >
            <td>{{ i.partType.name }}</td>
            <td>{{ i.detailFollow }}</td>
            <td>
              <label>
                <input
                  @change="statusPartChanged"
                  value="FOLLOWING"
                  :name="`partStatusType_${i.detailFollow}`"
                  type="radio"
                />
                <span></span>
              </label>
            </td>
            <td>
              <label>
                <input
                  @change="statusPartChanged"
                  value="REJECT"
                  :name="`partStatusType_${i.detailFollow}`"
                  type="radio"
                  checked
                />
                <span></span>
              </label>
            </td>
            <td v-if="showCloseColumn()">
              <label v-if="i.partType.id !== PRR.id">
                <input
                  @change="statusPartChanged"
                  value="CLOSE"
                  :name="`partStatusType_${i.detailFollow}`"
                  type="radio"
                />
                <span></span>
              </label>
            </td>
            <td>
              <input
                @input="ippChanged"
                class="browser-default"
                placeholder="IPP"
                :name="`ipp_${i.detailFollow}`"
                type="text"
              >
            </td>
          </tr>
        </tbody>
      </table>
      <h6 v-else>NO DATA</h6>
    </div>
  </div>
</template>

<script>
import _ from 'lodash';
import { mapGetters } from 'vuex';

import mixins from '~/mixins';

export default {
  name: 'QCTroubleInput',

  mixins: [mixins],

  computed: {
    ...mapGetters({ data: 'qc/data', PRR: 'qc/PRR' }),

    haveItems() {
      return !_.chain(this.data)
        .get(this.data, 'standard.trouble.items', null)
        .isEmpty()
        .value();
    },

    items() {
      return this.haveItems ? this.data.standard.trouble.items : null;
    }
  },

  methods: {
    showCloseColumn() {
      return _.some(this.items, i => i.partType.id !== this.PRR.id);
    },

    statusPartChanged(e) {
      const { name, value, checked } = e.target;
      if (checked) {
        const [_, detailFollow] = name.split('_');
        this.$emit('onPartStatusChanged', { detailFollow, statusPart: value });
      }
    },

    ippChanged(e) {
      const { name, value } = e.target;
      const [_, detailFollow] = name.split('_');
      this.$emit('onIppChanged', { detailFollow, ipp: value });
    }
  }
};
</script>

<style lang="scss" scoped>
$border-color: #000;
$border-opacity: 0.12;

.card {
  margin: 0;

  .card-content {
    padding: 0;
    overflow: auto;

    [type='radio'] + span {
      padding-left: 25px;
      top: 5px;
    }

    [type='text'] {
      width: 100%;
      padding: 4px;
      border: 1px solid rgba($border-color, $border-opacity);

      &:focus,
      &:active {
        outline: none;
      }
    }

    table {
      border-collapse: separate;

      tr {
        td,
        th {
          font-weight: 500;
          text-align: center;
          border-right: solid 1px rgba($border-color, $border-opacity);
          border-bottom: solid 1px rgba($border-color, $border-opacity);
          border-radius: 0;

          &.title {
            &-pass {
              width: 50px;
              max-width: 50px;
            }

            &-reject {
              width: 66px;
              max-width: 66px;
            }

            &-close {
              width: 60px;
              max-width: 60px;
            }

            &-ipp {
              min-width: 75px;
            }
          }

          &:last-child {
            border-right: none;
          }
        }
      }
    }
  }
}
</style>
