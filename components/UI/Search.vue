<template>
  <div class="search__container row">
    <div class="card col s12 m10 offset-m1 l8 offset-l2 xl6 offset-xl3">
      <div class="card-content">
        <div class="row">
          <div class="input-field col s12">
            <input
              v-model.trim="keyword"
              autocomplete="off"
              id="keyword"
              type="text"
              @keyup.enter="search"
            >
            <label for="keyword">{{ placeholder }}</label>
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
import mixins from '~/mixins';

export default {
  name: 'Search',

  mixins: [mixins],

  props: {
    searching: {
      type: Boolean,
      required: true
    },

    placeholder: {
      type: String,
      default: 'Search'
    }
  },

  data() {
    return {
      keyword: ''
    };
  },

  methods: {
    search() {
      this.$emit('onSearch', this.keyword);
    }
  }
};
</script>

<style lang="scss" scoped>
.search__container {
  margin-top: 0;
  margin-bottom: 16px;

  .card {
    margin-top: 0;
    margin-bottom: 0;

    .row:last-child {
      margin-bottom: 0;
    }
  }
}
</style>
