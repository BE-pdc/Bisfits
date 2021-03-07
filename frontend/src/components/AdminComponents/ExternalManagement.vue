<template>
  <div>
    <div class="filter">
      <v-layout justify-space-around align-center wrap>
        <v-text-field
          color="red"
          v-model="search"
          mobile-breakpoint="750"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
        ></v-text-field>
      </v-layout>
    </div>

    <v-data-table
      :items="externals"
      :headers="headers"
      :search="search"
      mobile-breakpoint="750"
      sort-by="lastname"
      item-key="id"
      class="elevation-1"
    >
      <template v-slot:item.actions="{ item }">
        <v-icon medium @click.stop="deleteItem(item.id)" column lg6 md6 sm6 xs6>mdi-delete</v-icon>
      </template>
    </v-data-table>
  </div>
</template>
<script>
import api from "../backend-api.js";
export default {
  props: ["externals"],
  data: () => {
    return {
      headers: [
        {
          text: "Email",
          align: "start",
          value: "email"
        },
        { text: "Firstname", value: "firstname" },
        { text: "Lastname", value: "lastname" },
        { text: "Companyname", value: "companyname" },
        { text: "", value: "actions" }
      ],
      search: "",
      dialogexternalemailpopup: false
    };
  },
  mounted: function() {},
  methods: {
    deleteItem(id) {
      api.deleteExternalById(id);
      api.getExternals().then(response => {
        this.externals = response.data;
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.filter {
  width: 93%;
  margin-left: 4%;
}
</style>
