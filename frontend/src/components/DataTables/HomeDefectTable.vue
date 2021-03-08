<template>
  <div class="defects">
    <v-data-table
      class="defectTable"
      :headers="headersDefect"
      :items="this.defects"
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
            <v-layout
              justify-space-around
              align-center
              class="defect-filters"
              row
              wrap
            >
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
                  color="red"
                  item-text="txt"
                  item-value="val"
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
                  >RESET FILTERS</v-btn
                >
              </v-hover>
            </div>
          </div>
        </transition>

        <v-flex class="searchPadding">
          <v-text-field
            id="searchDefect"
            v-model="defNameFilterVal"
            append-icon="mdi-magnify"
            label="Search"
            type="text"
            color="red"
          ></v-text-field>
        </v-flex>
      </template>

      <template v-slot:item.priority="{ item }">
        <div id="priorityIcons">
          <div v-if="item.priority == 1">
            <v-icon medium class="mr-2" style="color: rgb(66,200,31)"
              >mdi-circle</v-icon
            >
          </div>
          <div v-else-if="item.priority == 2">
            <v-icon medium class="mr-2" style="color: rgb(255,135,10)"
              >mdi-circle</v-icon
            >
          </div>
          <div v-else-if="item.priority == 3">
            <v-icon medium class="mr-2" style="color: rgb(254,18,26)"
              >mdi-circle</v-icon
            >
          </div>
        </div>
      </template>
    </v-data-table>
    <v-pagination
      v-if="this.defects != ''"
      v-model="page"
      :length="pageCount"
      color="rgb(230,40,52)"
    ></v-pagination>
  </div>
</template>

<script>
import api from "../backend-api.js";

export default {
  name: "DefectTable",
  props: ["defects", "shFilters"],
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
      // priorities: [],
      page: 1,
      pageCount: 0,
      itemsPerPage: 6,
      headersDefect: [
        {
          text: "Defect",
          value: "name",
          sortable: false,
          filter: this.nameFilter,
          align: "center",
        },
        {
          text: "Category",
          value: "category.name",
          align: "center",
          sortable: false,
          filter: this.categoryFilter,
        },
        {
          text: "Campus",
          value: "campuslocation",
          align: "center",
          sortable: false,
          filter: this.campusFilter,
        },
        {
          text: "Classroom",
          value: "locationroom",
          align: "center",
          sortable: false,
          filter: this.classroomFilter,
        },
        {
          text: "Status",
          value: "status",
          align: "center",
          sortable: false,
          filter: this.statusFilter,
        },
        {
          text: "Priority",
          value: "priority",
          sortable: true,
          align: "center",
          filter: this.priorityFilter,
        },
      ],
    };
  },
  computed: {
    statuses() {
      return this.defects.map((d) => d.status);
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
    },
  },
  mounted: function() {
    api
      .getCampusLocations()
      .then((response) => {
        this.campuses = response.data;
      })
      .catch((error) => {
        this.errors.push(error);
      });
    api
      .getCategoryList()
      .then((response) => {
        response.data.forEach((element) => {
          element.categoryList.forEach((category) => {
            this.categories.push(category);
          });
        });
      })
      .catch((error) => {
        this.errors.push(error);
      });
    //TODO api call to add statusses in filters
  },
};
</script>

<style>
.defects {
  min-height: 278px;
}

.defectTable {
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

@media only screen and (max-width: 750px) {
  .defects {
    font-size: 20px;
  }
}
</style>
