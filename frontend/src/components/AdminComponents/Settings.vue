<template>
  <div class="overview">
    <v-tabs color="#e60005" v-model="tab" slider-color="primary" vertical grow>
      <v-tabs-slider color="#e60005" />
      <v-tab v-for="item in tabItems" :key="item.tab" @change="cancelEdit()">{{ item.tab }}</v-tab>
    </v-tabs>
    <v-divider></v-divider>
    <v-tabs-items v-model="tab">
      <v-tab-item v-for="item in tabItems" :key="item.tab">
        <!--CATEGORY-->
        <v-layout v-if="item.tab === 'Categories'">
          <v-expansion-panels accordion>
            <v-expansion-panel v-for="(item, index) in categories" :key="index">
              <v-expansion-panel-header>
                <h1 class="overline headerexpansion">
                  <CategoryCreator
                    v-on:submitIsPressedCategory="submitIsPressedCategory"
                    v-bind:primcatid="item.id"
                  />
                  {{ item.name }}
                </h1>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-row no-gutters>
                  <div class="nodisplaytext" v-if="item.categoryList.length == 0">
                    <p>No categories to be displayed here! :(</p>
                  </div>
                  <v-col
                    v-for="(category, index) in item.categoryList"
                    :key="index"
                    sm="3"
                    md="2"
                    lg="2"
                    class="categorycolumn"
                  >
                    <v-row>
                      <v-card
                        class="mx-auto categorylistcards"
                        outlined
                        tile
                        style="border-color: grey"
                      >
                        <v-card-text>
                          <h3 class="text--primary categoryname">{{ category.name }}</h3>
                          <v-icon
                            medium
                            class="mr-2 categorydeletebutton"
                            @click.stop="
                              dialogCategory = true
                            "
                          >mdi-delete</v-icon>
                          <!--Confirmation Dialog category-->
                          <v-dialog v-model="dialogCategory" max-width="500px">
                            <v-card>
                              <v-card-title>
                                <span class="headline">WARNING</span>
                              </v-card-title>
                              <v-card-text>Are you sure you want to cancel this item?</v-card-text>
                              <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="red darken-1" text @click="dialogCategory = false;">No</v-btn>
                                <v-btn
                                  color="red darken-1"
                                  text
                                  @click="deleteCategoryById(item.id, category.id), dialogCategory = false"
                                >Yes</v-btn>
                              </v-card-actions>
                            </v-card>
                          </v-dialog>
                          <!--End of confirmation dialog-->
                        </v-card-text>
                      </v-card>
                    </v-row>
                  </v-col>
                </v-row>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-layout>
        <!--END OF CATEGORY-->
        <!--LOCATIONS-->
        <v-layout v-if="item.tab === 'Campuses'" wrap>
          <v-expansion-panels accordion>
            <v-expansion-panel v-for="(item, index) in campusLocations" :key="index">
              <v-expansion-panel-header>
                <h1 class="overline headerexpansion">
                  <room-creator
                    v-bind:campusid="item.id"
                    v-on:submitIsPressedRoom="submitIsPressedRoom"
                  />
                  {{ item.campusName }}
                </h1>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-row no-gutters>
                  <v-col
                    v-for="(room, index) in item.roomlist"
                    :key="index"
                    sm="3"
                    md="2"
                    lg="2"
                    class="categorycolumn"
                  >
                    <v-row>
                      <v-card
                        class="mx-auto categorylistcards"
                        outlined
                        tile
                        style="border-color: grey"
                      >
                        <v-card-text>
                          <h3 class="text--primary categoryname">{{ room.roomNumber }}</h3>
                          <v-icon
                            medium
                            class="mr-2 categorydeletebutton"
                            @click.stop="
                              dialogRooms = true
                            "
                          >mdi-delete</v-icon>
                          <!--Confirmation Dialog rooms-->
                          <v-dialog v-model="dialogRooms" max-width="500px">
                            <v-card>
                              <v-card-title>
                                <span class="headline">WARNING</span>
                              </v-card-title>
                              <v-card-text>Are you sure you want to cancel this item?</v-card-text>
                              <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="red darken-1" text @click="dialogRooms = false;">No</v-btn>
                                <v-btn
                                  color="red darken-1"
                                  text
                                  @click="deleteCampusRoom(room.roomNumber, item.id), dialogRooms = false"
                                >Yes</v-btn>
                              </v-card-actions>
                            </v-card>
                          </v-dialog>
                          <!--End of confirmation dialog-->
                        </v-card-text>
                      </v-card>
                    </v-row>
                  </v-col>
                </v-row>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-layout>
        <!--EMERGENCY NUMBERS-->
        <v-layout v-if="item.tab === 'Emergency Numbers'" wrap>
          <v-expansion-panels accordion>
            <v-expansion-panel v-for="(item, index) in departments" :key="index">
              <v-expansion-panel-header>
                <h3 class="overline headerexpansion">
                  <contact-creator
                    v-on:submitIsPressedContact="submitIsPressedContact"
                    v-bind:departmentid="item.id"
                  />
                  {{ item.name }}
                </h3>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-row>
                  <v-col
                    sm="3"
                    md="3"
                    v-for="(contactitem, index) in item.contactlist"
                    :key="index"
                  >
                    <v-row>
                      <v-card class="mx-auto contactcard">
                        <div class="contactcardactions">
                          <contact-updater
                            v-on:submitIsPressedContact="submitIsPressedContact"
                            v-bind:departmentid="item.id"
                            v-bind:contactid="contactitem.id"
                          />
                          <v-icon
                            medium
                            @click="
                              dialogContacts = true
                            "
                          >mdi-delete</v-icon>
                          <!--Confirmation Dialog emergency contacts-->
                          <v-dialog v-model="dialogContacts" max-width="500px">
                            <v-card>
                              <v-card-title>
                                <span class="headline">WARNING</span>
                              </v-card-title>
                              <v-card-text>Are you sure you want to cancel this item?</v-card-text>
                              <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="red darken-1" text @click="dialogContacts = false;">No</v-btn>
                                <v-btn
                                  color="red darken-1"
                                  text
                                  @click="deleteDepartmentContact(item.id, contactitem.name), dialogContacts = false"
                                >Yes</v-btn>
                              </v-card-actions>
                            </v-card>
                          </v-dialog>
                          <!--End of confirmation dialog-->
                        </div>
                        <v-card-text>
                          <h3 class="text--primary">{{ contactitem.name }}</h3>
                          <div class="text--primary">{{ contactitem.contactfunction }}</div>
                          <div class="text--primary" v-if="contactitem.mobilenumber != ''">
                            Mobile:
                            <a :href="'tel:' + contactitem.mobilenumber">
                              {{
                              contactitem.mobilenumber
                              }}
                            </a>
                          </div>
                          <div class="text--primary" v-if="contactitem.telephonenumber != ''">
                            Telephone:
                            <a :href="'tel:' + contactitem.mobilenumber">
                              {{
                              contactitem.telephonenumber
                              }}
                            </a>
                          </div>
                          <div class="text--primary" v-if="contactitem.emailadress != ''">
                            E-Mail:
                            <a :href="'mailto:' + contactitem.emailadress">
                              {{
                              contactitem.emailadress
                              }}
                            </a>
                          </div>
                        </v-card-text>
                      </v-card>
                    </v-row>
                  </v-col>
                </v-row>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-layout>
        <!--END OF EMERGENCY NUMBERS-->
        <!-- EMAIL TEMPLATES -->
        <v-layout v-if="item.tab === 'Email Templates'" wrap>
          <v-container class="emailTemplates">
            <v-row>
              <v-col
                v-for="(emailTemplate, index) in emailTemplates"
                :key="index"
                cols="12"
                sm="6"
                md="4"
                class="emailTemplate"
              >
                <v-textarea
                  color="red"
                  class="textArea"
                  :id="'emailTemplate' + index"
                  :label="emailTemplate.name"
                  v-model="emailTemplate.text"
                  :readonly="!(index === selectedTemplate)"
                  :rules="rulesEmailTemplate"
                  append-icon="mdi-pencil"
                  @click:append="selectTemplate(index)"
                ></v-textarea>
                <div v-if="index === selectedTemplate" class="buttons">
                  <v-row class="emailRow">
                    <v-col
                      v-for="(emailChip, index) in emailChips"
                      :key="index"
                      cols="4"
                      sm="4"
                      md="4"
                      lg="3"
                      class="emailCol"
                    >
                      <v-chip label @click="insertText(emailChip.text)">{{ emailChip.name }}</v-chip>
                    </v-col>
                  </v-row>
                  <v-btn color="#E60005" dark @click="saveTemplate(index)">
                    Save
                    <v-icon dark right>mdi-checkbox-marked-circle</v-icon>
                  </v-btn>
                  <v-btn light @click="cancelEdit()">
                    <v-icon dark center>mdi-cancel</v-icon>
                  </v-btn>
                </div>
              </v-col>
            </v-row>
          </v-container>
        </v-layout>
        <!-- END OF EMAIL TEMPLATES -->
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>

<script>
import api from "../backend-api.js";
import CategoryCreator from "./CategoryCreator.vue";
import RoomCreator from "./RoomCreator.vue";
import ContactCreator from "./ContactCreator.vue";
import ContactUpdater from "./ContactUpdater.vue";

export default {
  components: {
    CategoryCreator,
    RoomCreator,
    ContactCreator,
    ContactUpdater
  },
  data() {
    return {
      categories: [],
      campusLocations: [],
      campusrooms: [],
      selectedcampus: [],
      emailTemplates: [],
      campusIsSelected: false,
      dialog: false,
      contactCreated: false,
      emailReadonly: false,
      selectedTemplate: null,
      uneditedTemplate: "",
      tab: null,
      dialogCategory: false,
      dialogRooms: false,
      dialogContacts: false,
      tabItems: [
        {
          tab: "Categories"
        },
        {
          tab: "Campuses"
        },
        {
          tab: "Emergency Numbers"
        },
        {
          tab: "Email Templates"
        }
      ],
      emailChips: [
        { name: "Defect", text: "[[defect]]" },
        { name: "Task", text: "[[task]]" }
      ],
      departments: [],
      externals: [],
      rulesEmailTemplate: [v => !!v || "Email template cannot be empty"]
    };
  },
  methods: {
    deleteCategoryById(primcatid, categoryid) {
      api.deleteCategoryById(primcatid, categoryid).then(response => {
        if (response.status == 204) {
          this.getAllCategories();
        }
      });
    },
    deleteCampusRoom(roomnumber, campusid) {
      api.deleteRoomFromCampus(roomnumber, campusid).then(response => {
        if (response.status == 204) {
          this.getAllCampuses();
        }
      });
    },
    deleteDepartmentContact(depid, contname) {
      api
        .deleteDepartmentContact(depid, contname.replace(/\s/g, "%20"))
        .then(response => {
          if (response.status == 204) {
            this.getAllDepartments();
          }
        });
    },
    getAllDepartments() {
      this.departments = [];
      api
        .getAllDepartments()
        .then(response => {
          this.departments = response.data;
        })
        .catch(error => {
          this.error.push(error);
        });
    },
    getAllCampuses() {
      this.campusLocations = [];
      api
        .getCampusLocations()
        .then(response => {
          this.campusLocations = response.data;
        })
        .catch(error => {
          this.errors.push(error);
        });
    },
    submitIsPressedContact() {
      this.getAllDepartments();
    },
    getAllCategories() {
      this.categories = [];
      api
        .getCategoryList()
        .then(response => {
          this.categories = response.data;
        })
        .catch(error => {
          this.errors.push(error);
        });
    },
    submitIsPressedCategory() {
      this.getAllCategories();
    },
    submitIsPressedRoom() {
      this.getAllCampuses();
    },
    getAllExternal() {
      api.getExternals().then(response => {
        this.externals = response.data;
      });
    },
    selectTemplate(index) {
      this.selectedTemplate = index;
      this.uneditedTemplate = this.emailTemplates[index].text;
    },
    insertText(text) {
      if (this.selectedTemplate !== null) {
        let templateElement = document.getElementById(
          "emailTemplate" + this.selectedTemplate
        );
        let start = templateElement.selectionStart;
        let end = templateElement.selectionEnd;
        let templateText = templateElement.value;
        this.emailTemplates[this.selectedTemplate].text =
          templateText.substring(0, start) + text + templateText.substring(end);
      }
    },
    saveTemplate(index) {
      if (this.selectedTemplate === index) {
        if (this.emailTemplates[index].text != "") {
          api.updateEmailTemplate(
            this.emailTemplates[index].id,
            this.emailTemplates[index].text
          );
          this.selectedTemplate = null;
        }
      }
    },
    cancelEdit() {
      if (this.selectedTemplate !== null) {
        this.emailTemplates[this.selectedTemplate].text = this.uneditedTemplate;
      }
      this.selectedTemplate = null;
    }
  },
  mounted: function() {
    this.getAllCategories();
    this.getAllCampuses();
    this.getAllDepartments();
    this.getAllExternal();
    api
      .getEmailTemplates()
      .then(response => {
        this.emailTemplates = response.data;
      })
      .catch(error => {
        this.error.push(error);
      });
  }
};
</script>

<style lang="scss" scoped>
.campusselectorwrap {
  justify-content: center;
  align-items: center;
  display: flex;
  width: 100%;
}
.contactcard {
  max-height: 15vh;
  min-height: 15vh;
  min-width: 18vw;
  max-width: 18vw;
}
.contactcardactions {
  position: absolute;
  top: 10px;
  right: 5px;
}
.departmentdividers {
  margin-left: 2%;
  margin-right: 2%;
}
.nodisplaytext {
  justify-content: center;
  align-items: center;
  display: flex;
}
.campusinput {
  max-width: 30%;
}
.locationscard {
  height: auto;
  margin-bottom: 30px;
  min-width: 100%;
}
.categorycolumn {
  margin: 10px;
}
.categorylistcards {
  max-width: 14vw;
  min-width: 13vw;
}
.roomsrow {
  padding-left: 8%;
  grid-auto-columns: auto;
}
.roomscolumn {
  margin: 10px;
}
.overview {
  max-width: 80vw;
  min-width: 80vw;
}
.CategoryCreator {
  margin-right: 10px;
  margin-bottom: 10px;
  right: 0px;
  bottom: 0px;
  position: absolute;
}
.roomcreator {
  margin-right: 10px;
  margin-bottom: 10px;
  float: right;
}
.v-select {
  max-width: 20%;
}
.categorydeletebutton {
  right: 0px;
  top: 25%;
  position: absolute;
}
.v-application .headerexpansion {
  font-size: 1rem !important;
}

@media only screen and (min-width: 1024px) and (max-height: 1366px) and (max-width: 1024px) {
  .categorylistcards {
    max-width: 13vw;
    min-width: 13vw;
    word-break: break-all;
    text-overflow: ellipsis;
  }
  .categoryname {
    font-size: 100%;
    max-width: 80%;
    font-size: 75%;
  }
}

.textArea {
  padding: 0px 20px;
}

.emailTemplates {
  padding: 20px 0px;
}

.buttons {
  padding: 0px 20px;
}

.buttons button {
  margin-right: 5px;
}

.emailRow {
  padding: 0px 10px;
}

.emailCol {
  padding: 5px 0px;
}

@media only screen and (max-width: 960px) {
  .CategoryCreator {
    margin-right: 10px;
    margin-bottom: 10px;
    float: right;
  }
  .v-select {
    max-width: 60%;
  }
  .locationheader {
    margin-left: 0px;
  }
  .nodisplaytext {
    margin-left: 10vw;
    margin-top: 20px;
  }
  .overview {
    max-width: 100vw;
    min-width: 100vw;
  }
  .contactcard {
    max-height: 30vh;
    min-height: 20vh;
    min-width: 30vw;
    max-width: 30vw;
  }
  .contactcardactions {
    bottom: 5px;
    right: 5px;
    top: auto;
  }
  .categorylistcards {
    max-width: 26vw;
    min-width: 25vw;
  }
}

@media only screen and (max-width: 600px) {
  .CategoryCreator {
    margin-right: 10px;
    margin-bottom: 10px;
    float: right;
  }
  .v-select {
    max-width: 60%;
    color: white;
  }
  .locationheader {
    margin-left: 0px;
  }
  .contactcard {
    max-height: 30vh;
    min-height: 25vh;
    min-width: 90vw;
    max-width: 90vw;
  }
  .contactcardactions {
    top: 10px;
    right: 5px;
    bottom: auto;
  }
  .categorylistcards {
    max-width: 80vw;
    min-width: 80vw;
  }
}

@media only screen and (max-width: 405px) {
  .v-select {
    max-width: 60%;
  }
  .locationheader {
    margin-left: 0px;
  }
  .contactcard {
    max-height: 30vh;
    min-height: 25vh;
    min-width: 90vw;
    max-width: 90vw;
  }
  .contactcardactions {
    top: 10px;
    right: 5px;
    bottom: auto;
  }
  .categorylistcards {
    max-width: 80vw;
    min-width: 80vw;
  }
  .v-application .headerexpansion {
    font-size: 0.8rem !important;
  }
}
</style>
