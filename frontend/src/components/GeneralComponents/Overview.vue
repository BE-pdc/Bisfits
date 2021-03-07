<template>
  <div class="overview">
    <div class="overview-header overline">
      <h2 v-if="dest !== 'archive'">Current reports</h2>
      <h2 v-else>Archive</h2>
      <div class="overview-header-icons" v-if="dest === 'archive'">
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-icon color="#fff" dark v-on="on">mdi-download</v-icon>
          </template>
          <span>Download as Excel</span>
        </v-tooltip>
      </div>
      <div class="overview-header-icons" v-else>
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-icon class="btn-filter" @click="getAllDefects" color="#fff" dark v-on="on">refresh</v-icon>
          </template>
          <span>Refresh data</span>
        </v-tooltip>
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-icon @click="toggleFilters" color="#fff" dark v-on="on">mdi-filter</v-icon>
          </template>
          <span>Filter</span>
        </v-tooltip>
      </div>
    </div>
    <div>
      <v-tabs color="#e60005" v-model="tab" slider-color="primary">
        <v-tabs-slider color="#e60005" />
        <v-tab v-for="item in tabItems" :key="item.tab">{{ item.tab }}</v-tab>
      </v-tabs>
      <v-tabs-items v-model="tab">
        <v-tab-item v-for="item in tabItems" :key="item.tab">
          <defect-table
            :user="user"
            v-if="item.tab === 'All Defects'"
            :defects="defects"
            :shFilters="showFilters"
            @submitEventTriggered="initData"
            @AssignedEventTriggered="initData"
          />
          <defect-assigned-table
            @dataEditedTriggered="initData"
            :user="user"
            :assigneddefects="assigneddefects"
            :shFilters="showFilters"
            v-else-if="item.tab === 'Assigned Defects'"
          />
          <defect-unassigned-table
            @dataEditedTriggered="initData"
            :user="user"
            :unassigneddefects="unassigneddefects"
            :shFilters="showFilters"
            v-else-if="item.tab === 'Unassigned Defects'"
          />
          <task-table
            @dataEditedTriggered="initData"
            :user="user"
            v-else-if="item.tab === 'Tasks'"
            :tasks="tasks"
            :shFilters="showFilters"
          />
        </v-tab-item>
      </v-tabs-items>
    </div>
    <add-notification-button @submitEventTriggered="initData" :user="user" />
  </div>
</template>
<script>
import AddNotificationButton from "../GeneralComponents/AddNotificationButton.vue";
import DefectTable from "../DataTables/DefectTable.vue";
import TaskTable from "../DataTables/TaskTable.vue";
import api from "../backend-api.js";
import DefectAssignedTable from "../AssigningToUser/DefectAssignedTable.vue";
import DefectUnassignedTable from "../AssigningToUser/DefectUnassignedTable.vue";

export default {
  components: {
    AddNotificationButton,
    DefectTable,
    TaskTable,
    DefectAssignedTable,
    DefectUnassignedTable
  },
  props: ["dest", "archivedDefects", "archivedTasks", "user"],
  data() {
    return {
      tab: null,
      tabItems: [
        {
          tab: "All Defects"
        },

        {
          tab: "Assigned Defects"
        },
        {
          tab: "Unassigned Defects"
        },
        {
          tab: "Tasks"
        }
      ],
      showFilters: false,
      sortableTable: false,
      defects: [],
      tasks: [],
      showDialog: false,
      assigneddefects: [],
      unassigneddefects: []
    };
  },
  methods: {
    toggleFilters() {
      this.showFilters = !this.showFilters;
    },
    getAllDefects() {
      this.defects = [];
      api
        .getAllDefects()
        .then(response => {
          this.defects = response.data;
        }).then(() => {
          this.defects = this.defects.filter(defect => {
            return (
              defect.status.toLowerCase() != "complete" &&
              defect.status.toLowerCase() != "canceled"
            );
          });
        })
        .catch(error => {
          this.errors.push(error);
        });
    },
    getAllTasks() {
      this.tasks = [];
      api.getAllTasks().then(response => {
        this.tasks = response.data;
      }).then(()=>{
        this.tasks = this.tasks.filter(task => {
          return (
            task.status.toLowerCase() != "complete" &&
            task.status.toLowerCase() != "canceled"
          );
        });
      });
      
    },
    getAllAssignedDefects() {
      api.getDefectsNotOpen().then(response => {
        this.assigneddefects = response.data;
      })
    },
    getAllUnassignedDefects() {
      api.getDefectsByStatus("PROCESS_BY_AP").then((response) => {
        this.unassigneddefects = response.data;
      });
    },
    initData() {
      this.getAllDefects();
      this.getAllTasks();
      this.getAllAssignedDefects();
      this.getAllUnassignedDefects();
    }
  },
  mounted() {
    this.initData();
  }
};
</script>

<style>
.overview {
  background-color: rgba(255, 255, 255, 0.85);
  border-radius: 20px;
  width: 100%;
  margin: 0 auto;
}

.overview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  background-color: rgba(226, 6, 19, 0.85);
  color: #fff;
  padding: 5px 15px;
}

.overview-header-icons * {
  cursor: pointer;
  margin-right: 15px;
}

.overview-filter {
  background-color: red;
  margin: 10px;
  padding: 10px;
}

h2 {
  border-radius: 5px;
  color: #fff;
  padding: 10px 15px;
  font-size: 17px;
}

.defects,
.tasks {
  padding: 20px;
}

.defectTable,
.taskTable {
  padding: 15px;
}

.defectTable td,
.taskTable td {
  padding: 5px 0;
}

.defectTable th,
.taskTable th {
  padding: 0;
  color: #adadad;
}

.defectTable td p,
.taskTable td p {
  margin: 0;
}

tbody tr:nth-of-type(odd) {
  background-color: rgba(255, 0, 0, 0.05);
}

@media only screen and (max-width: 960px) {
  .defectTable td,
  .taskTable td {
    font-size: 70%;
  }

  .v-data-table__wrapper {
    overflow-x: hidden;
  }
}

@media only screen and (max-width: 600px) {
  .v-data-table__wrapper {
    overflow-x: hidden;
  }
}

@media only screen and (max-width: 405px) {
}
</style>
