<template>
  <v-dialog v-model="dialog" class="categoryDialog" width="500">
    <template v-slot:activator="{ on }">
      <v-btn v-on="on" small dark tile color="#e62b36">
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-card-title class="headline grey lighten-2" primary-title>
        Add new room
        <v-spacer></v-spacer>
        <v-btn icon medium class="closedialogbutton" color="black" @click="dialog = false">
          <v-icon>close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-text-field
          color="red"
          label="Room Number"
          v-model="roomnumber"
          ref="room"
          :rules="roomRules"
        ></v-text-field>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="red" text @click="addNewRoom()">Submit</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import api from "../backend-api.js";

export default {
  name: "CategoryCreator",
  props: ["campusid"],
  data() {
    return {
      errors: [],
      dialog: false,
      roomnumber: "",
      campuscode: "",
      roomRules: [v => !!v || "Room number can't be empty"]
    };
  },
  methods: {
    addNewRoom() {
      if (this.$refs.room.validate()) {
        api.addNewRoom(this.roomnumber, this.campusid).then(response => {
          if (response.status == 201) {
            this.emitToParent();
          }
        });
        this.dialog = false;
        this.$refs.room.reset();
      }
    },
    emitToParent() {
      this.$emit("submitIsPressedRoom");
    }
  }
};
</script>

<style lang="scss" scoped>
.categoryDialog {
  width: 30%;
}

@media only screen and (max-width: 960px) {
  .categoryDialog {
    width: 75%;
  }
}

@media only screen and (max-width: 600px) {
  .categoryDialog {
    width: 100%;
  }
}

@media only screen and (max-width: 405px) {
  .categoryDialog {
    width: 100%;
  }
}
</style>
