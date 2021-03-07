<template>
  <div>
    <v-dialog v-model="dialog" width="500">
      <template v-slot:activator="{ on }">
        <v-btn
          id="defect-button-text"
          v-if="textname"
          dark
          large
          color="#E60005"
          @click="dialog = false"
          v-on="on"
        >Defect</v-btn>
        <v-btn
          id="defect-button-circle"
          v-else
          dark
          large
          fab
          color="#E60005"
          elevation="24"
          fixed
          right
          bottom
          @click="dialog = false"
          v-on="on"
        >
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </template>
      <v-card>
        <v-card-title class="headline grey lighten-2" primary-title>
          Add new defect
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
              v-model="defect_name"
              counter="25"
              :rules="rulestextfield"
            ></v-text-field>
            <v-textarea
              color="red"
              name="input-7-1"
              label="Description"
              v-model="defect_description"
              :rules="rulesgeneralfields"
            ></v-textarea>
            <v-select
              color="red"
              :items="campusLocations"
              v-model="selectedcampus"
              label="Select Campus"
              item-text="campusName"
              single-line
              :return-object="true"
              @change="getCampusRooms(selectedcampus)"
              :rules="rulesgeneralfields"
            ></v-select>
            <v-select
              color="red"
              :items="campusrooms"
              v-model="selectedroom"
              item-text="roomNumber"
              label="Select Room"
              single-line
              :return-object="false"
              no-data-text="Please select a campus first!"
              :rules="rulesgeneralfields"
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
          <photo-creator v-on:change-photo="changePhoto" />
          <v-spacer></v-spacer>
          <v-btn color="red" text @click="validate()">Submit</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import api from "../backend-api.js";
import PhotoCreator from "../Photo/PhotoCreator.vue";

export default {
  name: "DefectCreator",
  props: ["user", "textname"],
  data() {
    return {
      emitdata: false,
      defect_name: "",
      defect_description: "",
      errors: [],
      dialog: false,
      selectedcampus: null,
      selectedroom: "",
      campusLocations: [],
      campusrooms: [],
      nearby: false,
      categories: [],
      selectedCategory: null,
      photo: null,
      photoid: "",
      rulesgeneralfields: [v => !!v || "Item is required"],
      rulesselectboxes: [!!this.selectedCategory || "Item is required"],
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
  components: {
    PhotoCreator
  },
  methods: {
    saveNewDefectAPI() {
      if (this.photo != null) {
        api
          .postPhoto(this.photo)
          .then(response => {
            this.photoid = response.data;
            this.callDefectApi();
          })
          .catch(error => {
            this.errors.push(error);
          });
      } else {
        this.callDefectApi();
      }
      this.dialog = false;
    },
    callDefectApi() {
      api
        .saveNewDefect(
          this.defect_name,
          this.defect_description,
          this.selectedcampus.campusName,
          this.selectedroom,
          this.nearby,
          this.selectedCategory,
          this.photoid,
          this.user.id
        )
        .then(response => {
          api.upvoteDefect(response.data, true);
          api.addUpvoteToUser(this.user.id, response.data);
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
    changePhoto(newPhoto) {
      this.photo = newPhoto;
    },
    validate() {
      if (
        this.$refs.form.validate() &&
        typeof this.selectedCategory.name !== "undefined"
      ) {
        this.saveNewDefectAPI();
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

#defect-button-text {
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
