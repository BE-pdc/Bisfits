<template>
  <div id="wrapper">
    <v-app id="app">
      <div v-if="!user">
        <Login />
      </div>
      <v-sheet id="sheetWrapper" v-else>
        <v-row justify="center">
          <navbar v-if="$route.meta.header != 1 && !loading" :user="loggedInAs" :msal="msal" />
          <router-view v-if="!loading" :user="loggedInAs" />
        </v-row>
      </v-sheet>
    </v-app>
  </div>
</template>

<script>
import Navbar from "@/components/GeneralComponents/Navbar.vue";
import Login from "@/components/Login.vue";
import { msalMixin } from "vue-msal";
import api from "./components/backend-api";

export default {
  name: "App",
  components: { Navbar, Login },
  mixins: [msalMixin],

  data() {
    return {
      drawer: null,
      adminpages: [],
      loggedInAs: {},
      loading: false,
      items: [
        { title: "Home", path: "/", icon: "home" },
        { title: "Archive", path: "/archive", icon: "archive" },
        { title: "Users", path: "/users", icon: "mdi-account-group" },
        { title: "Admin overview", path: "/admin", icon: "view_compact" },
        { title: "Admin settings", path: "/settings", icon: "build" },
        { title: "Help", path: "/help", icon: "help" }
      ]
    };
  },
  computed: {
    user() {
      let currentUser = null;
      if (this.msal.isAuthenticated) {
        currentUser = {
          ...this.msal.user,
          profile: this.msal.graph.profile,
          photo: this.msal.graph.photo
        };
      }
      return currentUser;
    }
  },

  watch: {
    user(newVal) {
      let userExists = false;
      api.getUsers().then(users => {
        users.data.forEach(element => {
          if (element.email.localeCompare(newVal.profile.mail) === 0) {
            userExists = true;
          }
        });
        if (!userExists) {
          api.saveNewUser(
            newVal.profile.id,
            newVal.profile.givenName,
            newVal.profile.surname,
            newVal.profile.mail,
            newVal.profile.userPrincipalName
          );
        }
      });
    }
  },
  mounted() {
    if (this.user !== null) {
      api
        .getUser(this.user.accountIdentifier)
        .then(res => {
          this.loggedInAs = res.data;
          this.loading = true;
        })
        .then(() => {
          this.loading = false;
        });
    }
  }
};
</script>

<style>
* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}
#app {
  background: rgba(0, 0, 0, 0);
}
#wrapper {
  background: url("../images/abstractbackground3.jpg") no-repeat center center;
  background-size: cover;
  background-attachment: fixed;
  overflow-x: hidden;
  overflow-y: hidden;
}
#apimg {
  margin-top: 7px;
  height: 50px;
}
#menuicon {
  font-size: 35px;
}
#sheetWrapper {
  height: 100%;
  background: rgba(0, 0, 0, 0);
  padding-top: 5%;
}
.userrole {
  font-size: 15px;
}
@media only screen and (max-width: 960px) {
  #sheetWrapper {
    height: 100%;
    background: rgba(0, 0, 0, 0);
    padding-top: 48px;
  }
}
@media only screen and (max-width: 600px) {
}
</style>
