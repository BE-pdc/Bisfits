<template>
  <div id="random">
    <v-data-table
      :search="search"
      :headers="headers"
      :items="archTasks"
      :items-per-page="5"
      @click:row="loadDetails"
      class="dtassign"
    >
      <template v-slot:top>
        <transition name="slide-fade">
          <div class="filters" v-if="shFilters">
            <v-layout justify-space-around align-center class="defect-filters" row wrap>
              <v-flex xs10 sm4 md2>
                <v-select
                  clearable
                  :items="campuses"
                  v-model="archTaskCampusFilterVal"
                  label="Campus"
                  item-text="campusName"
                  :return-object="true"
                  @change="getCampusRooms(archTaskCampusFilterVal)"
                  color="red"
                ></v-select>
              </v-flex>
              <v-flex xs10 sm4 md2>
                <v-select
                  clearable
                  :items="classrooms"
                  v-model="archTaskClassroomFilterVal"
                  label="Classroom"
                  item-text="roomNumber"
                  color="red"
                ></v-select>
              </v-flex>
              <v-flex xs10 sm4 md2>
                <v-select
                  clearable
                  :items="statuses"
                  v-model="archTaskStatusFilterVal"
                  color="red"
                  label="Status"
                ></v-select>
              </v-flex>
            </v-layout>
            <div class="btn-reset-wrapper">
              <v-hover v-slot:default="{ hover }">
                <v-btn
                  color="#E60005"
                  :elevation="hover ? 2 : 24"
                  class="btn-reset white--text"
                  @click="resetFilters"
                >RESET FILTERS</v-btn>
              </v-hover>
            </div>
          </div>
        </transition>

        <v-text-field
          id="searchTask"
          v-model="archTaskNameFilterVal"
          append-icon="mdi-magnify"
          label="Search"
          type="text"
          color="red"
        ></v-text-field>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import api from "../backend-api.js";
export default {
  props: ["shFilters", "archTasks"],
  data() {
    return {
      archTaskNameFilterVal: null,
      archTaskCampusFilterVal: null,
      archTaskClassroomFilterVal: null,
      archTaskStatusFilterVal: null,
      selectedcampus: null,
      campuses: [],
      classrooms: [],
      search: "",
      headers: [
        {
          text: "Tasks",
          align: "center",
          sortable: true,
          value: "name",
          filter: this.nameFilter
        },
        {
          text: "Campus Name",
          value: "campuslocation",
          filter: this.campusFilter,
          align: "center"
        },
        { text: "Room", value: "locationroom", filter: this.classroomFilter, align: "center" },
        { text: "Status", value: "status", filter: this.statusFilter, align: "center" }
      ]
    };
  },

  mounted: function() {
    api
      .getCampusLocations()
      .then(response => {
        this.campuses = response.data;
      })
      .catch(error => {
        this.errors.push(error);
      });
  },
  computed: {
    statuses() {
      return this.archTasks.map(d => d.status);
    }
  },
  methods: {
    loadDetails(task) {
      this.$router.push({ path: `/task/${task.id}` });
    },
    nameFilter(value) {
      if (!this.taskNameFilterVal) {
        return true;
      }
      return value.toLowerCase().includes(this.taskNameFilterVal.toLowerCase());
    },
    campusFilter(value) {
      if (!this.selectedcampus) {
        return true;
      }
      return value === this.selectedcampus;
    },

    classroomFilter(value) {
      if (!this.archTaskClassroomFilterVal) {
        return true;
      }
      return value === this.archTaskClassroomFilterVal;
    },

    statusFilter(value) {
      if (!this.archTaskStatusFilterVal) {
        return true;
      }
      return value === this.archTaskStatusFilterVal;
    },
    getCampusRooms() {
      if (this.archTaskCampusFilterVal != null) {
        this.selectedcampus = this.archTaskCampusFilterVal.campusName;
        this.classrooms = this.archTaskCampusFilterVal.roomlist;
      } else {
        this.selectedcampus = null;
        this.classrooms = [];
        this.archTaskClassroomFilterVal = null;
      }
    },

    resetFilters() {
      this.archTaskCategoryFilterVal = null;
      this.archTaskCampusFilterVal = null;
      this.archTaskClassroomFilterVal = null;
      this.archTaskStatusFilterVal = null;
      this.archTaskPrioritiesFilterVal = null;
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
  padding: 20px 40px;
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
