import Vue from "vue";
import VueRouter from "vue-router";
import Admin from "../views/Admin.vue";
import Archive from "../views/Archive.vue";
import Home from "../views/Home.vue";
import Users from "../views/Users.vue";
import DefectDetailPage from "../views/DefectDetailPage.vue";
import AdminSettings from "../views/AdminSettings.vue";
import PageNotFound from "../views/PageNotFound.vue";
import TaskDetailPage from "../views/TaskDetailPage.vue";
import EmergencyContacts from "../views/EmergencyContacts.vue";
import Help from "../views/Help.vue";
Vue.use(VueRouter);

Vue.prototype.$loggedInAs = {};
Vue.prototype.$permitUserToRoute = function(user, route) {
  switch (route) {
    case "Admin":
      if (
        user.role == "Admin" ||
        user.role == "Facility Coordinator" ||
        user.role == "Logistic Coordinator"
      ) {
        break;
      }
      this.$router.push("/");
      break;
    case "Settings":
      if (user.role == "Admin") {
        break;
      }
      this.$router.push("/");
      break;
    case "Users":
      if (user.role == "Admin") {
        break;
      }
      this.$router.push("/");
      break;
    case "archive":
      if (
        user.role == "Admin" ||
        user.role == "Logistic Coordinator" ||
        user.role == "Facility Coordinator" ||
        user.role == "Logistic Employee" ||
        user.role == "Facility Employee"
      ) {
        break;
      }
      this.$router.push("/");
  }
};

const routes = [
  {
    path: "*",
    name: "404NOTFOUND",
    component: PageNotFound,
    meta: {
      header: 1,
    },
  },
  {
    path: "/admin",
    name: "Admin",
    component: Admin,
    props: true,
  },
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/archive",
    name: "Archive",
    component: Archive,
  },
  {
    path: "/users",
    name: "Users",
    component: Users,
  },
  {
    path: "/defect/:id",
    name: "DefectDetail",
    component: DefectDetailPage,
  },
  {
    path: "/task/:id",
    name: "TaskDetail",
    component: TaskDetailPage,
  },
  {
    path: "/settings",
    name: "Settings",
    component: AdminSettings,
  },
  {
    path: "/emergency",
    name: "EmergencyContacts",
    component: EmergencyContacts,
  },
  {
    path: "/help",
    name: "Help",
    component: Help,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
