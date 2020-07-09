<template>
  <div
    ref="modal"
    class="modal modal-fixed-footer"
  >
    <div class="modal-content">
      <div class="row">
        <div class="input-field col s12">
          <input
            :disabled="!isAdd"
            ref="autocomplete"
            :class="{ invalid: !isValidFullName}"
            id="fullName"
            type="text"
            @input="onFullNameChanged"
          >
          <label for="fullName">Fullname</label>
          <span
            v-if="!isValidFullName"
            class="helper-text"
            data-error="Invalid full name"
          ></span>
        </div>
      </div>
      <div class="row">
        <div class="col s12">
          <h6>Role</h6>
          <span
            class="checkbox_container"
            v-for="r in roles"
            :key="r.id"
          >
            <label>
              <input
                @change="onRoleChanged"
                v-model="user.roles"
                :value="r.id"
                type="checkbox"
              />
              <span>{{ r.name }}</span>
            </label>
          </span>
        </div>
      </div>
      <div class="row">
        <div class="col s12">
          <h6>Vendor Groups</h6>
          <p
            v-for="v in vendorGroups"
            :key="v.name"
          >
            <label>
              <input
                @change="onVendorChanged"
                :disabled="!hasQcRole()"
                v-model="user.vendorGroups"
                :value="v.name"
                type="checkbox"
              />
              <span>{{ v.name }}</span>
            </label>
          </p>
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <button
        :disabled="loading"
        class="modal-close waves-effect waves-light btn red"
      >
        <i class="material-icons left">cancel</i>
        Cancel
      </button>
      <button
        :disabled="loading"
        class="waves-effect waves-light btn light-blue darken-1"
        @click="save"
      >
        <i class="material-icons left">save</i>
        {{ loading ? 'Saving...' : 'Save' }}
      </button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import _ from 'lodash';

import { QC } from '~/constants/roles';
import mixins from '~/mixins';
import modalMixins from '~/mixins/modal';

export default {
  name: 'UserModal',

  mixins: [mixins, modalMixins],

  computed: {
    ...mapGetters({
      roles: 'user/roles',
      vendorGroups: 'user/vendorGroups',
      users: 'user/users',
      tnsUsers: 'user/tnsUsers',
      searchItems: 'user/searchUsers'
    })
  },

  data() {
    return {
      autocomplete: null,
      isValidFullName: true,
      user: {
        id: null,
        fullName: null,
        roles: [],
        vendorGroups: []
      }
    };
  },

  watch: {
    searchItems(value) {
      this.autocomplete.updateData(value);
    }
  },

  methods: {
    hasQcRole() {
      return _.some(this.user.roles, r => r === QC.id);
    },

    getTnsUserByFullName(fullName) {
      return _.find(this.tnsUsers, u => u.fullName === fullName);
    },

    onVendorChanged() {
      if (_.isEmpty(this.user.vendorGroups) && this.hasQcRole()) {
        this.user.roles = _.filter(this.user.roles, r => r !== QC.id);
      }
    },

    onRoleChanged(e) {
      const { value, checked } = e.target;
      if (value == QC.id && !checked) {
        this.user.vendorGroups = [];
      }
    },

    updateForm() {
      this.updateTextFields();
      this.modal.open();
    },

    showAdd() {
      this.isAdd = true;
      this.user = {
        id: null,
        fullName: null,
        roles: [],
        vendorGroups: []
      };
      this.$refs.autocomplete.value = '';
      this.isValidFullName = true;
      this.updateForm();
    },

    showEdit(id) {
      this.isAdd = false;
      const user = _.find(this.users, u => u.id === id);
      this.user.id = user.id;
      this.user.fullName = user.fullName;
      this.user.roles = _.isEmpty(user.roles) ? [] : user.roles.map(r => r.id);
      this.user.vendorGroups = _.isEmpty(user.vendorGroups)
        ? []
        : _.map(user.vendorGroups, v => v.name);
      this.isValidFullName = true;
      this.$refs.autocomplete.value = user.fullName;
      this.updateForm();
    },

    onFullNameChanged(e) {
      this.user.id = null;
      this.user.fullName = e.target.value.trim();
      this.isValidFullName = true;
    },

    onSearchCompleted(fullName) {
      this.user.id = this.getTnsUserByFullName(fullName).id;
      this.user.fullName = fullName;
      this.isValidFullName = true;
    },

    validate() {
      if (!this.isAdd) {
        return true;
      }
      const user = this.getTnsUserByFullName(this.user.fullName);
      if (user) {
        this.user.id = user.id;
        return true;
      }
      this.isValidFullName = false;
      return false;
    },

    async save() {
      if (!this.validate()) {
        return;
      }
      try {
        this.loading = true;
        if (this.isAdd) {
          await this.$store.dispatch('user/createUser', this.user);
        } else {
          await this.$store.dispatch('user/updateUser', this.user);
        }
        this.$emit('onSaveCompleted');
        this.modal.close();
        M.toast({ html: 'User has been successfully saved' });
      } catch (err) {
        this.showError(err);
      } finally {
        this.loading = false;
      }
    }
  },

  mounted() {
    if (process.client) {
      this.autocomplete = M.Autocomplete.init(this.$refs.autocomplete, {
        data: this.searchItems,
        limit: 10,
        onAutocomplete: this.onSearchCompleted
      });
    }
  },

  destroyed() {
    if (this.autocomplete) {
      this.autocomplete.destroy();
    }
  }
};
</script>

<style lang="scss" scoped>
.row:last-child {
  margin-bottom: 0;
}

.checkbox_container:not(:last-child) {
  margin-right: 36px;
}

h6 {
  margin-bottom: 16px;
}
</style>
