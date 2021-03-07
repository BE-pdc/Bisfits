<template>
  <v-container v-if="defects.length == 0" class="card-container" fill-height justify-center>
    <p class="display-1 text-center">{{ this.emptyMessage }}</p>
  </v-container>
  <v-container class="card-container" fill-height v-else>
    <v-layout row wrap class="mx-auto">
      <v-flex
        lg6
        md6
        sm12
        xs12
        v-for="defect in displayedDefects"
        :key="defect.id"
        v-on:click="loadDetails(defect.id)"
      >
        <v-card outlined tile>
          <v-list-item three-line>
            <v-avatar class="ma-3" size="125" tile>
              <v-img
                v-if="defectHasPhoto(defect.id)"
                v-bind:src="'data:image/png;base64,' + loadPhoto(defect.id)"
              />
              <v-img v-else src="../../../images/noImage.jpg"></v-img>
            </v-avatar>
            <v-list-item-content>
              <v-list-item-title class="headline">
                {{
                defect.name
                }}
              </v-list-item-title>
              <v-list-item-subtitle class="text--primary">
                {{ defect.campuslocation }}
                {{ defect.locationroom }}
              </v-list-item-subtitle>
              <v-list-item-subtitle>Status: {{ defect.status }}</v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-icon>
              <p v-if="defect.priority === 3">
                <v-icon medium color="red">mdi-circle</v-icon>
              </p>
              <p v-if="defect.priority === 2">
                <v-icon medium color="orange">mdi-circle</v-icon>
              </p>
              <p v-if="defect.priority === 1">
                <v-icon medium color="green">mdi-circle</v-icon>
              </p>
            </v-list-item-icon>
          </v-list-item>
        </v-card>
      </v-flex>
    </v-layout>
    <v-layout row justify-center>
      <v-flex class="pagination">
        <v-pagination
          v-model="page"
          :length="pageCount"
          v-if="this.defects.length >= this.itemsPerPage"
          color="rgb(230,40,52)"
        ></v-pagination>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import api from "../backend-api.js";

export default {
  name: "DefectCards",
  props: ["defects", "emptyMessage"],
  data() {
    return {
      contentPhotos: [],
      page: 1,
      itemsPerPage: 9
    };
  },
  mounted: function() {
    this.initData();
  },
  methods: {
    initData() {
      this.defects.forEach(d => {
        if (d.photoid != "") {
          this.addToContentPhotos(d.id, d.photoid);
        }
      });
    },

    addToContentPhotos(defectid, photoid) {
      api.getPhoto(photoid).then(response => {
        let obj = {
          contentid: defectid,
          imagedata: response.data.image.data
        };
        this.contentPhotos.push(obj);
      });
    },
    loadPhoto(defectid) {
      let obj = this.contentPhotos.find(obj => obj.contentid == defectid);
      return obj.imagedata;
    },
    defectHasPhoto(defectid) {
      let obj = this.contentPhotos.find(obj => obj.contentid == defectid);
      if (obj != undefined) {
        return true;
      } else {
        return false;
      }
    },
    loadDetails(id) {
      this.$router.push({ path: `/defect/${id}` });
    },
    resizeItems() {
      switch (this.$vuetify.breakpoint.name) {
        case "xs":
          this.itemsPerPage = 4;
          break;
        case "sm":
          this.itemsPerPage = 4;
          break;
        case "md":
          this.itemsPerPage = 4;
          break;
        case "lg":
          this.itemsPerPage = 6;
          break;
        case "xl":
          this.itemsPerPage = 6;
          break;
      }
    },
    checkPageExists() {
      //this method is needed for fixing a bug when resizing small to large screens in some cases
      if (this.page > Math.ceil(this.defects.length / this.itemsPerPage)) {
        this.page = Math.ceil(this.defects.length / this.itemsPerPage);
      }
    }
  },
  computed: {
    pageCount() {
      this.resizeItems();
      this.checkPageExists();
      return Math.ceil(this.defects.length / this.itemsPerPage);
    },
    displayedDefects() {
      return this.defects.slice(
        this.itemsPerPage * (this.page - 1),
        this.itemsPerPage * this.page
      );
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
