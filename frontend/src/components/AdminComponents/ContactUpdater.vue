<template>
  <v-dialog v-model="dialog" class="contactUpdater" width="500">
    <template v-slot:activator="{ on }">
      <v-icon medium v-on="on" class="mr-2" @click="populateDepartmentList()">mdi-pencil</v-icon>
    </template>
    <v-card>
      <v-card-title class="headline grey lighten-2" primary-title>
        Update contact
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
        <v-btn color="red" text v-on:click="updateContactInDepartment()">Submit</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import api from "../backend-api.js";

export default {
  name: "contactUpdater",
  props: ["departmentid", "contactid"],
  data() {
    return {
      errors: [],
      departmentcontacts: [],
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
    updateContactInDepartment() {
      if (this.$refs.form.validate()) {
        api
          .updateContactInDepartment(
            this.contact_name,
            this.contact_function,
            this.contact_telephonenumber,
            this.contact_mobilenumber,
            this.contact_email,
            this.departmentid,
            this.contactid
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
    },
    populateDepartmentList() {
      api.getDepartmentById(this.departmentid).then(response => {
        this.departmentcontacts = response.data.contactlist;
        this.findContactById();
      });
    },
    findContactById() {
      for (var i = 0; i < this.departmentcontacts.length; i++) {
        if (this.departmentcontacts[i].id == this.contactid) {
          this.contact_name = this.departmentcontacts[i].name;
          this.contact_function = this.departmentcontacts[i].contactfunction;
          this.contact_telephonenumber = this.departmentcontacts[
            i
          ].telephonenumber;
          this.contact_mobilenumber = this.departmentcontacts[i].mobilenumber;
          this.contact_email = this.departmentcontacts[i].emailadress;
          break;
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.contactUpdater {
  width: 30%;
}

@media only screen and (max-width: 960px) {
  .contactUpdater {
    width: 75%;
  }
}

@media only screen and (max-width: 600px) {
  .contactUpdater {
    width: 100%;
  }
}

@media only screen and (max-width: 405px) {
  .contactUpdater {
    width: 100%;
  }
}
</style>
