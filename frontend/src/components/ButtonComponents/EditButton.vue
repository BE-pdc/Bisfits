<template>
  <v-container>
    <defect-updater
      v-if="this.type === 'defect'"
      @submitEventTriggered="submitEventTriggered"
      :itemid="this.id"
      :user="this.user"
      column
      lg6
      md6
      sm6
      xs6
      class="noPadding"
    ></defect-updater>
    <task-updater
      v-if="this.type === 'task'"
      @submitEventTriggered="submitEventTriggered"
      :itemid="this.id"
      :user="this.user"
      column
      lg6
      md6
      sm6
      xs6
      class="noPadding"
    ></task-updater>
  </v-container>
</template>

<script>
import DefectUpdater from "../DialogCreators/DefectUpdater.vue";
import TaskUpdater from "../DialogCreators/TaskUpdater.vue";

export default {
  name: "EditButton",
  data() {
    return {
      dialog: false,
    };
  },
  props: ["type", "id", "user"],
  components: {
    DefectUpdater,
    TaskUpdater,
  },
  methods: {
    submitEventTriggered() {
      this.$emit("submitEventTriggered");
    },
  },
};
</script>

<style scoped>
.noPadding {
  padding: 0;
  margin: 0;
}
</style>
