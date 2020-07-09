<template>
  <div
    ref="modal"
    class="modal modal-fixed-footer"
  >
    <div class="modal-content">
      <div class="row">
        <div class="input-field col s12">
          <select
            ref="samplingTypes"
            :disabled="!isAdd"
            v-model="type"
          >
            <option
              v-for="s in samplingTypes"
              :key="s.id"
              :value="s.id"
              :selected="s.id === type"
            >{{ s.name }}</option>
          </select>
          <label>Sampling Type</label>
        </div>
      </div>
      <div class="row">
        <div class="input-field col s12">
          <input
            :disabled="!isAdd"
            v-model.trim="level"
            autocomplete="off"
            id="level"
            type="text"
            @keyup.enter="save"
            @input="$v.level.$touch()"
            :class="{invalid: $v.level.$dirty && $v.level.$invalid}"
          >
          <label for="level">Level</label>
          <span
            v-if="$v.level.$dirty && (!$v.level.required || !$v.level.maxLength)"
            class="helper-text"
            data-error="Level must have 1 character"
          ></span>
        </div>
      </div>
      <div class="row">
        <div class="input-field col s12">
          <input
            v-model.trim="from"
            autocomplete="off"
            id="from"
            type="number"
            @keyup.enter="save"
            @input="$v.from.$touch()"
            :class="{invalid: $v.from.$dirty && $v.from.$invalid}"
          >
          <label for="from">Lot size from</label>
          <span
            v-if="$v.from.$dirty && (!$v.from.required || !$v.from.numeric)"
            class="helper-text"
            data-error="Lot size from is not a number"
          ></span>
        </div>
      </div>
      <div class="row">
        <div class="input-field col s12">
          <input
            v-model.trim="to"
            autocomplete="off"
            id="to"
            type="number"
            @keyup.enter="save"
            @input="$v.to.$touch()"
            :class="{invalid: $v.to.$dirty && $v.to.$invalid}"
          >
          <label for="to">Lot size to</label>
          <span
            v-if="$v.to.$dirty && (!$v.to.required || !$v.to.numeric)"
            class="helper-text"
            data-error="Lot size to is not a number"
          ></span>
        </div>
      </div>
      <div class="row">
        <div class="input-field col s12">
          <input
            v-model.trim="size"
            ausizecomplete="off"
            id="size"
            type="number"
            @keyup.enter="save"
            @input="$v.size.$touch()"
            :class="{invalid: $v.size.$dirty && $v.size.$invalid}"
          >
          <label for="size">Sampling size</label>
          <span
            v-if="$v.size.$dirty && (!$v.size.required || !$v.size.numeric)"
            class="helper-text"
            data-error="Sampling size is not a number"
          ></span>
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
import _ from 'lodash';
import { mapGetters } from 'vuex';
import { required, numeric, maxLength } from 'vuelidate/lib/validators';

import mixins from '~/mixins';
import modalMixins from '~/mixins/modal';

export default {
  name: 'SamplingModal',

  mixins: [mixins, modalMixins],

  computed: {
    ...mapGetters({
      samplingTypes: 'sampling/samplingTypes',
      items: 'sampling/items'
    })
  },

  data() {
    const samplingTypes = this.$store.getters['sampling/samplingTypes'];
    return {
      type: samplingTypes[0].id,
      level: '',
      from: '',
      to: '',
      size: '',
      samplingTypesRef: null
    };
  },

  validations: {
    level: {
      required,
      maxLength: maxLength(1)
    },

    from: {
      required,
      numeric
    },

    to: {
      required,
      numeric
    },

    size: {
      required,
      numeric
    }
  },

  methods: {
    updateSamplingTypesRef() {
      this.destroySamplingTypesRef();
      this.$nextTick(() => {
        this.samplingTypesRef = M.FormSelect.init(this.$refs.samplingTypes);
      });
    },

    openModal() {
      this.$nextTick(() => {
        this.modal.open();
      });
    },

    updateForm() {
      this.updateTextFields();
      this.updateSamplingTypesRef();
      this.$v.$reset();
      this.openModal();
    },

    showAdd() {
      this.isAdd = true;
      this.type = this.samplingTypes[0].id;
      this.level = '';
      this.from = '';
      this.to = '';
      this.size = '';
      this.updateForm();
    },

    showEdit({ type, level }) {
      this.isAdd = false;
      const item = _.find(
        this.items,
        i => i.type === type && i.level === level
      );
      this.type = item.type;
      this.level = item.level;
      this.from = item.from;
      this.to = item.to;
      this.size = item.size;
      this.updateForm();
    },

    destroySamplingTypesRef() {
      if (this.samplingTypesRef) {
        this.samplingTypesRef.destroy();
      }
    },

    async save() {
      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      }
      try {
        const payload = {
          type: this.type,
          level: this.level,
          from: this.from,
          to: this.to,
          size: this.size
        };
        this.loading = true;
        if (this.isAdd) {
          await this.$store.dispatch('sampling/addItem', payload);
        } else {
          await this.$store.dispatch('sampling/updateItem', payload);
        }
        this.$emit('onSaveCompleted');
        this.modal.close();
        M.toast({ html: 'Sampling data has been successfully saved' });
      } catch (err) {
        this.showError(err);
      } finally {
        this.loading = false;
      }
    }
  },

  destroyed() {
    this.destroySamplingTypesRef();
  }
};
</script>
  
<style lang="scss" scoped>
</style>
