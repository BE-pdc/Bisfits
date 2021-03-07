<template>
  <div>
    <defect-detail :user="this.user" />
  </div>
</template>

<script>
import DefectDetail from "@/components/DefectDetails/DefectDetail.vue";
export default {
  name: "DefectDetailPage",
  props: ["user"],
  components: { DefectDetail }
};
</script>

<style lang="scss" scoped></style>
