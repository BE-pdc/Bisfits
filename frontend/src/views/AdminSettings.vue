<template>
  <div>
    <settings-component />
  </div>
</template>

<script>
import SettingsComponent from "../components/AdminComponents/Settings.vue";
export default {
  props: ["user"],
  components: {
    SettingsComponent
  },
  created() {
    if (Object.keys(this.user).length !== 0) {
      this.$loggedInAs = this.user;
      this.$permitUserToRoute(this.$loggedInAs, this.$route.name);
    }
  }
};
</script>

<style lang="scss" scoped>
.overview {
  background-color: rgba(255, 255, 255, 0.85);
  border-radius: 20px;
  margin: 20px auto;
}
</style>