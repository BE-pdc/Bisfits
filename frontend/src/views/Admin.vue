<template>
    <div class="admin" v-if="this.user.role == 'Admin' || this.user.role == 'Facility Coordinator' || this.user.role == 'Logistic Coordinator'">
      <overview :user=" this.user" />
    </div>
</template>

<script>
import Overview from "../components/GeneralComponents/Overview.vue";

export default {
  props: ["user"],
  name: "Admin",
  components: {
    Overview
  },
  created() {
    if (Object.keys(this.user).length !== 0) {
      this.$loggedInAs = this.user;
      this.$permitUserToRoute(this.$loggedInAs, this.$route.name);
    }
  }
};
</script>

<style>
.admin {
  width: 80vw;
}

.admin-nav {
  margin-right: 10px;
}

@media only screen and (max-width: 960px) {
  .admin {
    width: 100vw;
  }
}
</style>