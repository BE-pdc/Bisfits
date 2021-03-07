<template>
  <v-container v-if="tasks.length == 0" class="card-container" fill-height justify-center>
    <p class="display-1 text-center">{{ this.emptyMessage }}</p>
  </v-container>
  <v-container class="card-container" fill-height v-else>
    <v-layout row wrap class="mx-auto">
      <v-flex
        lg4
        md6q
        sm6
        xs12
        v-for="task in displayedTasks"
        :key="task.id"
        v-on:click="loadDetails(task.id)"
      >
        <v-card outlined tile>
          <v-list-item three-line>
            <v-list-item-content>
              <v-list-item-title class="headline">
                {{
                task.name
                }}
              </v-list-item-title>
              <v-list-item-subtitle class="text--primary">
                {{ task.campuslocation }}
                {{ task.locationroom }}
              </v-list-item-subtitle>
              <v-list-item-subtitle>Status: {{ task.status }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-card>
      </v-flex>
    </v-layout>

    <v-layout row justify-center>
      <v-flex class="pagination">
        <v-pagination
          v-model="page"
          v-if="this.tasks.length >= this.itemsPerPage"
          :length="pageCount"
          color="rgb(230,40,52)"
        ></v-pagination>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  name: "TaskCards",
  props: ["tasks", "emptyMessage"],
  data() {
    return {
      page: 1,
      itemsPerPage: 9
    };
  },
  computed: {
    pageCount() {
      this.resizeItems();
      this.checkPageExists();
      return Math.ceil(this.tasks.length / this.itemsPerPage);
    },
    displayedTasks() {
      return this.tasks.slice(
        this.itemsPerPage * (this.page - 1),
        this.itemsPerPage * this.page
      );
    }
  },
  methods: {
    resizeItems() {
      switch (this.$vuetify.breakpoint.name) {
        case "xs":
          this.itemsPerPage = 5;
          break;
        case "sm":
          this.itemsPerPage = 10;
          break;
        case "md":
          this.itemsPerPage = 10;
          break;
        case "lg":
          this.itemsPerPage = 15;
          break;
        case "xl":
          this.itemsPerPage = 15;
          break;
      }
    },
    checkPageExists() {
      //this method is needed for fixing a bug when resizing small to large screens in some cases
      if (this.page > Math.ceil(this.tasks.length / this.itemsPerPage)) {
        this.page = Math.ceil(this.tasks.length / this.itemsPerPage);
      }
    },
    loadDetails(id) {
      this.$router.push({ path: `/task/${id}` });
    }
  }
};
</script>

<style scoped>
.container.fill-height {
  flex-wrap: wrap;
}
.container.fill-height > .row {
  flex: 1 1 100%;
}
.v-pagination {
  margin: 16px 0;
}
</style>
