<template>
  <ul
    v-if="show"
    class="pagination"
  >
    <li :class="this.pageNumber === 1 ? 'disabled' : 'waves-effect'">
      <a
        href="#!"
        @click.prevent="onPreviousLinkClicked"
      ><i class="material-icons">chevron_left</i></a>
    </li>
    <li
      v-for="i in chunkPages"
      :key="i"
      :class="pageNumber === i ? 'active' : 'waves-effect'"
    >
      <a
        @click.prevent="onPageChanged(i)"
        href="#!"
      >{{ i }}</a>
    </li>
    <li :class="this.pageNumber === this.lastPage ? 'disabled' : 'waves-effect'">
      <a
        href="#!"
        @click.prevent="onNextLinkCicked"
      ><i class="material-icons">chevron_right</i></a>
    </li>
  </ul>
</template>

<script>
import _ from 'lodash';

import mixins from '~/mixins';
import { PAGE_SIZE, CHUNK_SIZE } from '~/constants/pagination';

export default {
  name: 'Pagination',

  mixins: [mixins],

  props: {
    itemCount: {
      type: Number,
      required: true
    },

    pageNumber: {
      type: Number,
      required: true
    }
  },

  computed: {
    chunkPages() {
      return this.pages.find(chunk => chunk.some(p => p === this.pageNumber));
    },

    lastPage() {
      return _.last(_.flatten(this.pages));
    },

    show() {
      return _.flatten(this.pages).length > 1;
    },

    pages() {
      const pageCount = Math.ceil(this.itemCount / PAGE_SIZE);
      return _.chunk(_.range(1, pageCount + 1), CHUNK_SIZE);
    }
  },

  methods: {
    onPageChanged(pageNumber) {
      this.$emit('onPageChanged', pageNumber);
    },

    onPreviousLinkClicked() {
      if (this.pageNumber > 1) {
        this.onPageChanged(this.pageNumber - 1);
      }
    },

    onNextLinkCicked() {
      if (this.pageNumber < this.lastPage) {
        this.onPageChanged(this.pageNumber + 1);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
