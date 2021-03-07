<template>
  <v-dialog v-model="dialog" class="categoryDialog" width="500">
    <template v-slot:activator="{ on }">
      <v-btn v-on="on" small dark tile color="#e62b36">
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-card-title class="headline grey lighten-2" primary-title>
        Add new category
        <v-spacer></v-spacer>
        <v-btn icon medium class="closedialogbutton" color="black" @click="dialog = false">
          <v-icon>close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-text-field
          color="red"
          label="Name"
          ref="category"
          v-model="category_name"
          :rules="categoryRules"
        ></v-text-field>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="red" text @click="addNewCategory()">Submit</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import api from "../backend-api.js";

export default {
  name: "CategoryCreator",
  props: ["primcatid"],
  data() {
    return {
      errors: [],
      dialog: false,
      category_name: "",
      categoryRules: [v => !!v || "Category name can't be empty"]
    };
  },
  methods: {
    addNewCategory() {
      if (this.$refs.category.validate()) {
        api
          .addNewCategory(this.category_name, this.primcatid)
          .then(response => {
            if (response.status == 201) {
              this.emitToParent();
            }
          });
        this.dialog = false;
        this.$refs.category.reset();
      }
    },
    emitToParent() {
      this.$emit("submitIsPressedCategory");
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
