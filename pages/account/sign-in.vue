<template>
  <div class="sign-in__container row">
    <div class="card col s12 m10 offset-m1 l8 offset-l2 xl6 offset-xl3">
      <div class="card-content">
        <div class="row">
          <div class="input-field col s12">
            <input
              v-model.trim="uid"
              autocomplete="off"
              id="uid"
              type="text"
              @keyup.enter="signIn"
              @input="$v.uid.$touch()"
              :class="{invalid: $v.uid.$dirty && $v.uid.$invalid}"
            >
            <label for="uid">Username</label>
            <span
              v-if="$v.uid.$dirty && !$v.uid.required"
              class="helper-text"
              data-error="Username is empty"
            ></span>
          </div>
        </div>
        <div class="row">
          <div class="input-field col s12">
            <input
              v-model.trim="password"
              autocomplete="off"
              id="password"
              type="password"
              @keyup.enter="signIn"
              @input="$v.password.$touch()"
              :class="{invalid: $v.password.$dirty && $v.password.$invalid}"
            >
            <label for="password">Password</label>
            <span
              v-if="$v.password.$dirty && !$v.password.required"
              class="helper-text"
              data-error="Password is empty"
            ></span>
          </div>
        </div>
        <div class="row">
          <div class="col s12">
            <preloader
              v-if="loading"
              size="small"
            />
            <button
              v-else
              @click="signIn"
              class="waves-effect waves-light btn light-blue darken-1"
            >
              <i class="material-icons left">lock_open</i>
              Sign In
            </button>
            <a
              href="#!"
              @click.prevent="showQRCode"
            ><i class="material-icons small">center_focus_strong</i></a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { required, email } from 'vuelidate/lib/validators';

import { eventBus } from '~/plugins/eventBus';
import mixins from '~/mixins';
import { SHOW_QC_CODE, GET_QC_CODE_VALUE } from '~/constants/eventBus';

export default {
  name: 'SignInPage',

  middleware: ['isUnauth'],

  mixins: [mixins],

  fetch({ store }) {
    store.dispatch('setTitle', 'QC SIGN IN');
  },

  computed: {
    ...mapGetters({ unauthorized: 'auth/unauthorized' })
  },

  watch: {
    unauthorized(value) {
      if (value) {
        this.showUnauthorizedToast();
        this.loading = false;
      }
    }
  },

  data() {
    return {
      uid: '',
      password: '',
      loading: false
    };
  },

  validations: {
    uid: {
      required
    },
    password: {
      required
    }
  },

  methods: {
    showQRCode() {
      eventBus.$emit(SHOW_QC_CODE);
    },

    async signIn() {
      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      }
      const payload = { uid: this.uid, password: this.password };
      try {
        this.loading = true;
        await this.$store.dispatch('auth/authenticate', payload);
        const { redirectUrl } = this.$route.query;
        this.$router.push(redirectUrl || '/');
      } catch (err) {
        this.showError(err);
        this.loading = false;
      }
    },

    getQcCodeValue(uid) {
      this.uid = uid;
      this.updateTextFields();
    },

    showUnauthorizedToast() {
      M.toast({
        html: 'Unauthorized',
        completeCallback: () => {
          this.$store.dispatch('auth/setUnauthorized', false);
        }
      });
    }
  },

  created() {
    eventBus.$on(GET_QC_CODE_VALUE, this.getQcCodeValue);
  },

  mounted() {
    if (process.client) {
      if (this.unauthorized) {
        this.showUnauthorizedToast();
      }
    }
  },

  destroyed() {
    eventBus.$off(GET_QC_CODE_VALUE, this.getQcCodeValue);
  }
};
</script>

<style lang="scss" scoped>
.sign-in__container {
  margin-top: 0;
  margin-bottom: 0;

  .card {
    margin-top: 0;
    margin-bottom: 0;

    .row:last-child {
      margin-bottom: 0;

      .col {
        display: flex;
        justify-content: space-between;
        align-items: center;

        a {
          transform: translateY(3px);
        }
      }
    }
  }
}
</style>
