<template>
  <v-dialog v-model="dialog" width="500">
    <template v-slot:activator="{ on }">
      <v-btn
        v-on="on"
        color="white"
        @click="getTaskById()"
        small
        tile
        class="customButton"
        style="padding-right: 6px;"
      >
        <v-icon left>mdi-pencil</v-icon>Edit
      </v-btn>
    </template>
    <v-card>
      <v-card-title class="headline grey lighten-2" primary-title>
        Update task
        <v-spacer></v-spacer>

        <v-btn icon medium class="closedialogbutton" color="black" @click="dialog = false">
          <v-icon>close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-text-field
            color="red"
            label="Name"
            v-model="task_name"
            counter="25"
            :rules="rulestextfield"
          ></v-text-field>
          <v-textarea
            name="input-7-1"
            label="Description"
            v-model="task_description"
            :rules="rulesgeneralfields"
            color="red"
          ></v-textarea>
          <v-select
            :items="campusLocations"
            v-model="selectedcampus"
            label="Select Campus"
            item-text="campusName"
            single-line
            :return-object="true"
            @change="getCampusRooms(selectedcampus)"
            color="red"
          ></v-select>
          <v-select
            :items="campusrooms"
            v-model="selectedroom"
            item-text="roomNumber"
            label="Select Room"
            single-line
            :return-object="false"
            no-data-text="Please select a campus first!"
            :rules="rulesgeneralfields"
            color="red"
          ></v-select>
          <v-checkbox
            class="nearby-checkbox"
            v-if="selectedroom"
            v-model="nearby"
            label="Near this location (please specify in description)"
            color="red"
          ></v-checkbox>
          <v-autocomplete
            color="red"
            :items="categories"
            v-model="selectedCategory"
            label="Select Category"
            item-text="name"
            single-line
            :return-object="true"
            :rules="rulesgeneralfields"
          ></v-autocomplete>
        </v-form>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="red" text @click="validate()">Submit</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import api from "../backend-api.js";

export default {
  name: "TaskUpdater",

  data() {
    return {
      task_name: "",
      task_description: "",
      selectedcampus: [],
      errors: [],
      dialog: false,
      selectedroom: "",
      campusLocations: [],
      campusrooms: [],
      nearby: false,
      categories: [],
      selectedCategory: [],
      task: null,
      campusstring: "",
      campusStringUrlReplaced: "",
      rulesgeneralfields: [v => !!v || "Item is required"],
      rulestextfield: [
        v => (v && v.length <= 25) || "Max 25 characters",
        v => !!v || "Item is required",
        v =>
          !v ||
          /^[A-Za-z0-9 ]*$/g.test(v) ||
          "Please do not use special characters!"
      ],
      valid: true
    };
  },
  components: {},
  props: ["itemid", "user"],
  methods: {
    saveTask() {
      this.updateTask();
      this.dialog = false;
    },
    getCampusRooms() {
      this.selectedroom = "";
      this.nearby = false;
      this.campusrooms = this.selectedcampus.roomlist;
    },
    getTaskById() {
      api
        .getTask(this.itemid)
        .then(response => {
          this.task_name = response.data.name;
          this.task_description = response.data.description;
          this.selectedCategory = response.data.category;
          this.selectedroom = response.data.locationroom;
          this.selectedcampus = response.data.campuslocation;
          this.nearby = response.data.nearby;
          this.campusStringUrlReplaced = this.selectedcampus.replace(
            /\s/g,
            "%20"
          );
          api
            .getLocationByCampusname(this.campusStringUrlReplaced)
            .then(response => {
              this.selectedcampus = response.data;
              this.campusrooms = response.data.roomlist;
            })
            .catch(error => {
              this.errors.push(error);
            });
        })
        .catch(error => {
          this.errors.push(error);
        });
    },
    callUpdateApi() {
      this.updateTask();
      this.dialog = false;
    },
    updateTask() {
      api
        .updateTask(
          this.task_name,
          this.task_description,
          this.selectedcampus.campusName,
          this.selectedroom,
          this.nearby,
          this.selectedCategory,
          this.itemid,
          this.user.id
        )
        .then(response => {
          if (response.status == 201) {
            this.refreshData();
          }
        });
      this.dialog = false;
    },
    refreshData() {
      this.$emit("submitEventTriggered");
    },
    validate() {
      if (
        this.$refs.form.validate() &&
        typeof this.selectedCategory.name !== "undefined"
      ) {
        this.saveTask();
      }
    }
  },

  mounted: function() {
    api
      .getCampusLocations()
      .then(response => {
        this.campusLocations = response.data;
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

<style lang="scss" scoped>
.customButton {
  width: 100px;
  height: 0;
  margin: 0;
  padding: 0;
}

.createDialog {
  width: 30%;
}

.nearby-checkbox {
  margin: 0px;
}

@media only screen and (max-width: 960px) {
  .createDialog {
    width: 100%;
  }
}

@media only screen and (max-width: 600px) {
  .createDialog {
    width: 100%;
  }
}

@media only screen and (max-width: 405px) {
  .createDialog {
    width: 100%;
  }
}
</style>
