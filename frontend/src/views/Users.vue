<template>
  <v-container class="usercontainer">
    <v-flex class="overview-header overline">
      <h2>Users</h2>
    </v-flex>
    <v-flex>
      <v-tabs color="#e60005" v-model="tab" slider-color="primary">
        <v-tabs-slider color="#e60005" />
        <v-tab v-for="item in tabs" :key="item">{{ item }}</v-tab>
      </v-tabs>
      <v-tabs-items v-model="tab">
        <v-tab-item v-for="item in tabs" :key="item">
          <RoleManagement v-if="item === 'AP Users'" />
          <ExternalManagement :externals="externals" v-else-if="item === 'External Users'" />
        </v-tab-item>
      </v-tabs-items>
    </v-flex>
    <AddExternal @submitEventTriggered="getExternals" />
  </v-container>
</template>

<script>
import RoleManagement from "@/components/AdminComponents/RoleManagement.vue";
import ExternalManagement from "@/components/AdminComponents/ExternalManagement.vue";
import AddExternal from "@/components/AdminComponents/AddExternal.vue";
import api from "../components/backend-api.js";

export default {
  name: "Users",
  props: ["user"],
  components: {
    RoleManagement,
    ExternalManagement,
    AddExternal
  },
  methods: {
    getExternals() {
      this.externals = [];
      api.getExternals().then(response => {
        this.externals = response.data;
      });
    }
  },
  data: () => ({
    tab: null,
    tabs: ["AP Users", "External Users"],
    externals: []
  }),
  created() {
    if (Object.keys(this.user).length !== 0) {
      this.$loggedInAs = this.user;
      this.$permitUserToRoute(this.$loggedInAs, this.$route.name);
    }
  },
  mounted() {
    this.getExternals();
  }
};
</script>

<style lang="css" scoped>
.usercontainer {
  width: 100vw;
}
</style>
