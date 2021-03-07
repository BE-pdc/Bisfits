<template>
  <div class="overview">
    <v-expansion-panels accordion>
      <v-expansion-panel v-for="(item, index) in departments" :key="index">
        <v-expansion-panel-header>
          <h3 class="overline headerexpansion">{{ item.name }}</h3>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-row>
            <div v-if="item.contactlist.length <= 0">
              <p>No emergency contacts to be displayed here! :(</p>
            </div>
            <v-col sm="4" md="3" v-for="(contactitem, index) in item.contactlist" :key="index">
              <v-row>
                <v-card class="mx-auto contactcard">
                  <v-card-text>
                    <h3 class="text--primary">{{ contactitem.name }}</h3>
                    <div class="text--primary">{{ contactitem.contactfunction }}</div>
                    <div class="text--primary" v-if="contactitem.mobilenumber != ''">
                      <v-icon class="emergencyicons">phone_iphone</v-icon>Mobile:
                      <a :href="'tel:' + contactitem.mobilenumber">
                        {{
                        contactitem.mobilenumber
                        }}
                      </a>
                    </div>
                    <div class="text--primary" v-if="contactitem.telephonenumber != ''">
                      <v-icon class="emergencyicons">phone</v-icon>Telephone:
                      <a :href="'tel:' + contactitem.mobilenumber">
                        {{
                        contactitem.telephonenumber
                        }}
                      </a>
                    </div>
                    <div class="text--primary" v-if="contactitem.emailadress != ''">
                      <v-icon class="emergencyicons">email</v-icon>E-Mail:
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
  </div>
</template>

<script>
import api from "../backend-api.js";

export default {
  data() {
    return {
      departments: []
    };
  },
  methods: {
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
    }
  },
  mounted: function() {
    this.getAllDepartments();
  }
};
</script>

<style lang="scss" scoped>
.contactcard {
  max-height: 15vh;
  min-height: 15vh;
  min-width: 18vw;
  max-width: 18vw;
}
.overview {
  max-width: 80vw;
  min-width: 80vw;
}
.v-application .headerexpansion {
  font-size: 1rem !important;
}
.emergencyicons {
  padding-right: 4px;
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

@media only screen and (max-width: 960px) {
  .primarycategorycreator {
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
  .primarycategorycreator {
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
