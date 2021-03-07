<!-- The code duplication in the child components is needed because otherwise we make multiple unneccesary function calls because we loop through tabs -->
<template>
  <v-container>
    <v-flex class="overview-header overline">
      <h2>Personal overview</h2>
    </v-flex>
    <v-flex>
      <v-tabs :show-arrows="true" v-model="tab" color="#e60005" slider-color="primary">
        <v-tabs-slider color="#e60005" />
        <v-tab v-for="item in items" :key="item">{{ item }}</v-tab>
      </v-tabs>
      <v-tabs-items v-model="tab">
        <v-tab-item v-for="item in items" :key="item">
          <defect-cards
            v-if="item === 'Subscribed Defects'"
            :defects="subscribedDefects"
            :emptyMessage="subscribedDefectsEmptyMessage"
          />
          <defect-cards
            v-if="item === 'My Defects'"
            :defects="myDefects"
            :emptyMessage="myDefectsEmptyMessage"
          />
          <task-cards
            v-if="item === 'My Tasks'"
            :tasks="myTasks"
            :emptyMessage="myTasksEmptyMessage"
          />
          <defect-cards
            v-if="item === 'My Assigned Defects'"
            :defects="myAssignedDefects"
            :emptyMessage="myAssignedDefectsEmptyMessage"
          />
          <task-cards
            v-if="item === 'My Assigned Tasks'"
            :tasks="myAssignedTasks"
            :emptyMessage="myAssignedTasksEmptyMessage"
          />
        </v-tab-item>
      </v-tabs-items>
    </v-flex>
  </v-container>
</template>

<script>
import DefectCards from "./DefectCards.vue";
import TaskCards from "./TaskCards.vue";

export default {
  name: "PersonalOverview",
  components: {
    DefectCards,
    TaskCards
  },
  props: ["defects", "tasks", "user"],
  data: () => ({
    myDefects: [],
    myDefectsEmptyMessage: "You have not created any defects",
    subscribedDefects: [],
    subscribedDefectsEmptyMessage: "You are not following any defects",
    myTasks: [],
    myTasksEmptyMessage: "You have not created any tasks",
    myAssignedDefects: [],
    myAssignedDefectsEmptyMessage: "You have not been assigned any defects",
    myAssignedTasks: [],
    myAssignedTasksEmptyMessage: "You have not been assigned any tasks",
    tab: null,
    loading: true,
    items: [
      /*"Subscribed Defects",
      "My Defects",
      "My Tasks",
      "My Assigned Defects",
      "My Assigned Tasks"*/
    ]
  }),
  methods: {
    loadTabs() {
      if (this.user.role.toLowerCase() != "external") {
        this.items.push("Subscribed Defects");
        this.items.push("My Defects");
      }

      switch (this.user.role.toLowerCase()) {
        case "facility coordinator":
          this.items.push("My Tasks");
          this.items.push("My Assigned Defects");
          break;
        case "facility employee":
          this.items.push("My Tasks");
          this.items.push("My Assigned Defects");
          break;
        case "logistic coordinator":
          this.items.push("My Tasks");
          this.items.push("My Assigned Tasks");
          break;
        case "logistic employee":
          this.items.push("My Tasks");
          this.items.push("My Assigned Tasks");
          break;
        case "admin":
          this.items.push("My Tasks");
          break;
      }
    },
    initData() {
      this.loadTabs();
      this.defects.forEach(defect => {
        if (this.user.upvoted.includes(defect.id)) {
          this.subscribedDefects.push(defect);
        }
        if (defect.metaData.creatorid === this.user.id) {
          this.myDefects.push(defect);
        }
        if (this.user.assignedDefects.includes(defect.id)) {
          this.myAssignedDefects.push(defect);
        }
      });
      this.tasks.forEach(task => {
        if (task.metaData.creatorid === this.user.id) {
          this.myTasks.push(task);
        }
        if (this.user.assignedTasks.includes(task.id)) {
          this.myAssignedTasks.push(task);
        }
      });
    }
  },
  mounted: function() {
    this.initData();
  }
};
</script>

<style>
.container {
  padding: 0;
}

.card-container {
  min-height: 278px;
}
</style>
