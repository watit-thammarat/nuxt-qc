<template>
  <div class="card light-blue lighten-5">
    <div class="card-content">
      <table>
        <tbody>
          <tr>
            <td>LOT SIZE</td>
            <td colspan="2">{{ lotSize | number }}</td>
            <td class="last-col">pcs.</td>
          </tr>
          <tr>
            <td rowspan="2">SAMPLING SIZE</td>
            <td>สุ่มแบบปกติ</td>
            <td>สุ่มแบบเข้มงวด</td>
            <td
              class="last-col"
              rowspan="2"
            >pcs.</td>
          </tr>
          <tr>
            <td class="green-text">{{ typeOne | number }}</td>
            <td class="red-text">{{ typeTwo | number }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

import mixins from '~/mixins';

export default {
  name: 'QcSampling',

  mixins: [mixins],

  computed: {
    ...mapGetters({ data: 'qc/data' }),

    lotSize() {
      return this.data && this.data.sampling
        ? this.data.sampling.lotSize
        : this.empty;
    },

    typeOne() {
      return this.data && this.data.sampling
        ? this.data.sampling.typeOne
        : this.empty;
    },

    typeTwo() {
      return this.data && this.data.sampling
        ? this.data.sampling.typeTwo
        : this.empty;
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

    table {
      border-collapse: separate;

      tr {
        td {
          font-weight: 500;
          text-align: center;
          border-right: solid 1px rgba($border-color, $border-opacity);
          border-bottom: solid 1px rgba($border-color, $border-opacity);
          border-radius: 0;

          &.last-col {
            border-right: none;
          }

          &:first-child {
            border-left: solid 1px rgba($border-color, $border-opacity);
          }
        }

        &:nth-of-type(3) {
          td:first-child {
            border-left: none;
          }
        }
      }
    }
  }
}
</style>
