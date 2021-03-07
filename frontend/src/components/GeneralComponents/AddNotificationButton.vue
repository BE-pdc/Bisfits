<template>
  <div>
    <div id="defect-task-button" v-if="textname">
      <v-speed-dial
        v-model="fab"
        fixed
        right
        bottom
        direction="top"
        transition="slide-y-reverse-transition"
      >
        <template v-slot:activator>
          <v-btn
            v-model="fab"
            color="#E60005"
            elevation="24"
            dark
            fab
            large
          >
            <v-icon v-if="fab">mdi-close</v-icon>
            <v-icon v-else>mdi-plus</v-icon>
          </v-btn>
        </template>
          <defect-creator v-bind:textname="this.textname" :dialog="true" @submitEventTriggered="submitEventTriggered" :user="this.user" />
          <task-creator @submitEventTriggered="submitEventTriggered" :user="this.user" />
      </v-speed-dial>
    </div>
    <div id="defect-button" v-else>
      <defect-creator v-bind:textname="this.textname" :dialog="true" @submitEventTriggered="submitEventTriggered" :user="this.user" />
    </div>
  </div>
</template>

<script>
import DefectCreator from "../DialogCreators/DefectCreator.vue";
import TaskCreator from "../DialogCreators/TaskCreator.vue";

export default {
  props: ["on", "user"],
  components: {DefectCreator, TaskCreator},
  data() {
    return {
      fab: false,
      dialog: false,
      textname: false
    }
  },
  methods: {
    submitEventTriggered() {
      this.$emit("submitEventTriggered");
      this.fab = false;
    }
  },
  created() {
    if(this.user.role.toLowerCase() == "admin" || this.user.role.toLowerCase() == "facility coordinator" || this.user.role.toLowerCase() == "logistic coordinator" || this.user.role.toLowerCase() == "department head") {
      this.textname = true;
    }
    else {
      this.textname = false;
    }
  }
}
</script>

<style>

</style>