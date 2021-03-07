<template>
  <v-container>
    <div v-if="loading">Loading...</div>
    <v-layout v-if="!loading" class="defectcontainer" wrap>
      <v-flex lg5 md5 sm12 xs12 class="defect-image">
        <v-img
          v-if="loadedimage != null"
          v-bind:src="'data:image/png;base64,' + loadedimage"
          max-width="600"
          class="defect-actual-image grey darken-4"
        />
        <v-img v-else src="../../../images/noImage.jpg"></v-img>
      </v-flex>
      <v-flex lg7 md7 sm12 xs12 class="defect-info">
        <v-flex row class="defectHeader">
          <v-flex xl9 lg12 md12 sm9 xs12 display-1 class="defectName">
            <h1>{{ defect.name }}</h1>
          </v-flex>
          <v-flex xl3 lg12 md12 sm3 xs12 class="defect-buttons">
            <v-btn text depressed small disabled class="categoryButton">
              <p class="overline categorytext">{{ defect.category.name }}</p>
            </v-btn>
          </v-flex>
          <v-flex xl8 lg12 md12 sm8 xs12 headline>
            <h2>
              {{
              defect.campuslocation
              }}
              {{ nearbyText }}
              room: {{ defect.locationroom }}
            </h2>
          </v-flex>
          <v-flex xl4 lg12 md12 sm4 xs12 class="defect-buttons">
            <edit-button
              :user="this.user"
              v-if="showBtns"
              v-bind:type="'defect'"
              v-bind:id="defect.id"
              @submitEventTriggered="fetchDefect"
              style="padding-right: 6px; margin-bottom: 36px;"
              class="customButton"
            />
            <cancel-button
              v-if="showBtns"
              v-on:hideEditButtons="hideEditButtons"
              @statusChanged="refresh"
              v-bind:type="'defect'"
              v-bind:id="defect.id"
              style="padding-right: 6px; margin-bottom: 36px"
              class="customButton"
            />

            <v-container
              v-if="user.role.toLowerCase() !== 'external'"
              style="padding: 0px; margin: 0px; width: 100px"
            >
              <v-btn @click="upvoteDefect" color="white" tile small class="customButton">
                follow
                <v-icon right v-if="defectUpvoted">done</v-icon>
                <v-icon right v-else>mdi-cancel</v-icon>
              </v-btn>
            </v-container>
          </v-flex>
        </v-flex>
        <v-flex class="defect-description addSmartphonePadding">
          <p>{{ defect.description }}</p>
          <v-divider></v-divider>
          <StatusSection
            @statusChanged="refresh"
            :user="user"
            class="text-center"
          />
          <v-divider></v-divider>
          <h3 class="text-center">Comments</h3>
          <CommentSection :user="this.user" />
        </v-flex>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
//if this component is loaded it will do a get for the defect passed in the url -> we don't get the defect as a prop because external users will not have acces to the parent lists (external users will only have acces to detail pages of defects with a certain id)
import api from "../backend-api.js";
import CommentSection from "./CommentSection.vue";
import StatusSection from "./StatusSection.vue";
import CancelButton from "../ButtonComponents/CancelButton.vue";
import EditButton from "../ButtonComponents/EditButton.vue";

export default {
  name: "DefectDetail",
  props: ["user"],
  data() {
    return {
      loading: false,
      defect: null,
      loadedimage: null,
      dialog: false,
      defectUpvoted: false,
      showBtns: false,
      nearbyText: ""
    };
  },
  created: function() {
    this.fetchDefect();
    this.getAllUpvotesFromUser(this.user.id);
  },
  methods: {
    refresh() {
      this.defect = null;
      this.fetchDefect();
      this.getAllUpvotesFromUser(this.user.id);
    },
    showEditButtons() {
      if (
        this.defect.status.toLowerCase() === "canceled" ||
        this.defect.status.toLowerCase() === "complete"
      ) {
        this.hideEditButtons();
      } else {
        if (
          this.user.role.toLowerCase() == "admin" ||
          this.user.role.toLowerCase() == "facility coordinator"
        ) {
          this.showBtns = true;
        } else if (
          this.user.id === this.defect.metaData.creatorid &&
          this.defect.status === "OPEN" &&
          this.defect.fixerid === ""
        ) {
          this.showBtns = true;
        } else {
          this.hideEditButtons();
        }
      }
    },
    hideEditButtons() {
      if (
        this.defect.status.toLowerCase() === "canceled" ||
        this.defect.status.toLowerCase() === "complete"
      ) {
        this.showBtns = false;
      }
      if (
        this.user.role.toLowerCase() != "admin" &&
        this.user.role.toLowerCase() != "facility coordinator"
      ) {
        this.showBtns = false;
      }
    },
    fetchDefect() {
      this.loading = true;
      api.getDefect(this.$route.params.id).then(response => {
        this.defect = response.data;
        if (this.defect.nearby) {
          this.nearbyText = "near";
        }
        this.showEditButtons();
        if (this.defect.photoid != "") {
          this.loadImage(this.defect.photoid);
        } else {
          this.loading = false;
        }
      });
    },
    loadImage(id) {
      api.getPhoto(id).then(res => {
        this.loadedimage = res.data.image.data;
        this.loading = false;
      });
    },
    getAllUpvotesFromUser(id) {
      api.getAllUpvotedDefectOfUser(id).then(response => {
        var included = response.data.includes(this.$route.params.id);
        if (included) {
          this.defectUpvoted = true;
        }
      });
    },
    upvoteDefect() {
      this.defectUpvoted = !this.defectUpvoted;
      if (this.defectUpvoted) {
        api.addUpvoteToUser(this.user.id, this.$route.params.id).then(() => {
          api.subscribeToDefect(this.user.id, this.$route.params.id);
        });
        api.upvoteDefect(this.$route.params.id, true).then(response => {
          this.defect.upvotes = response.data;
        });
      } else {
        api.removeUpvoteInUser(this.user.id, this.$route.params.id).then(() => {
          api.unsubscribeToDefect(this.user.id, this.$route.params.id);
        });
        api.upvoteDefect(this.$route.params.id, false).then(response => {
          this.defect.upvotes = response.data;
        });
      }
    }
  },
  components: {
    CommentSection,
    StatusSection,
    CancelButton,
    EditButton
  }
};
</script>

<style lang="scss" scoped>
h1 {
  font-size: 2.5rem;
}

h2 {
  font-size: 1.5rem;
  margin: 0;
  padding: 0;
}

h3 {
  margin: 12px 0;
}

.customButton {
  width: 100px;
  height: 0;
  margin: 0;
  padding: 0;
}

.categoryButton {
  background-color: white;
}

.defect-buttons {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin: 0;
  padding: 0;
}

.nearby {
  display: inline;
}

.defectcontainer {
  background-color: rgba(255, 255, 255, 0.85);
}

.defect-description {
  padding: 12px;
}

.defect-image,
.defect-info {
  padding: 20px;
}

.defect-actual-image {
  margin: 0 auto;
}

.imagecontainer {
  overflow: hidden;
}

.defectHeader {
  background-color: rgba(226, 6, 19, 0.85);
  color: #fff;
  padding: 10px 15px;
  font-size: 1.5em;
  font-weight: bolder;
}

.defectHeaderSmall {
  font-size: 65%;
}

.row {
  margin: 0px 0px;
}

.v-application .categorytext {
  color: black;
  margin: 0;
  padding: 0;
  font-weight: bold;
  font-size: 0.8rem !important;
}

@media only screen and (max-width: 1904px) {
  .defect-buttons {
    justify-content: flex-start;
  }

  .categoryButton {
    margin-top: 8px;
  }
}

@media only screen and (max-width: 960px) {
  .defectcontainer {
    width: 100vw;
  }

  .defect-buttons {
    justify-content: flex-end;
  }

  .defectHeaderLocation {
    text-align: left;
    font-size: 80%;
  }

  .defect-actual-image {
    height: 320px;
  }

  .defect-info {
    padding: 0;
  }

  .defect-image {
    padding: 0;
  }

  .defectHeader {
    border-radius: 0;
  }
}

@media only screen and (max-width: 600px) {
  h1 {
    font-size: 1.5rem;
  }

  h2 {
    font-size: 1rem;
  }

  .defect-actual-image {
    height: 200px;
    padding: 0;
    margin: 0;
  }

  .defect-buttons {
    justify-content: flex-start;
  }
}
</style>
