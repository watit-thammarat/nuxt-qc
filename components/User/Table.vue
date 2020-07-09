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
                :key="i.id"
              >
                <td>{{ i.id }}</td>
                <td>{{ i.gid }}</td>
                <td>{{ i.uid }}</td>
                <td>{{ i.firstName }}</td>
                <td>{{ i.lastName }}</td>
                <td>{{ i.email }}</td>
                <td>{{ i.updatedAt | datetime }}</td>
                <td>
                  <button
                    @click="onEdit(i.id)"
                    class=" btn-floating waves-effect waves-light light-blue darken-1"
                  >
                    <i class="material-icons">edit</i>
                  </button>
                  <button
                    @click="onDelete(i.id)"
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
  name: 'UserTable',

  mixins: [mixins, tableMixins],

  data() {
    const { pageNumber, sortColumn, sortDirection } = this.$store.getters[
      'user/defaultValues'
    ];
    return {
      pageNumber,
      sortColumn,
      sortDirection,
      columns: [
        { id: 'id', value: 'ID' },
        { id: 'gid', value: 'GID' },
        { id: 'uid', value: 'UID' },
        { id: 'first_name', value: 'First Name' },
        { id: 'last_name', value: 'Last Name' },
        { id: 'email', value: 'Email' },
        { id: 'upddttm', value: 'Last Update' }
      ]
    };
  },

  computed: {
    ...mapGetters({
      items: 'user/users',
      itemCount: 'user/userCount'
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
