<template>
  <v-dialog v-model="dialog" width="500">
    <v-card>
      <v-card-title class="headline grey lighten-2" primary-title>
        Assign task to a user
        <v-spacer></v-spacer>
        <v-btn icon medium class="closedialogbutton" color="black" @click="dialog = false">
          <v-icon>close</v-icon>
        </v-btn>
      </v-card-title>

      <div class="filter">
        <v-layout justify-space-around align-center wrap>
          <v-text-field
            mobile-breakpoint="750"
            append-icon="mdi-magnify"
            label="Search"
            single-line
            hide-details
            color="red"
          ></v-text-field>
        </v-layout>
        <br />
      </div>

      <v-card-text>
        <v-form ref="form" lazy-validation>
          <v-select
            :items="users"
            v-model="selectedUser"
            label="Select User"
            :item-text="(item) => item.firstname + ' ' + item.lastname"
            single-line
            :return-object="true"
            color="red"
          ></v-select>
        </v-form>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" text @click="validate()">Submit</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import api from "../backend-api.js";

export default {
  name: "AssignTask",

  data() {
    return {
      dialog: true,
      users: [],
      selectedUser: []
    };
  },
  components: {},
  props: ["itemid"],
  methods: {
    assignTask() {
      api.assignTask(this.selectedUser.id, this.itemid);
      this.dialog = false;
    },
    validate() {
      if (typeof this.selectedUser.id !== "undefined") {
        this.assignTask();
        this.$emit("apAssignClosed");
      }
    }
  },

  mounted: function() {
    api
      .getUsers()
      .then(response => {
        this.users = response.data;
      })
      .catch(error => {
        this.errors.push(error);
      });
  }
};
</script>

<style lang="scss" scoped>
.createDialog {
  width: 30%;
}

.filter {
  margin-left: 5%;
  margin-right: 5%;
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
