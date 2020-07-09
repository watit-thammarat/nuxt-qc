<template>
  <div class="card">
    <div class="card-content center-align">
      <table v-if="haveItems">
        <thead>
          <tr class="grey white-text">
            <th class="title-image">Image</th>
            <th>Appearance Details</th>
            <th class="title-check">Check</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="i in items"
            :key="i.itemNo"
          >
            <td>
              <preloader
                v-if="loadingPopupImage && popupImage.name === i.picture"
                size="tiny"
              />
              <a
                v-else
                href="#!"
                @click.prevent="showImage(i.picture, $event)"
              >
                <i class="material-icons small">image</i>
              </a>
            </td>
            <td>{{ i.detail }}</td>
            <td>
              <label>
                <input
                  @change="checkChanged"
                  :name="i.itemNo"
                  type="checkbox"
                />
                <span></span>
              </label>
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
  name: 'QcAppearanceInput',

  mixins: [mixins],

  computed: {
    ...mapGetters({
      data: 'qc/data',
      popupImage: 'ui/popupImage',
      loadingPopupImage: 'ui/loadingPopupImage'
    }),

    haveItems() {
      return !_.chain(this.data)
        .get(this.data, 'standard.appearance.items', null)
        .isEmpty()
        .value();
    },

    items() {
      return this.haveItems ? this.data.standard.appearance.items : null;
    }
  },

  methods: {
    checkChanged(e) {
      const { name, checked } = e.target;
      this.$emit('onCheckChanged', { itemNo: +name, checked });
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

    [type='checkbox'] + span {
      padding-left: 18px;
      top: 3px;
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
            &-check {
              width: 72px;
              max-width: 72px;
            }

            &-image {
              width: 72px;
              max-width: 72px;
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
