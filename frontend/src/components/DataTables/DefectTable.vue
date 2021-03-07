<template>
  <div class="defects">
    <v-data-table
      class="defectTable"
      :headers="headers"
      :items="this.defects"
      item-key="id"
      mobile-breakpoint="750"
      @click:row="loadDetails"
    >
      <template v-slot:top>
        <transition name="slide-fade">
          <div class="filters" v-if="shFilters">
            <v-layout justify-space-around align-center class="defect-filters" row wrap>
              <v-flex id="flex-filter-category" xs10 sm4 md2>
                <v-select
                  clearable
                  :items="categories"
                  v-model="defCategoryFilterVal"
                  label="Category"
                  item-text="name"
                  color="red"
                ></v-select>
              </v-flex>
              <v-flex id="flex-filter-campus" xs10 sm4 md2>
                <v-select
                  clearable
                  :items="campuses"
                  v-model="defCampusFilterVal"
                  label="Campus"
                  item-text="campusName"
                  :return-object="true"
                  @change="getCampusRooms(defCampusFilterVal)"
                  color="red"
                ></v-select>
              </v-flex>
              <v-flex id="flex-filter-classroom" xs10 sm4 md2>
                <v-select
                  clearable
                  :items="classrooms"
                  v-model="defClassroomFilterVal"
                  label="Classroom"
                  item-text="roomNumber"
                  color="red"
                ></v-select>
              </v-flex>
              <v-flex id="flex-filter-priority" xs10 sm4 md2>
                <v-select
                  clearable
                  :items="priorities"
                  v-model="defPrioritiesFilterVal"
                  label="Priority"
                  item-text="txt"
                  item-value="val"
                  color="red"
                ></v-select>
              </v-flex>
              <v-flex id="flex-filter-status" xs10 sm4 md2>
                <v-select
                  clearable
                  :items="statuses"
                  v-model="defStatusFilterVal"
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
          v-model="defNameFilterVal"
          append-icon="mdi-magnify"
          label="Search"
          type="text"
          color="red"
        ></v-text-field>
      </template>

      <template v-slot:item.upvotes="{ item }">
        <v-layout justify-center>
          <p>{{item.upvotes}}</p>
        </v-layout>
      </template>

      <!-- <template v-slot:item.name="{ item }">
        <v-layout justify-center>
          <p>{{item.name}}</p>
        </v-layout>
      </template> -->

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

      <template v-slot:item.actions="{ item }">
        <defect-updater
          v-if="user.id == item.metaData.creatorid || user.role == 'Admin'"
          @submitEventTriggered="submitEventTriggered"
          :itemid="item.id"
          :user="user"
          column
          lg6
          md6
          sm6
          xs6
        />
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
import api from "../backend-api.js";
import DefectUpdater from "../DialogCreators/DefectUpdater.vue";

export default {
  name: "DefectTable",
  props: ["defects", "shFilters", "user"],
  components: {
    DefectUpdater,
  },
  data() {
    return {
      defNameFilterVal: null,
      defCategoryFilterVal: null,
      defCampusFilterVal: null,
      defClassroomFilterVal: null,
      defPrioritiesFilterVal: null,
      defStatusFilterVal: null,
      selectedcampus: null,
      categories: [],
      campuses: [],
      classrooms: [],
      defectsItems: this.defects,
      dialog: false,
      headersDefect: [
        {
          text: "Defect",
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
        },
        {
          text: "Upvotes",
          value: "upvotes",
          sortable: false,
          align: "center"
        },
        {
          text: "Priority",
          value: "priority",
          sortable: true,
          align: "center",
          filter: this.priorityFilter
        }
      ],
      headersAdminFacCoorDefects: [
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
        this.user.role == "Facility Coordinator"
      ) {
        return [...this.headersDefect, ...this.headersAdminFacCoorDefects];
      }
      return this.headersDefect;
    },
    statuses() {
      return this.defects.map(d => d.status);
    },
    priorities() {
      return this.defects.map((d) => {
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
    nameFilter(value) {
      if (!this.defNameFilterVal) {
        return true;
      }
      return value.toLowerCase().includes(this.defNameFilterVal.toLowerCase());
    },
    submitEventTriggered() {
      this.$emit("submitEventTriggered");
    },
    categoryFilter(value) {
      if (!this.defCategoryFilterVal) {
        return true;
      }
      return value === this.defCategoryFilterVal;
    },

    campusFilter(value) {
      if (!this.selectedcampus) {
        return true;
      }
      return value === this.selectedcampus;
    },

    classroomFilter(value) {
      if (!this.defClassroomFilterVal) {
        return true;
      }
      return value === this.defClassroomFilterVal;
    },

    priorityFilter(value) {
      if (!this.defPrioritiesFilterVal) {
        return true;
      }
      return value === this.defPrioritiesFilterVal;
    },

    statusFilter(value) {
      if (!this.defStatusFilterVal) {
        return true;
      }
      return value === this.defStatusFilterVal;
    },
    getCampusRooms() {
      if (this.defCampusFilterVal != null) {
        this.selectedcampus = this.defCampusFilterVal.campusName;
        this.classrooms = this.defCampusFilterVal.roomlist;
      } else {
        this.selectedcampus = null;
        this.classrooms = [];
        this.defClassroomFilterVal = null;
      }
    },
    deleteItem(item) {
      api.deleteDefectById(item.id).then(response => {
        if (response.status == 204) {
          this.submitEventTriggered();
          this.dialog = false;
        }
      });
    },
    resetFilters() {
      this.defCategoryFilterVal = null;
      this.defCampusFilterVal = null;
      this.defClassroomFilterVal = null;
      this.defStatusFilterVal = null;
      this.defPrioritiesFilterVal = null;
      this.selectedcampus = null;
      this.classrooms = [];
    },
    loadDetails(defect) {
      this.$router.push({ path: `/defect/${defect.id}` });
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
  }
};
</script>

<style>
.defectTable {
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

.firstColPadd {
  padding-left: 15px;
}

@media only screen and (max-width: 750px) {
  .defects {
    font-size: 20px;
    padding-bottom: 80px !important;
  }
}
</style>
