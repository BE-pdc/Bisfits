<template>
  <v-container row v-if="!this.loading">
    <v-flex class="addPadding" lg6 md6 sm6 xs12>
      <personal-overview :defects="defects" :tasks="tasks" :user="this.user" />
    </v-flex>
    <v-flex class="addPadding" lg6 md6 sm6 xs12>
      <general-overview :defects="defects" :tasks="tasks" />
    </v-flex>
    <add-notification-button @submitEventTriggered="refresh" :user="this.user" />
  </v-container>
</template>

<script>
import GeneralOverview from "@/components/PersonalOverviewComponents/GeneralOverview.vue";
import PersonalOverview from "@/components/PersonalOverviewComponents/PersonalOverview.vue";
import AddNotificationButton from "../components/GeneralComponents/AddNotificationButton.vue";
import api from "../components/backend-api";

export default {
  name: "Home",
  props: ["user"],
  components: { GeneralOverview, PersonalOverview, AddNotificationButton },
  data() {
    return {
      tasks: [],
      defects: [],
      loadedDefects: false,
      loadedTasks: false,
      loading: true
    };
  },
  methods: {
    getAllTasks() {
      api
        .getAllTasks()
        .then(response => {
          this.tasks = response.data;
          this.loadedTasks = true;
          this.isDoneLoading();
        })
        .catch(error => {
          console.error(error);
        });
    },
    getAllDefects() {
      api
        .getAllDefects()
        .then(response => {
          this.defects = response.data;
          this.loadedDefects = true;
          this.isDoneLoading();
        })
        .catch(error => {
          console.error(error);
        });
    },
    refresh() {
      this.$router.go(0);
    },
    isDoneLoading() {
      if (this.loadedDefects == true && this.loadedTasks == true) {
        this.tasks = this.tasks.filter(task => {
          return (
            task.status.toLowerCase() != "complete" &&
            task.status.toLowerCase() != "canceled"
          );
        });
        this.defects = this.defects.filter(defect => {
          return (
            defect.status.toLowerCase() != "complete" &&
            defect.status.toLowerCase() != "canceled"
          );
        });
        this.loading = false;
      }
    },
    initData() {
      this.getAllTasks();
      this.getAllDefects();
    }
  },
  mounted() {
    this.initData();
  }
};
</script>

<style lang="scss" scoped>
.addPadding {
  padding: 0 12px;
}
@media only screen and (max-width: 960px) {
  .overviewtable {
    width: 100%;
  }
}
</style>
