<template>
  <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
    <v-card>
      <v-toolbar dark color="rgba(226, 6, 19, 0.85)">
        <v-btn icon dark @click="emitClosedEvent">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title>Send E-mail to {{ external.firstname }} {{ external.lastname }}</v-toolbar-title>
        <v-spacer></v-spacer>
      </v-toolbar>
      <v-form ref="form">
        <v-card-text>
          <v-text-field
            class="recipientBox"
            label="Recipient"
            :rules="rulesgeneralfields"
            v-model="recipient"
            color="red"
          ></v-text-field>

          <v-combobox
            class="CCBox"
            v-model="carboncopies"
            chips
            label="CC"
            multiple
            append-icon
            deletable-chips
            color="red"
          ></v-combobox>
          <v-row>
            <v-col lg="3" md="3" sm="4">
              <v-checkbox
                label="Show tasks"
                color="red"
                v-model="taskcheckbox"
                @change="changeSelectData"
                v-if="this.user.role.toLowerCase() != 'logistic coordinator'"
              ></v-checkbox>

              <v-select
                class="itemselector"
                :items="items"
                v-model="selecteditem"
                item-text="name"
                label="Select to view details"
                single-line
                :return-object="true"
                :rules="rulesgeneralfields"
                no-data-text="No processed tasks or defects :("
                color="red"
              ></v-select>
            </v-col>
            <v-col>
              <v-card v-if="selecteditem !== null" tile class="detailcard">
                <div class="textwrapper">
                  <strong>Name:</strong>
                  {{ selecteditem.name }}
                  <br />
                  <strong>Description:</strong>
                  {{ selecteditem.description }}
                  <br />
                  <strong>Category:</strong>
                  {{ selecteditem.category.name }}
                  <br />
                  <strong>Status:</strong>
                  {{ selecteditem.status }}
                  <br />
                  <strong>Campus:</strong>
                  {{ selecteditem.campuslocation }}
                  <br />
                  <strong>Room:</strong>
                  {{ selecteditem.locationroom }}
                </div>
              </v-card>
            </v-col>
          </v-row>
          <v-text-field label="Subject" color="red" v-model="subject" :rules="rulesgeneralfields"></v-text-field>
          <v-textarea
            label="Body"
            v-model="body"
            :auto-grow="true"
            rows="15"
            :rules="rulesgeneralfields"
            color="red"
          ></v-textarea>
        </v-card-text>
      </v-form>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="red" class="sendEmailButton" @click="validate" text>Send E-mail</v-btn>
      </v-card-actions>
    </v-card>
    <v-overlay :value="overlay">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
  </v-dialog>
</template>

<script>
import api from "../backend-api.js";

export default {
  name: "ExternalEmailDialog",
  props: ["external", "selecteditemprop", "task", "user"],
  data() {
    return {
      dialog: true,
      recipient: "",
      carboncopies: [],
      subject: "",
      body:
        "Geachte " +
        this.external.firstname +
        " " +
        this.external.lastname +
        ",",
      items: [],
      selecteditem: null,
      taskcheckbox: false,
      rulesgeneralfields: [v => !!v || "Item is required"],
      overlay: false
    };
  },
  methods: {
    changeSelectData() {
      this.selecteditem = null;
      if (!this.taskcheckbox) {
        this.getAllDefects();
      } else {
        this.getAllTasks();
      }
    },
    getAllDefects() {
      this.items = [];
      api
        .getProcessedDefects()
        .then(defectresponse => {
          this.items = defectresponse.data;
        })
        .catch(error => {
          this.errors.push(error);
        });
    },
    getAllTasks() {
      this.items = [];
      api
        .getProcessedTasks()
        .then(taskresponse => {
          this.items = taskresponse.data;
        })
        .catch(error => {
          this.errors.push(error);
        });
    },
    sendEmailToExternal() {
      this.overlay = true;
      api
        .sendMailToExternal(
          this.body,
          this.recipient,
          this.subject,
          this.carboncopies
        )
        .then(() => {
          if (!this.taskcheckbox) {
            api.assignDefectExternal(this.external.id, this.selecteditem.id);
          } else {
            api.assignTaskExternal(this.external.id, this.selecteditem.id);
          }
          this.dialog = false;
          this.overlay = false;
          this.emitClosedEvent();
        });
    },
    emitClosedEvent() {
      this.$emit("emailpopupclosed");
      this.dialog = false;
    },
    getPropById() {
      if (this.selecteditemprop != null) {
        if (!this.task) {
          api.getDefect(this.selecteditemprop).then(response => {
            this.getAllDefects();
            this.selecteditem = response.data;
          });
        } else {
          this.taskcheckbox = true;
          this.getAllTasks();
          api.getTask(this.selecteditemprop).then(response => {
            this.selecteditem = response.data;
          });
        }
      }
    },
    validate() {
      if (this.$refs.form.validate()) {
        this.sendEmailToExternal();
      }
    }
  },
  mounted() {
    this.recipient = this.external.email;
    this.getPropById();
  }
};
</script>

<style lang="scss" scoped>
.itemselector {
  width: 20vw;
  max-width: 20vw;
}
.detailcard {
  max-width: 70vw;
}
.textwrapper {
  padding: 10px;
}
.sendEmailButton {
  margin-right: 20px;
}

@media only screen and (max-width: 960px) {
  .itemselector {
    width: 30vw;
    max-width: 30vw;
  }
  .detailcard {
    max-width: 60vw;
  }
  .textwrapper {
    padding: 10px;
  }
}

@media only screen and (max-width: 600px) {
  .itemselector {
    width: 90vw;
    max-width: 90vw;
  }
  .detailcard {
    max-width: 90vw;
  }
  .textwrapper {
    padding: 10px;
  }
}

@media only screen and (max-width: 405px) {
  .itemselector {
    width: 90vw;
    max-width: 90vw;
  }
  .detailcard {
    max-width: 90vw;
  }
  .textwrapper {
    padding: 10px;
  }
}
</style>
