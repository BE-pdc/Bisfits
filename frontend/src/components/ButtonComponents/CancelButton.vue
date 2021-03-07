<!-- This button has 2 props, type and id. pass the type (defect or task) as a lowercase string and the id of the task or defect you want to cancel
example: <cancel-button v-bind:type="'defect'" v-bind:id="defect.id" /> -->

<template>
  <v-container>
    <v-dialog v-model="dialog" max-width="290">
      <template v-slot:activator="{ on }">
        <v-btn v-on="on" color="white" small tile class="customButton" style="padding-right: 6px">
          <v-icon left>cancel_presentation</v-icon>Cancel
        </v-btn>
      </template>
      <v-card>
        <v-card-title class="headline">Are you sure you want to cancel this {{this.type}}?</v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red" text @click="dialog = false">No</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="red" text @click="cancel">Yes</v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import api from "../backend-api.js";

export default {
  name: "CancelButton",
  data() {
    return {
      dialog: false
    };
  },
  props: ["type", "id"],
  methods: {
    cancel() {
      if (this.type === "task") {
        api
          .updateStatusOfTask("CANCELED", this.id)
          .then((this.dialog = false))
          .then(this.updateDetailsPageShowButtons())
          .then(response => {
            if (response.status == 201) {
              this.$emit("statusChanged");
            }
          });
      } else if (this.type === "defect") {
        api
          .updateStatusOfDefect("CANCELED", this.id)
          .then((this.dialog = false))
          .then(this.updateDetailsPageShowButtons())
          .then(response => {
            if (response.status == 201) {
              this.$emit("statusChanged");
            }
          });
      }
    },
    updateDetailsPageShowButtons() {
      this.$emit("hideEditButtons");
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
</style>