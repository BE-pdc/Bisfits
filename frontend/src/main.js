import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import vuetify from "./plugins/vuetify";
import msal from "vue-msal";
import JsonExcel from "vue-json-excel";
Vue.config.productionTip = false;

Vue.component("downloadExcel", JsonExcel);
Vue.use(msal, {
  auth: {
    clientId: "14dfc30f-dc84-420f-8ac8-a416505867ef",
    tenantId: "33d8cf3c-2f14-48c0-9ad6-5d2825533673",
    //redirectUri: "http://localhost:8081/login/oauth2/code/azure",
    redirectUri: "https://vps101.ap.be/login/oauth2/code/azure",
    scopes: ["profile", "openid", "user.read"],
  },
  request: {
    scopes: ["openid", "profile", "user.read"],
  },
  graph: {
    callAfterInit: true,
    baseUrl: "https://graph.microsoft.com/v1.0",
    endpoints: {
      profile: "/me",
    },
  },
  cache: {
    storeAuthStateInCookie: true,
  },
});

new Vue({
  router,
  vuetify,
  render: (h) => h(App),
}).$mount("#app");
