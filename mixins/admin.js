export default {
  data() {
    return {
      searching: false
    };
  },

  methods: {
    async onPageChanged(pageNumber) {
      this.payload.pageNumber = pageNumber;
      await this.search();
    },

    async onSearch(keyword) {
      this.searching = true;
      this.payload.searching = true;
      this.payload.pageNumber = 1;
      this.payload.keyword = keyword;
      await this.search();
      this.searching = false;
    },

    async onSort({ sortColumn, sortDirection }) {
      this.payload.sortColumn = sortColumn;
      this.payload.sortDirection = sortDirection;
      this.payload.pageNumber = 1;
      await this.search();
    },

    async onSaveCompleted() {
      await this.search();
    }
  }
};
