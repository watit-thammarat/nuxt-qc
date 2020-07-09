<template>
  <li class="user__container">
    <i class="user__icon material-icons light-blue-text text-darken-1">account_circle</i>
    <div class="user__fullname">{{ profile && profile.fullName }}</div>
    <div class="user__email">{{ profile && profile.email }}</div>
    <div class="qr__container">
      <img :src="profile && profile.qr">
    </div>
  </li>
</template>

<script>
import mixins from '~/mixins';

export default {
  name: 'UserNav',

  mixins: [mixins]
};
</script>

<style lang="scss" scoped>
.user__container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px;
}

.user__icon {
  font-size: 64px;
}

.user__fullname,
.user__email {
  line-height: 21.75px;
  padding-top: 16px;
}

.qr__container {
  margin-top: 24px;
  position: relative;
  width: 180px;
  height: 180px;
  overflow: hidden;

  img {
    display: block;
    width: 240px;
    height: 240px;
    position: absolute;
    top: -32px;
    left: -32px;
  }
}
</style>
