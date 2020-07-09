import _ from 'lodash';

const ASC = 'asc';
const DESC = 'desc';

export default {
  computed: {
    haveItems() {
      return !_.isEmpty(this.items);
    }
  },

  methods: {
    handleSort(sortColumn) {
      if (this.sortColumn === sortColumn) {
        this.sortDirection = this.sortDirection === DESC ? ASC : DESC;
      } else {
        this.sortColumn = sortColumn;
        this.sortDirection = DESC;
      }
      this.$emit('onSort', {
        sortColumn: this.sortColumn,
        sortDirection: this.sortDirection
      });
    },

    getSortDirectionIcon() {
      return this.sortDirection === DESC ? 'arrow_drop_down' : 'arrow_drop_up';
    },

    onPageChanged(pageNumber) {
      this.pageNumber = pageNumber;
      this.$emit('onPageChanged', this.pageNumber);
    },

    onEdit(id) {
      this.$emit('onEdit', id);
    },

    onDelete(id) {
      this.$emit('onDelete', id);
    }
  }
};
