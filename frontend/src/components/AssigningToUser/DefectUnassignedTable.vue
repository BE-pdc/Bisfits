<template>
  <v-data-table
    :headers="headers"
    :items="unassigneddefects"
    :items-per-page="5"
    class="defectTable"
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
                item-text="name"
                item-value="prioritynumber"
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
        @submitEventTriggered="refreshData"
        :user="user"
        :itemid="item.id"
        column
        lg6
        md6
        sm6
        xs6
      />
      <assign-defect
        @AssignedEventTriggered="refreshData"
        :itemid="item.id"
        column
        lg6
        md6
        sm6
        xs6
      />

      <v-btn
        v-on="on"
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
</template>

<script>
import api from "../backend-api";
import DefectUpdater from "../DialogCreators/DefectUpdater.vue";
import AssignDefect from "../AssigningToUser/AssignDefect.vue";

export default {
  components: {
    DefectUpdater,
    AssignDefect
  },
  props: ["unassigneddefects", "user", "shFilters"],
  data() {
    return {
      defNameFilterVal: null,
      defCategoryFilterVal: null,
      defCampusFilterVal: null,
      defClassroomFilterVal: null,
      defPrioritiesFilterVal: null,
      defStatusFilterVal: null,
      categories: [],
      campuses: [],
      classrooms: [],
      dialog: false,
      headersUnassignedDefect: [
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
        return [
          ...this.headersUnassignedDefect,
          ...this.headersAdminFacCoorDefects
        ];
      }
      return this.headersUnassignedDefect;
    },
    statuses() {
      return this.unassigneddefects.map(d => d.status);
    },
    priorities() {
      return this.unassigneddefects.map((d) => {
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
        this.categories = response.data;
      })
      .catch(error => {
        this.errors.push(error);
      });
  },

  methods: {
    refreshData() {
      this.$emit("dataEditedTriggered");
    },
    deleteItem(item) {
      api.deleteDefectById(item.id).then(response => {
        if (response.status == 204) {
          this.refreshData();
          this.dialog = false;
        }
      });
    },
    loadDetails(defect) {
      this.$router.push({ path: `/defect/${defect.id}` });
    },
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
    }
  }
};
</script>

<style scoped>
.customButton {
  width: 100px;
  height: 0;
  margin: 0;
  padding: 0;
}

.defectTable {
  margin: 0 15px;
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
