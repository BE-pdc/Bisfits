<template>
  <div class="tasks">
    <v-data-table
      class="taskTable"
      :headers="headers"
      :items="tasks"
      item-key="id"
      mobile-breakpoint="750"
      @click:row="loadDetails"
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
                <v-select
                  clearable
                  :items="statuses"
                  v-model="taskStatusFilterVal"
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
          id="searchTask"
          v-model="taskNameFilterVal"
          append-icon="mdi-magnify"
          label="Search"
          type="text"
          color="red"
        ></v-text-field>
      </template>
      <template v-slot:item.actions="{ item }">
        <task-updater
          v-if="user.id == item.metaData.creatorid || user.role == 'Admin'"
          @dataEditedTriggered="refreshData"
          :itemid="item.id"
          column
          lg6
          md6
          sm6
          xs6
        />
        <AssignTask @AssignedEventTriggered="refreshData" :itemid="item.id" column lg6 md6 sm6 xs6 />
        <v-btn
          color="white"
          @click.stop="dialog = true"
          class="customButton"
          small
          tile
          v-if="user.id == item.metaData.creatorid || user.role == 'Admin'"
        >
          <v-icon left>mdi-delete</v-icon>Delete
        </v-btn>
        <!--Confirmation Dialog-->
        <v-dialog v-model="dialog" max-width="500px">
          <v-card>
            <v-card-title>
              <span class="headline">WARNING</span>
            </v-card-title>
            <v-card-text>Are you sure you want to cancel this item?</v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="red darken-1" text @click="dialog = false">No</v-btn>
              <v-btn color="red darken-1" text @click="deleteItem(item)">Yes</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <!--End of confirmation dialog-->
      </template>
    </v-data-table>
  </div>
</template>

<script>
import AssignTask from "../AssigningToUser/AssignTask.vue";
import TaskUpdater from "../DialogCreators/TaskUpdater.vue";
import api from "../backend-api";

export default {
  name: "TaskTable",
  props: ["tasks", "shFilters", "user"],
  components: {
    AssignTask,
    TaskUpdater
  },
  data() {
    return {
      taskNameFilterVal: null,
      taskCategoryFilterVal: null,
      taskCampusFilterVal: null,
      taskClassroomFilterVal: null,
      taskStatusFilterVal: null,
      selectedcampus: null,
      categories: [],
      campuses: [],
      classrooms: [],
      dialog: false,
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
          sortable: false,
          filter: this.categoryFilter,
          align: "center"
        },
        {
          text: "Campus",
          value: "campuslocation",
          sortable: false,
          filter: this.campusFilter,
          align: "center"
        },
        {
          text: "Classroom",
          value: "locationroom",
          sortable: false,
          filter: this.classroomFilter,
          align: "center"
        },
        {
          text: "Status",
          value: "status",
          sortable: false,
          width: "150px",
          filter: this.statusFilter,
          align: "center"
        },
        { text: "User", value: "fixerid", align: "center", sortable: false }
      ],
      headersAdminLogCoorTasks: [
        {
          text: "Actions",
          value: "actions",
          sortable: false,
          align: "center"
        }
      ]
    };
  },
  computed: {
    headers() {
      if (
        this.user.role == "Admin" ||
        this.user.role == "Logistic Coordinator"
      ) {
        return [...this.headersTask, ...this.headersAdminLogCoorTasks];
      }
      return this.headersTask;
    },
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
  },
  methods: {
    nameFilter(value) {
      if (!this.taskNameFilterVal) {
        return true;
      }
      return value.toLowerCase().includes(this.taskNameFilterVal.toLowerCase());
    },
    submitEventTriggered() {
      this.$emit("submitEventTriggered");
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

    resetFilters() {
      this.taskCategoryFilterVal = null;
      this.taskCampusFilterVal = null;
      this.taskClassroomFilterVal = null;
      this.taskStatusFilterVal = null;
    },
    loadDetails(task) {
      this.$router.push({ path: `/task/${task.id}` });
    },
    deleteItem(item) {
      api.deleteTaskById(item.id).then(response => {
        if (response.status == 204) {
          this.refreshData();
          this.dialog = false;
        }
      });
    },
    refreshData() {
      this.$emit("dataEditedTriggered");
    }
  }
};
</script>

<style>
.taskTable {
  margin: 0 15px;
}

.customButton {
  width: 100px;
  height: 0;
  margin: 0;
  padding: 0;
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

@media only screen and (max-width: 750px) {
  .tasks {
    font-size: 20px;
    padding-bottom: 80px !important;
  }
}
</style>
