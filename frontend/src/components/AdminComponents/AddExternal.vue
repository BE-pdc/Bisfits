<template>
  <div>
    <v-dialog v-model="dialog" width="310">
      <template v-slot:activator="{ on }">
        <v-btn
          id="addExternalButton"
          v-on="on"
          class="mx-2"
          fab
          dark
          large
          color="#E60005"
          elevation="24"
          fixed
          right
          bottom
        >
          <v-icon dark>mdi-plus</v-icon>
        </v-btn>
      </template>
      <v-card id="addexternalCard">
        <v-card-title class="headline">Create an external</v-card-title>
        <v-form ref="form" class="form" v-model="valid" lazy-validation>
          <v-text-field
            label="Contact first name"
            v-model="firstname"
            counter="25"
            :rules="rulestextfield"
            color="red"
          ></v-text-field>
          <v-text-field
            label="Contact last name"
            v-model="lastname"
            counter="25"
            :rules="rulestextfield"
            color="red"
          ></v-text-field>
          <v-text-field
            label="Company name"
            v-model="companyname"
            counter="30"
            :rules="rulestextfield"
            color="red"
          ></v-text-field>
          <v-text-field label="Email" v-model="email" counter="50" color="red"></v-text-field>
        </v-form>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-spacer></v-spacer>
          <v-btn color="red" text @click="validate()">Submit</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import api from "../backend-api.js";
export default {
  data() {
    return {
      dialog: false,
      firstname: "",
      lastname: "",
      companyname: "",
      email: "",
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
  methods: {
    submitEventTriggered() {
      this.$emit("submitEventTriggered");
    },
    validate() {
      if (this.$refs.form.validate()) {
        this.saveNewExternal();
        this.$refs.form.resetValidation();
        this.$refs.form.reset();
      }
    },
    saveNewExternal() {
      api
        .saveNewExternal(
          this.firstname,
          this.lastname,
          this.email,
          this.companyname
        )
        .then(response => {
          if (response.status == 201) {
            this.submitEventTriggered();
          }
        })
        .finally(() => {
          this.dialog = false;
        });
    }
  },
  components: {}
};
</script>

<style lang="scss" scoped>
.form {
  margin-left: 5%;
  padding-left: 5%;
  margin-right: 5%;
  padding-right: 5%;
}

#createDialog {
  max-width: 100%;
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
