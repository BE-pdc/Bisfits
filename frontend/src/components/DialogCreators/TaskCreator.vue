<template>
  <div>
    <v-dialog v-model="dialog" width="500">
      <template v-slot:activator="{ on }">
        <v-btn id="task-button" dark large color="#E60005" @click="dialog = false" v-on="on">Task</v-btn>
      </template>
      <v-card>
        <v-card-title class="headline grey lighten-2" primary-title>
          Add new task
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
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="red" text @click="validate()">Submit</v-btn>
          </v-card-actions>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import api from "../backend-api.js";

export default {
  name: "TaskCreator",
  props: ["user"],
  data() {
    return {
      task_name: "",
      task_description: "",
      errors: [],
      dialog: false,
      selectedcampus: [],
      selectedroom: "",
      campusLocations: [],
      campusrooms: [],
      nearby: false,
      categories: [],
      selectedCategory: [],
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
  methods: {
    saveTaskAPI() {
      this.callTaskAPI();
      this.dialog = false;
    },
    callTaskAPI() {
      api
        .saveNewTask(
          this.task_name,
          this.task_description,
          this.selectedcampus.campusName,
          this.selectedroom,
          this.nearby,
          this.selectedCategory,
          this.user.id
        )
        .then(response => {
          if (response.status == 201) {
            this.$emit("submitEventTriggered");
          }
        })
        .finally(() => {
          this.$refs.form.resetValidation();
          this.$refs.form.reset();
        });
    },
    getCampusRooms() {
      this.selectedroom = "";
      this.nearby = false;
      this.campusrooms = this.selectedcampus.roomlist;
    },
    validate() {
      if (
        this.$refs.form.validate() &&
        typeof this.selectedCategory.name !== "undefined"
      ) {
        this.saveTaskAPI();
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
#createDialog {
  max-width: 100%;
}

#task-button {
  padding: 0px;
}

.nearby-checkbox {
  margin: 0px;
}

@media only screen and (max-width: 960px) {
  #createDialog {
    width: 100%;
  }
}

@media only screen and (max-width: 600px) {
  #createDialog {
    width: 100%;
  }
}

@media only screen and (max-width: 405px) {
  #createDialog {
    width: 100%;
  }
}
</style>
