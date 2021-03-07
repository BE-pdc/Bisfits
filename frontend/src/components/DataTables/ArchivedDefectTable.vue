<template>
  <v-data-table
    :search="search"
    :headers="headers"
    :items="archDefects"
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
                v-model="archDefectCampusFilterVal"
                label="Campus"
                item-text="campusName"
                :return-object="true"
                @change="getCampusRooms(archDefectCampusFilterVal)"
                color="red"
              ></v-select>
            </v-flex>
            <v-flex xs10 sm4 md2>
              <v-select
                clearable
                :items="classrooms"
                v-model="archDefectClassroomFilterVal"
                label="Classroom"
                item-text="roomNumber"
                color="red"
              ></v-select>
            </v-flex>
            <v-flex xs10 sm4 md2>
              <v-select
                clearable
                :items="priorities"
                v-model="archDefectPrioritiesFilterVal"
                label="Priority"
                item-text="txt"
                item-value="val"
                color="red"
              ></v-select>
            </v-flex>
            <v-flex xs10 sm4 md2>
              <v-select
                clearable
                :items="statuses"
                v-model="archDefectStatusFilterVal"
                label="Status"
                color="red"
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
        id="searchDefect"
        v-model="archDefectNameFilterVal"
        append-icon="mdi-magnify"
        label="Search"
        type="text"
        color="red"
      ></v-text-field>
    </template>
    <template v-slot:item.priority="{ item }">
      <div id="priorityIcons">
        <div v-if="item.priority == 1">
          <v-icon medium class="mr-2" style="color: rgb(66,200,31)">mdi-circle</v-icon>
        </div>
        <div v-else-if="item.priority == 2">
          <v-icon medium class="mr-2" style="color: rgb(255,135,10)">mdi-circle</v-icon>
        </div>
        <div v-else-if="item.priority == 3">
          <v-icon medium class="mr-2" style="color: rgb(254,18,26)">mdi-circle</v-icon>
        </div>
      </div>
    </template>
  </v-data-table>
</template>

<script>
import api from "../backend-api.js";
export default {
  props: ["shFilters", "archDefects"],
  data() {
    return {
      archDefectNameFilterVal: null,
      archDefectCategoryFilterVal: null,
      archDefectCampusFilterVal: null,
      archDefectClassroomFilterVal: null,
      archDefectPrioritiesFilterVal: null,
      archDefectStatusFilterVal: null,
      selectedcampus: null,
      categories: [],
      campuses: [],
      classrooms: [],
      search: "",
      headers: [
        {
          text: "Defect",
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
        { text: "Priority", value: "priority", filter: this.priorityFilter, align: "center" },
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
      return this.archDefects.map(d => d.status);
    },
    priorities() {
      return this.archDefects.map((d) => {
        switch (d.priority) {
          case 1:
            return { txt: "LOW", val: 1 };
          case 2:
            return { txt: "MEDIUM", val: 2 };
          case 3:
            return { txt: "HIGH", val: 3 };
        }
      });
    },
  },
  methods: {
    loadDetails(defect) {
      this.$router.push({ path: `/defect/${defect.id}` });
    },
    nameFilter(value) {
      if (!this.archDefectNameFilterVal) {
        return true;
      }
      return value
        .toLowerCase()
        .includes(this.archDefectNameFilterVal.toLowerCase());
    },
    campusFilter(value) {
      if (!this.selectedcampus) {
        return true;
      }
      return value === this.selectedcampus;
    },

    classroomFilter(value) {
      if (!this.archDefectClassroomFilterVal) {
        return true;
      }
      return value === this.archDefectClassroomFilterVal;
    },

    priorityFilter(value) {
      if (!this.archDefectPrioritiesFilterVal) {
        return true;
      }
      return value === this.archDefectPrioritiesFilterVal;
    },

    statusFilter(value) {
      if (!this.archDefectStatusFilterVal) {
        return true;
      }
      return value === this.archDefectStatusFilterVal;
    },
    getCampusRooms() {
      if (this.archDefectCampusFilterVal != null) {
        this.selectedcampus = this.archDefectCampusFilterVal.campusName;
        this.classrooms = this.archDefectCampusFilterVal.roomlist;
      } else {
        this.selectedcampus = null;
        this.classrooms = [];
        this.archDefectClassroomFilterVal = null;
      }
    },

    resetFilters() {
      this.archDefectCategoryFilterVal = null;
      this.archDefectCampusFilterVal = null;
      this.archDefectClassroomFilterVal = null;
      this.archDefectStatusFilterVal = null;
      this.archDefectPrioritiesFilterVal = null;
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
