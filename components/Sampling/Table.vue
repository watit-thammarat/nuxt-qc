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
              <th class="actions"></th>
            </tr>
          </thead>
          <tbody>
            <template>
              <tr
                v-for="i in items"
                :key="`${i.type}_${i.level}`"
              >
                <td>{{ i.type }}</td>
                <td>{{ i.level }}</td>
                <td>{{ i.from | number }}</td>
                <td>{{ i.to | number }}</td>
                <td>{{ i.size | number }}</td>
                <td>{{ i.updatedAt | datetime }}</td>
                <td>
                  <button
                    @click="onEdit(`${i.type}_${i.level}`)"
                    class=" btn-floating waves-effect waves-light light-blue darken-1"
                  >
                    <i class="material-icons">edit</i>
                  </button>
                  <button
                    @click="onDelete(`${i.type}_${i.level}`)"
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
        <h6 class="center-align">Not found</h6>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

import mixins from '~/mixins';
import tableMixins from '~/mixins/table';

export default {
  name: 'SampingTable',

  mixins: [mixins, tableMixins],

  data() {
    const { pageNumber, sortColumn, sortDirection } = this.$store.getters[
      'sampling/defaultValues'
    ];
    return {
      pageNumber,
      sortColumn,
      sortDirection,
      columns: [
        { id: 'sampling_typ', value: 'TYPE' },
        { id: 'level', value: 'LEVEL' },
        { id: 'lotsize_fr', value: 'FROM' },
        { id: 'lotsize_to', value: 'TO' },
        { id: 'sampling_size', value: 'SIZE' },
        { id: 'upddttm', value: 'Last Update' }
      ]
    };
  },

  computed: {
    ...mapGetters({
      items: 'sampling/items',
      itemCount: 'sampling/itemCount'
    })
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
