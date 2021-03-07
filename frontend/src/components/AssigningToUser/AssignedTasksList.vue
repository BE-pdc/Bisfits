<template>
  <div id="random">
    <v-card id="defectscard">
      <v-row no-gutters class="categoryrow">
        <v-data-table
          :search="search"
          :headers="headers"
          :items="tasks"
          :items-per-page="5"
          class="dtassign"
        >
        </v-data-table>
      </v-row>
    </v-card>
  </div>
</template>

<script>
import api from "../backend-api.js";
export default {
  props: ["user"],
  data() {
    return {
      tasks: [],
      search: "",
      headers: [
        {
          text: "Tasks",
          align: "start",
          sortable: true,
          value: "name"
        },
        { text: "Campus Name", value: "campuslocation" },
        { text: "Room", value: "locationroom" },
        { text: "Status", value: "status" }
      ]
    };
  },

  mounted: function() {
    this.getAssignedTasks();
  },

  methods: {
    getAssignedTasks() {
      this.tasks = api.getAssignedTasks(this.user.id);
    }
  }
};
</script>

<style scoped>
.random {
  margin-top: 5%;
}
.cards {
  width: 80vw;
}

.profilecard {
  height: auto;
  margin-bottom: 30px;
  min-width: 100%;
}

.cardtitle {
  background-color: rgba(226, 6, 19, 0.85);
  color: white;
}

.categoryrow {
  padding-left: 10%;
  padding-right: 10%;
  grid-auto-columns: auto;
}

.dtassign {
  width: 100%;
}

#defectscard {
  height: auto;
  margin-bottom: 30px;
}

.filter {
  width: 93%;
  margin-left: 4%;
}
</style>
