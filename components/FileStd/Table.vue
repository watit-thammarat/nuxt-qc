<template>
  <div class="table__container">
    <div
      v-if="haveItems"
      class=" row"
    >
      <div class="card col s12">
        <div class="card-content">
          <table class="responsive-table striped">
            <thead>
              <tr>
                <template v-for="c in columns">
                  <th
                    :class="{'sortable': isMediumAndDown}"
                    v-if="c.sortable"
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
                    v-else
                    :key="c.id"
                    :class="{'icon-content': isMediumAndDown}"
                  >
                    <span>{{ c.value }}</span>
                  </th>
                </template>
                <th class="actions"></th>
              </tr>
            </thead>
            <tbody>
              <template>
                <tr
                  v-for="i in items"
                  :key="i.id"
                >
                  <td>{{ i.part.id }}</td>
                  <td>{{ i.part.name }}</td>
                  <td>{{ i.updatedAt | datetime}}</td>
                  <td>
                    <a
                      v-if="i.trouble"
                      href="#!"
                      @click.prevent="showPDF(i.trouble)"
                    ><i class="material-icons small">picture_as_pdf</i></a>
                  </td>
                  <td>
                    <a
                      v-if="i.appearance"
                      href="#!"
                      @click.prevent="showPDF(i.appearance)"
                    ><i class="material-icons small">picture_as_pdf</i></a>
                    <a
                      v-if="i.appearance"
                      href="#!"
                      @click.prevent="showApprnStdModal(i.part.id)"
                    >
                      <i class="material-icons small grey-text text-darken-1">settings</i></a>
                  </td>
                  <td>
                    <button
                      @click="onEdit(i.part.id)"
                      class=" btn-floating waves-effect waves-light light-blue darken-1"
                    >
                      <i class="material-icons">edit</i>
                    </button>
                    <button
                      @click="onDelete(i.part.id)"
                      class=" btn-floating waves-effect waves-light red"
                    >
                      <i class="material-icons">delete</i>
                    </button>
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
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
      class="row"
    >
      <div class="card col s12">
        <div class="card-content">
          <h5 class="center-align">NOT FOUND</h5>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash';
import { mapGetters } from 'vuex';

import mixins from '~/mixins';
import tableMixins from '~/mixins/table';

export default {
  name: 'FileStdTable',

  mixins: [mixins, tableMixins],

  data() {
    const { pageNumber, sortColumn, sortDirection } = this.$store.getters[
      'part/defaultValues'
    ];
    return {
      pageNumber,
      sortColumn,
      sortDirection,
      columns: [
        { id: 'partno', value: 'Part No', sortable: true },
        { id: 'partnam', value: 'Part Name', sortable: true },
        { id: 'upddttm', value: 'Last Update', sortable: true },
        { id: 'file_trouble', value: 'Trouble', sortable: false },
        { id: 'file_apprn', value: 'Appearance', sortable: false }
      ],
      partNo: null
    };
  },

  computed: {
    ...mapGetters({
      items: 'part/fileStds',
      itemCount: 'part/fileStdCount'
    })
  },

  methods: {
    showApprnStdModal(id) {
      this.$emit('onApprnStdModalOpened', id);
    }
  },

  mounted() {
    this.$nextTick(() => {
      this.$forceUpdate();
    });
  }
};
</script>

<style lang="scss" scoped>
</style>
