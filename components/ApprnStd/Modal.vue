<template>
  <div
    class="slide-popup__container"
    :class="containerClass"
  >
    <apprn-std-save-modal ref="apprnStdSaveModal" />
    <nav>
      <div class="nav-wrapper">
        <span class="brand-logo">QC APPRN STD</span>
        <a
          @click.prevent="close()"
          href="#!"
        ><i class="material-icons small">close</i></a>
      </div>
    </nav>
    <main class="app-container">
      <button
        class="waves-effect waves-light btn light-blue darken-1"
        @click="showAddModal()"
      >
        <i class="material-icons left">add</i>
        Add
      </button>
      <div class="table__container row">
        <div class="card col s12">
          <div class="card-content">
            <div
              v-if="loading"
              class="center-align"
            >
              <preloader />
            </div>
            <table
              v-else-if="haveItems()"
              class="responsive-table striped"
            >
              <thead>
                <tr>
                  <th>No.</th>
                  <th>Detail</th>
                  <th :class="{'icon-content': isMediumAndDown}">Picture</th>
                  <th>Last Update</th>
                  <th class="actions"></th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(i, n) in items"
                  :key="i.itemNo"
                >
                  <td>{{ n + 1 }}.</td>
                  <td>{{ i.detail }}</td>
                  <td>
                    <template v-if="i.picture">
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
                    </template>
                  </td>
                  <td>{{ i.updatedAt | datetime}}</td>
                  <td>
                    <button
                      @click="showEditModal(i.itemNo)"
                      class=" btn-floating waves-effect waves-light light-blue darken-1"
                    >
                      <i class="material-icons">edit</i>
                    </button>
                    <button
                      @click="destroy(i.itemNo)"
                      class=" btn-floating waves-effect waves-light red"
                    >
                      <i class="material-icons">delete</i>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
            <h5
              v-else
              class="center-align"
            >NOT FOUND</h5>
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
import ApprnStdSaveModal from '~/components/ApprnStd/SaveModal';
import { eventBus } from '~/plugins/eventBus';

export default {
  name: 'ApprnStdModal',

  mixins: [mixins],

  components: {
    ApprnStdSaveModal
  },

  computed: {
    ...mapGetters({
      items: 'part/apprnStds',
      popupImage: 'ui/popupImage',
      loadingPopupImage: 'ui/loadingPopupImage'
    })
  },

  data() {
    return {
      partNo: null,
      loading: false,
      containerClass: ''
    };
  },

  methods: {
    async open(partNo) {
      try {
        this.partNo = partNo;
        this.loading = true;
        this.containerClass = 'up';
        await this.$store.dispatch('part/getApprnStdsByPartNo', {
          partNo: this.partNo
        });
      } catch (err) {
        this.showError(err);
      } finally {
        this.loading = false;
      }
    },

    async destroy(itemNo) {
      if (confirm('Are you sure you want to delete this item?')) {
        try {
          await this.$store.dispatch('part/deleteApprnStd', {
            partNo: this.partNo,
            itemNo
          });
          M.toast({ html: 'Apprn Std has been successfully deleted' });
        } catch (err) {
          this.showError(err);
        }
      }
    },

    haveItems() {
      return !_.isEmpty(this.items);
    },

    close() {
      this.containerClass = 'down';
    },

    showAddModal() {
      this.$refs.apprnStdSaveModal.showAdd(this.partNo);
    },

    showEditModal(itemNo) {
      this.$refs.apprnStdSaveModal.showEdit(this.partNo, itemNo);
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
