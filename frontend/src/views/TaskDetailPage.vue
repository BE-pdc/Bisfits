<template>
  <div>
    <task-detail :user="this.user" />
  </div>
</template>

<script>
import TaskDetail from "@/components/TaskDetails/TaskDetail.vue";
export default {
  name: "TaskDetailPage",
  props: ["user"],
  components: { TaskDetail }
};
</script>

<style lang="scss" scoped></style>
