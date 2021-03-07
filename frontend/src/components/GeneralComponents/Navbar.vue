<template>
  <div>
    <v-app-bar dense fixed>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" id="drawerbutton" boolean="true"></v-app-bar-nav-icon>
      <router-link to="/">
        <img id="apimg" src="../../../images/AP.png" />
      </router-link>
      <h3 class="overline paddingLogo" style="font-size: 1.5rem !important">FixitAP</h3>
      <v-spacer></v-spacer>
      <v-menu
        min-width="400px"
        v-model="notification"
        :offset-y="true"
        :close-on-content-click="false"
      >
        <template v-slot:activator="{ on }">
          <v-badge
            :content="newNotificationsCount"
            :value="newNotificationsCount"
            color="red"
            left
            offset-x="20"
            offset-y="20"
          >
            <v-btn large icon v-on="on" @click="readNotification()">
              <v-icon medium>notifications</v-icon>
            </v-btn>
          </v-badge>
        </template>
        <v-list three-line v-if="this.notificationCount > 0">
          <h3 class="text-center">Notifications</h3>
          <div v-for="(n, index) in notifications" :key="index">
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>Resolved</v-list-item-title>
                <v-list-item-subtitle>{{ n.name }} has been resolved</v-list-item-subtitle>
                <v-spacer></v-spacer>
              </v-list-item-content>
              <v-list-item-action>
                <v-btn icon medium color="black" @click="deleteNotification(index)">
                  <v-icon>close</v-icon>
                </v-btn>
              </v-list-item-action>
            </v-list-item>
            <v-divider></v-divider>
          </div>
          <v-list-item>
            <div class="btn-delete-notification">
              <v-spacer></v-spacer>
              <v-btn tile medium @click="deleteAllNotifications">Delete notifications</v-btn>
            </div>
          </v-list-item>
        </v-list>
        <v-list v-else-if="this.notifications.length === 0">
          <v-list-item>
            <v-list-item-title>You have no new notifications</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>

      <v-icon medium @click="$router.push('/emergency')" style="right: 0;">call</v-icon>
    </v-app-bar>
    <v-navigation-drawer id="nav-drawer" v-model="drawer" fixed temporary>
      <v-list-item>
        <v-list-item-avatar>
          <v-avatar v-if="userPhoto">
            <v-img v-bind:src="'data:image/jpeg;base64,' + userPhoto" />
          </v-avatar>
          <v-avatar v-else>
            <v-icon large>mdi-account</v-icon>
          </v-avatar>
        </v-list-item-avatar>
        <v-list-item-content style="margin-bottom: -20px;">
          <h3 v-if="fullname">{{ fullname }}</h3>
          <p class="userrole" v-if="user">{{ this.user.role }}</p>
        </v-list-item-content>
      </v-list-item>
      <v-divider></v-divider>
      <v-list dense v-if="this.user.role == 'Admin'">
        <v-list-item v-for="item in items" :id="item.title" :key="item.title" :to="item.path" link>
          <v-list-item-icon>
            <v-icon style="color: rgb(225,6,19);">{{ item.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <v-list
        dense
        v-else-if="this.user.role == 'Facility Coordinator' || this.user.role == 'Logistic Coordinator'"
      >
        <v-list-item
          v-for="item in itemForFacCoor"
          :id="item.title"
          :key="item.title"
          :to="item.path"
          link
        >
          <v-list-item-icon>
            <v-icon style="color: rgb(225,6,19);">{{ item.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <v-list
        dense
        v-else-if="
          this.user.role == 'Logistic Coordinator' ||
            this.user.role == 'Facility Coordinator' ||
            this.user.role == 'Logistic Employee' ||
            this.user.role == 'Facility Employee'
        "
      >
        <v-list-item
          v-for="item in itemsForArchivers"
          :id="item.title"
          :key="item.title"
          :to="item.path"
          link
        >
          <v-list-item-icon>
            <v-icon style="color: rgb(225,6,19);">{{ item.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>

      <v-list dense v-else>
        <v-list-item
          v-for="item in itemsForNormalUsers"
          :id="item.title"
          :key="item.title"
          :to="item.path"
          link
        >
          <v-list-item-icon>
            <v-icon style="color: rgb(225,6,19);">{{ item.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <div class="btn-logout-container">
        <v-btn tile color="#E62B36" class="white--text btn-logout" @click="logout">
          <v-icon small style="color: rgb(255,255,255);">mdi-logout</v-icon>LOGOUT
        </v-btn>
      </div>
    </v-navigation-drawer>
  </div>
</template>

<script>
import api from "../backend-api.js";
export default {
  props: ["user", "msal"],
  data() {
    return {
      drawer: null,
      notification: false,
      notifications: [],
      notificationCount: 0,
      newNotificationsCount: 0,
      userPhoto: "",
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
  methods: {
    deleteNotification(index) {
      api.deleteNotification(this.user.id, index);
      this.notifications.splice(index, 1);
      this.notificationCount -= 1;
    },
    deleteAllNotifications() {
      api.deleteNotifications(this.user.id);
      this.notifications.splice(0, this.notifications.length);
      this.notificationCount = 0;
    },
    readNotification() {
      api.updateNotificationToRead(this.user.id);
      this.newNotificationsCount = 0;
    },
    logout() {
      this.$msal.signOut();
    },
    fetchNotifications() {
      api.getNotifications(this.user.id).then(response => {
        this.notificationCount = response.data.length;
        response.data.forEach(element => {
          api.getDefect(element.defectId).then(res => {
            this.notifications.push(res.data);
          });
          if (!element.isRead) {
            this.newNotificationsCount += 1;
          }
        });
      });
    }
  },

  computed: {
    fullname() {
      return this.user.firstname + " " + this.user.lastname;
    },
    itemForFacCoor() {
      return this.items.filter(
        i => i.title !== "Admin settings" && i.title !== "Users"
      );
    },
    itemsForNormalUsers() {
      return this.items.filter(
        i =>
          i.title !== "Archive" &&
          i.title !== "Admin overview" &&
          i.title !== "Admin settings" &&
          i.title !== "Users"
      );
    },
    itemsForArchivers() {
      return this.items.filter(
        i =>
          i.title !== "Admin overview" &&
          i.title !== "Admin settings" &&
          i.title !== "Users"
      );
    }
  },
  mounted() {
    this.$msal.acquireToken().then(res => {
      var ref = this;
      this.$msal
        .msGraph([
          {
            url: "/me/photo/$value",
            responseType: "blob",
            headers: {
              Authorization: `Bearer ${res}`
            }
          }
        ])
        .then(res => {
          if (res[0].status === 404) {
            ref.userPhoto = "";
          } else {
            ref.userPhoto = res[0].body;
          }
        });
    });

    this.fetchNotifications();
  }
};
</script>

<style lang="scss" scoped>
.paddingLogo {
  padding-left: 15px;
}
.btn-logout-container {
  margin: 0 auto 25px;
  width: 100%;
  text-align: center;
  bottom: 0;
  position: absolute;
}
.btn-delete-notification {
  width: 100%;
  text-align: center;
}

@media only screen and (max-width: 600px){
  .paddingLogo {
    padding-left: 10px;
  }
}
</style>
