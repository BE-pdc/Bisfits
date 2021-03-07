<template>
  <div class="overview">
    <div class="overview-header overline">
      <h2>General Overview</h2>
      <div class="overview-header-icons">
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-icon class="btn-filter" @click="toggleFilters" color="#fff" dark v-on="on">mdi-filter</v-icon>
          </template>
          <span>Filter</span>
        </v-tooltip>
      </div>
    </div>
    <div>
      <v-tabs grow color="#e60005" v-model="tab" slider-color="primary">
        <v-tabs-slider color="#e60005" />
        <v-tab v-for="item in tabItems" :key="item.tab">{{ item.tab }}</v-tab>
      </v-tabs>
      <v-tabs-items v-model="tab">
        <v-tab-item v-for="item in tabItems" :key="item.tab">
          <home-defect-table
            v-if="item.tab === 'All Defects'"
            :defects="defects"
            :shFilters="showFilters"
          />

          <home-task-table
            v-else-if="item.tab === 'All Tasks'"
            :tasks="tasks"
            :shFilters="showFilters"
          />
        </v-tab-item>
      </v-tabs-items>
    </div>
  </div>
</template>
<script>
import HomeDefectTable from "../DataTables/HomeDefectTable.vue";
import HomeTaskTable from "../DataTables/HomeTaskTable.vue";

export default {
  components: {
    HomeDefectTable,
    HomeTaskTable
  },
  props: ["defects", "tasks"],
  data() {
    return {
      tab: null,
      tabItems: [
        {
          tab: "All Defects"
        },

        {
          tab: "All Tasks"
        }
      ],
      showFilters: false,
      sortableTable: false,
      showDialog: false
    };
  },
  methods: {
    toggleFilters() {
      this.showFilters = !this.showFilters;
    }
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
}

.defects,
.tasks {
  padding: 16px;
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
