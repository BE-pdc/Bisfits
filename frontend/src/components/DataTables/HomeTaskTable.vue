<template>
  <div class="tasks">
    <v-data-table
      class="taskTable"
      :headers="headersTask"
      :items="this.tasks"
      item-key="id"
      mobile-breakpoint="750"
      @click:row="loadDetails"
      :items-per-page="itemsPerPage"
      hide-default-footer
      :page.sync="page"
      @page-count="pageCount = $event"
    >
      <template v-slot:top>
        <transition name="slide-fade">
          <div class="filters" v-if="shFilters">
            <v-layout justify-space-around align-center class="task-filters" row wrap>
              <v-flex xs10 sm4 md2>
                <v-select
                  clearable
                  :items="categories"
                  v-model="taskCategoryFilterVal"
                  label="Category"
                  item-text="name"
                  color="red"
                ></v-select>
              </v-flex>
              <v-flex xs10 sm4 md2>
                <v-select
                  clearable
                  :items="campuses"
                  v-model="taskCampusFilterVal"
                  label="Campus"
                  item-text="campusName"
                  :return-object="true"
                  @change="getCampusRooms(taskCampusFilterVal)"
                  color="red"
                ></v-select>
              </v-flex>
              <v-flex xs10 sm4 md2>
                <v-select
                  clearable
                  :items="classrooms"
                  v-model="taskClassroomFilterVal"
                  label="Classroom"
                  item-text="roomNumber"
                  color="red"
                ></v-select>
              </v-flex>
              <v-flex xs10 sm4 md2>
                <v-select clearable :items="statuses" v-model="taskStatusFilterVal" label="Status"></v-select>
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
        <v-flex class="searchPadding">
          <v-text-field
            id="searchTask"
            v-model="taskNameFilterVal"
            append-icon="mdi-magnify"
            label="Search"
            type="text"
            color="red"
          ></v-text-field>
        </v-flex>
      </template>
    </v-data-table>
    <v-pagination v-if="this.tasks!=''" v-model="page" :length="pageCount" color="rgb(230,40,52)"></v-pagination>
  </div>
</template>

<script>
import api from "../backend-api.js";

export default {
  name: "HomeTaskTable",
  props: ["tasks", "shFilters"],
  data() {
    return {
      taskNameFilterVal: null,
      taskCategoryFilterVal: null,
      taskCampusFilterVal: null,
      taskClassroomFilterVal: null,
      taskStatusFilterVal: null,
      selectedcampus: null,
      page: 1,
      pageCount: 0,
      itemsPerPage: 6,
      categories: [],
      campuses: [],
      classrooms: [],
      headersTask: [
        {
          text: "Task",
          value: "name",
          sortable: false,
          filter: this.nameFilter,
          align: "center"
        },
        {
          text: "Category",
          value: "category.name",
          align: "center",
          sortable: false,
          filter: this.categoryFilter
        },
        {
          text: "Campus",
          value: "campuslocation",
          align: "center",
          sortable: false,
          filter: this.campusFilter
        },
        {
          text: "Classroom",
          value: "locationroom",
          align: "center",
          sortable: false,
          filter: this.classroomFilter
        },
        {
          text: "Status",
          value: "status",
          align: "center",
          sortable: false,
          filter: this.statusFilter
        }
      ]
    };
  },
  computed: {
    statuses() {
      return this.tasks.map(d => d.status);
    }
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
    api
      .getCategoryList()
      .then(response => {
        response.data.forEach(element => {
          element.categoryList.forEach(category => {
            this.categories.push(category);
          });
        });
      })
      .catch(error => {
        this.errors.push(error);
      });
    //TODO api call to add statusses in filters
  },

  methods: {
    nameFilter(value) {
      if (!this.taskNameFilterVal) {
        return true;
      }
      return value.toLowerCase().includes(this.taskNameFilterVal.toLowerCase());
    },

    categoryFilter(value) {
      if (!this.taskCategoryFilterVal) {
        return true;
      }
      return value === this.taskCategoryFilterVal;
    },

    campusFilter(value) {
      if (!this.selectedcampus) {
        return true;
      }
      return value === this.selectedcampus;
    },

    classroomFilter(value) {
      if (!this.taskClassroomFilterVal) {
        return true;
      }
      return value === this.taskClassroomFilterVal;
    },
    statusFilter(value) {
      if (!this.taskStatusFilterVal) {
        return true;
      }
      return value === this.taskStatusFilterVal;
    },
    getCampusRooms() {
      if (this.taskCampusFilterVal != null) {
        this.selectedcampus = this.taskCampusFilterVal.campusName;
        this.classrooms = this.taskCampusFilterVal.roomlist;
      } else {
        this.selectedcampus = null;
        this.classrooms = [];
        this.taskClassroomFilterVal = null;
      }
    },
    loadDetails(task) {
      this.$router.push({ path: `/task/${task.id}` });
    }
  }
};
</script>

<style>
.tasks {
  min-height: 278px;
}

.taskTable {
  margin: 0 15px;
}

.searchPadding {
  padding-bottom: 17px;
}

.btn-reset-wrapper {
  text-align: center;
}

.slide-fade-enter-active {
  transition: all 0.5s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-leave-active {
  transition: all 0.5s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter,
.slide-fade-leave-to {
  transform: translateY(-30px);
  opacity: 0;
}
</style>