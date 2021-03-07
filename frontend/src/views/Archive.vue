<template class="archive">
  <div
    class="overview"
    v-if="
      this.user.role == 'Admin' ||
        this.user.role == 'Logistic Coordinator' ||
        this.user.role == 'Facility Coordinator' ||
        this.user.role == 'Logistic Employee' ||
        this.user.role == 'Facility Employee'
    "
  >
    <div class="archive-header overline">
      <h2>Archive</h2>
      <div class="archive-header-icons">
        <v-tooltip bottom v-if="tab == 0">
          <template v-slot:activator="{ on }">
            <download-excel
              :data="archDefects"
              :fields="expDefectFields"
              name="archived_defects"
              worksheet="Archived Defects"
            >
              <v-icon color="#fff" dark v-on="on">mdi-download</v-icon>
            </download-excel>
          </template>
          <span>Convert to Excel</span>
        </v-tooltip>
        <v-tooltip bottom v-else>
          <template v-slot:activator="{ on }">
            <download-excel
              :data="archTasks"
              :fields="expTaskFields"
              name="archived_tasks"
              worksheet="Archived Tasks"
            >
              <v-icon color="#fff" dark v-on="on">mdi-download</v-icon>
            </download-excel>
          </template>
          <span>Convert to Excel</span>
        </v-tooltip>

        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-icon class="btn-filter" @click="toggleFilters" color="#fff" dark v-on="on">mdi-filter</v-icon>
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
          <archived-task-table
            v-if="item.tab === 'Tasks'"
            :shFilters="showFilters"
            :archTasks="archTasks"
          />
          <ArchivedDefectTable
            v-else-if="item.tab === 'Defects'"
            :shFilters="showFilters"
            :archDefects="archDefects"
          />
        </v-tab-item>
      </v-tabs-items>
    </div>
  </div>
  <div v-else>
    <v-container class="text-center" fill-height style="height: calc(100vh - 58px);">
      <v-row align="center">
        <v-col>
          <h1 class="display-2">Whoops,</h1>
          <p class="text404">You are not allowed access to this page</p>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import api from "./../components/backend-api";
import ArchivedTaskTable from "../components/DataTables/AchivedTaskTable.vue";
import ArchivedDefectTable from "../components/DataTables/ArchivedDefectTable";

export default {
  name: "Archive",
  components: {
    ArchivedTaskTable,
    ArchivedDefectTable
  },
  props: ["user"],
  methods: {
    toggleFilters() {
      this.showFilters = !this.showFilters;
    },
    getDefectsArchived() {
      api.getDefectsArchived().then(response => {
        this.archDefects = response.data;
      });
    },
    getArchivedTasks() {
      api.getTasksArchived().then(response => {
        this.archTasks = response.data;
      });
    }
  },
  data() {
    return {
      tab: null,
      archDefects: [],
      archTasks: [],
      expDefectFields: {
        id: "id",
        name: "name",
        description: "description",
        category: {
          field: "category",
          callback: value => {
            return value.name;
          }
        },
        upvotes: "upvotes",
        fixer_id: "fixerid",
        campus: "campuslocation",
        classroom: "locationroom",
        priority: {
          field: "priority",
          callback: value => {
            switch (value) {
              case 1:
                return "LOW";
              case 2:
                return "MEDIUM";
              case 3:
                return "HIGH";
            }
          }
        },
        status: "status",
        status_changed_on: "statusChanged",
        photo_id: "photoid",
        nearby: "nearby",
        creator_id: {
          field: "metaData",
          callback: value => {
            return value.creatorid;
          }
        },
        created_on: {
          field: "metaData",
          callback: value => {
            return value.date;
          }
        }
      },
      expTaskFields: {
        id: "id",
        name: "name",
        description: "description",
        category: {
          field: "category",
          callback: value => {
            return value.name;
          }
        },
        fixer_id: "fixerid",
        campus: "campuslocation",
        classroom: "locationroom",
        status: "status",
        status_changed_on: "statusChanged",
        nearby: "nearby",
        creator_id: {
          field: "metaData",
          callback: value => {
            return value.creatorid;
          }
        },
        created_on: {
          field: "metaData",
          callback: value => {
            return value.date;
          }
        }
      },
      showFilters: false,
      tabItems: [
        {
          tab: "Defects"
        },
        {
          tab: "Tasks"
        }
      ]
    };
  },
  mounted() {
    this.getDefectsArchived();
    this.getArchivedTasks();

    if (this.user.role == "Facility Employee") {
      this.tabItems = [
        {
          tab: "Defects"
        }
      ];
    } else {
      this.tabItems = [
        {
          tab: "Defects"
        },
        {
          tab: "Tasks"
        }
      ];
    }
  }
};
</script>

<style lang="scss" scoped>
.overview {
  background-color: rgba(255, 255, 255, 0.85);
  border-radius: 20px;
  width: 70% !important;
}

.archive-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  background-color: rgba(226, 6, 19, 0.85);
  color: #fff;
  padding: 5px 15px;
}

.archive-header-icons {
  display: flex;
}

.archive-header-icons * {
  cursor: pointer;
  margin: 5px;
}

h2 {
  border-radius: 5px;
  color: #fff;
  padding: 10px 15px;
  font-size: 17px;
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

.card404 {
  max-width: 10vw;
}
.text404 {
  font-weight: bold;
}
</style>
