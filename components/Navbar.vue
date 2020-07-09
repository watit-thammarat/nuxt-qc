<template>
  <div>
    <ul
      ref="sidenav"
      id="sidenav"
      class="sidenav"
    >
      <template v-if="isAuthenticated">
        <user-nav />
        <li>
          <div class="divider"></div>
        </li>
      </template>
      <li
        v-for="(m, i) in menus"
        :key="i"
      >
        <nuxt-link
          exact
          class="waves-effect sidenav-close"
          :to="m.to"
        >
          <i class="material-icons">{{ m.icon }}</i>
          {{ m.title}}
        </nuxt-link>
      </li>
      <template v-if="isAuthenticated">
        <div class="divider"></div>
        <li v-if="isAuthenticated">
          <a
            class="waves-effect"
            href="#!"
            @click.prevent="signout"
          >
            <i class="material-icons">exit_to_app</i>Sign Out
          </a>
        </li>
      </template>
    </ul>
    <nav>
      <div class="nav-wrapper">
        <a
          href="#"
          data-target="sidenav"
          class="sidenav-trigger"
        >
          <i class="material-icons">menu</i>
        </a>
        <a
          href="/"
          class="brand-logo"
        >{{ title }}</a>
        <ul class="right hide-on-med-and-down">
          <li
            v-for="(m, i) in menus"
            :key="i"
          >
            <nuxt-link
              exact
              :to="m.to"
            >
              <i class="material-icons left">{{ m.icon }}</i>
              {{ m.title}}
            </nuxt-link>
          </li>
          <li v-if="isAuthenticated">
            <a
              ref="ddlUser"
              class="dropdown-trigger"
              href="#!"
              data-target="ddlUser"
            >
              <i class="user__nav-icon material-icons left">account_circle</i>
              {{ profile && profile.fullName }}
              <i class="material-icons right">arrow_drop_down</i>
            </a>
            <ul
              id="ddlUser"
              class="dropdown-content"
            >
              <user-nav />
              <li class="divider"></li>
              <li><a
                  href="#!"
                  @click.prevent="signout"
                  class="center-align"
                >Sign Out</a></li>
            </ul>
          </li>
        </ul>
      </div>
    </nav>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

import mixins from '~/mixins';
import UserNav from '~/components/User/Nav';

export default {
  name: 'Navbar',

  mixins: [mixins],

  components: {
    UserNav
  },

  data() {
    return {
      ddlUser: null,
      sidenav: null
    };
  },

  computed: {
    ...mapGetters({ title: 'title' }),
    menus() {
      let data = [
        {
          title: 'QC',
          to: '/',
          icon: 'center_focus_strong'
        }
      ];
      if (this.isAuthenticated) {
        if (this.isAdmin) {
          data = [
            ...data,
            {
              title: 'User',
              to: '/admin/user',
              icon: 'person'
            },
            {
              title: 'Part',
              to: '/admin/part',
              icon: 'widgets'
            },
            {
              title: 'Sampling',
              to: '/admin/sampling',
              icon: 'tune'
            }
          ];
        }
      } else {
        data.push({
          title: 'Sign In',
          to: '/account/sign-in',
          icon: 'lock_open'
        });
      }
      return data;
    }
  },

  watch: {
    isAuthenticated(value) {
      this.handleAuthenticated();
    }
  },

  methods: {
    signout() {
      this.sidenav.close();
      this.ddlUser.destroy();
      this.$store.dispatch('auth/signout');
      this.$router.push('/account/sign-in');
    },

    handleAuthenticated() {
      if (this.isAuthenticated) {
        this.$nextTick(() => {
          this.ddlUser = M.Dropdown.init(this.$refs.ddlUser);
        });
      }
    }
  },

  mounted() {
    if (process.client) {
      this.sidenav = M.Sidenav.init(this.$refs.sidenav);
      this.handleAuthenticated();
    }
  },

  destroyed() {
    if (this.ddlUser) {
      this.ddlUser.destroy();
    }
    if (this.sidenav) {
      this.sidenav.destroy();
    }
  }
};
</script>

<style lang="scss" scoped>
.user__nav-icon {
  font-size: 48px;
}

a.nuxt-link-active {
  background-color: rgba(0, 0, 0, 0.1);
}

#ddlUser {
  height: auto;
}
</style>
