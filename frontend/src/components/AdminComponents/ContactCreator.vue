<template>
  <v-dialog v-model="dialog" class="contactCreator" width="500">
    <template v-slot:activator="{ on }">
      <v-btn v-on="on" small dark tile color="#e62b36">
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-card-title class="headline grey lighten-2" primary-title>
        Add new contact
        <v-spacer></v-spacer>
        <v-btn icon medium class="closedialogbutton" color="black" @click="dialog = false">
          <v-icon>close</v-icon>
        </v-btn>
      </v-card-title>
      <v-form ref="form">
        <v-card-text>
          <v-text-field
            color="red"
            label="Name"
            v-model="contact_name"
            :rules="contactGeneralRules"
          ></v-text-field>
          <v-text-field
            color="red"
            label="Function"
            v-model="contact_function"
            :rules="contactGeneralRules"
          ></v-text-field>
          <v-text-field
            color="red"
            label="Telephone number"
            placeholder="Leave empty if none"
            v-model="contact_telephonenumber"
          ></v-text-field>
          <v-text-field
            color="red"
            label="Mobile number"
            placeholder="Leave empty if none"
            v-model="contact_mobilenumber"
          ></v-text-field>
          <v-text-field
            color="red"
            label="E-mail"
            :rules="emailRules"
            placeholder="Leave empty if none"
            v-model="contact_email"
          ></v-text-field>
        </v-card-text>
      </v-form>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="red" text v-on:click="addContactToDepartment()">Submit</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import api from "../backend-api.js";

export default {
  name: "ContactCreator",
  props: ["departmentid"],
  data() {
    return {
      errors: [],
      dialog: false,
      contact_name: "",
      contact_function: "",
      contact_telephonenumber: "",
      contact_mobilenumber: "",
      contact_email: "",
      emailRules: [
        v =>
          /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
          "E-mail must be valid"
      ],
      contactGeneralRules: [v => !!v || "Item can't be empty"]
    };
  },
  methods: {
    addContactToDepartment() {
      if (this.$refs.form.validate()) {
        api
          .addContactToDepartment(
            this.contact_name,
            this.contact_function,
            this.contact_telephonenumber,
            this.contact_mobilenumber,
            this.contact_email,
            this.departmentid
          )
          .then(response => {
            if (response.status == 201) {
              this.emitToParent();
            }
          });
      }
    },
    emitToParent() {
      this.$emit("submitIsPressedContact");
    }
  }
};
</script>

<style lang="scss" scoped>
.contactCreator {
  width: 30%;
}

@media only screen and (max-width: 960px) {
  .contactCreator {
    width: 75%;
  }
}

@media only screen and (max-width: 600px) {
  .contactCreator {
    width: 100%;
  }
}

@media only screen and (max-width: 405px) {
  .contactCreator {
    width: 100%;
  }
}
</style>
