<template>
  <v-container>
    <div v-if="loading">Loading...</div>
    <v-layout v-if="!loading" class="taskcontainer" wrap>
      <v-flex xl12 lg12 md12 sm12 xs12 class="task-info">
        <v-flex row class="taskHeader">
          <v-flex xl9 lg9 md9 sm9 xs12 display-1 class="taskName">
            <h1>{{ task.name }}</h1>
          </v-flex>
          <v-flex xl3 lg3 md3 sm3 xs12 class="task-buttons">
            <v-btn text depressed small disabled class="categoryButton">
              <p class="overline categorytext">{{ task.category.name }}</p>
            </v-btn>
          </v-flex>
          <v-flex xl8 lg8 md8 sm8 xs12 headline>
            <h2>
              {{ task.campuslocation }}
              {{ nearbyText }}
              room: {{ task.locationroom }}
            </h2>
          </v-flex>
          <v-flex xl4 lg4 md4 sm4 xs12 class="task-buttons">
            <edit-button
              :user="this.user"
              v-if="showBtns"
              v-bind:type="'task'"
              v-bind:id="task.id"
              @submitEventTriggered="refresh"
              style="padding-right: 6px; margin-bottom: 36px;"
              class="customButton"
            />
            <cancel-button
              v-if="showBtns"
              v-on:hideEditButtons="hideEditButtons"
              @statusChanged="refresh"
              v-bind:type="'task'"
              v-bind:id="task.id"
              style="padding-right: 6px; margin-bottom: 36px"
              class="customButton"
            />
          </v-flex>
        </v-flex>

        <v-flex class="task-description addSmartphonePadding">
          <p>{{ task.description }}</p>
          <v-divider></v-divider>
          <v-flex class="text-center">
            {{ status }}
            <v-spacer></v-spacer>
            Status changed:
            {{ task.statusChanged }}
            <v-spacer></v-spacer>
            <v-btn
              tile
              color="rgb(226, 6, 19, 0.85)"
              dark
              v-if="task.status == 'OPEN' && (user.role.toLowerCase() == 'admin' || user.role.toLowerCase() == 'facility coordinator' || user.role.toLowerCase() == 'logistic coordinator')"
              @click="updateStatus('IN_PROGRESS')"
              class="status-btn"
            >Start processing</v-btn>
            <v-btn
              tile
              color="rgb(226, 6, 19, 0.85)"
              dark
              v-if="task.status == 'IN_PROGRESS'  && (user.role.toLowerCase() == 'admin' || user.role.toLowerCase() == 'facility coordinator' || user.role.toLowerCase() == 'logistic coordinator')"
              @click="updateStatus('PASSED_TO_PROVINCE')"
              class="status-btn"
            >Pass</v-btn>
            <v-btn
              tile
              color="rgb(226, 6, 19, 0.85)"
              dark
              v-if="task.status == 'IN_PROGRESS'  && (user.role.toLowerCase() == 'admin' || user.role.toLowerCase() == 'facility coordinator' || user.role.toLowerCase() == 'logistic coordinator')"
              @click="updateStatus('PROCESS_BY_AP')"
              class="status-btn"
            >Pick up</v-btn>
            <v-btn
              tile
              color="rgb(226, 6, 19, 0.85)"
              dark
              v-if="(task.status == 'PROCESS_BY_AP' || task.status == 'PASSED_TO_PROVINCE')  && (user.role.toLowerCase() == 'admin' || user.role.toLowerCase() == 'facility coordinator' || user.role.toLowerCase() == 'logistic coordinator')"
              @click="dialogexternal = true"
              class="status-btn"
            >Assign external</v-btn>
            <!--Dialog for external selection-->
            <v-dialog v-model="dialogexternal" width="500">
              <v-card class="mx-auto" tile>
                <v-list dense>
                  <v-subheader>Externals</v-subheader>
                  <v-list-item
                    v-for="(item, i) in externals"
                    :key="i"
                    @click="dialogexternalemailpopup = true, dialogexternal = false"
                  >
                    <v-list-item-content>
                      <v-list-item-title v-text="item.companyname" class="externalemaildialog"></v-list-item-title>
                      <external-email-dialog
                        @emailpopupclosed="emitStatusChanged"
                        :user="user"
                        v-if="dialogexternalemailpopup == true"
                        :external="item"
                        :selecteditemprop="task.id"
                        :task="true"
                      />
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-card>
            </v-dialog>
            <v-btn
              tile
              color="rgb(226, 6, 19, 0.85)"
              dark
              v-if="task.status == 'PROCESS_BY_AP'  && (user.role.toLowerCase() == 'admin' || user.role.toLowerCase() == 'facility coordinator' || user.role.toLowerCase() == 'logistic coordinator')"
              @click="dialogAssign = true"
              class="status-btn"
            >Assign AP employee</v-btn>
            <AssignTaskDetail
              v-if="dialogAssign"
              :itemid="task.id"
              @apAssignClosed="emitStatusChanged"
            />
            <v-btn
              tile
              color="rgb(226, 6, 19, 0.85)"
              dark
              @click="dialog = true"
              v-if="(task.status == 'EXECUTING_BY_AP' || task.status == 'EXECUTING_BY_EXTERNAL')  && ((user.role.toLowerCase() == 'admin' || user.role.toLowerCase() == 'facility coordinator' || user.role.toLowerCase() == 'logistic coordinator') || user.id === task.fixerid)"
              class="status-btn"
            >Complete</v-btn>
            <v-btn
              tile
              color="rgb(226, 6, 19, 0.85)"
              dark
              v-if="(task.status == 'PROCESS_BY_AP' || task.status == 'PASSED_TO_PROVINCE') && (user.role.toLowerCase() == 'admin' || user.role.toLowerCase() == 'facility coordinator' || user.role.toLowerCase() == 'logistic coordinator')"
              @click="dialogCancel = true"
              class="status-btn"
            >CANCEL</v-btn>
          </v-flex>
        </v-flex>
        <v-spacer></v-spacer>
      </v-flex>
    </v-layout>
    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="headline">WARNING</span>
        </v-card-title>
        <v-card-text>Are you sure you want to mark the task as complete?</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red" text @click="dialog = false">No</v-btn>
          <v-btn color="red" text @click="updateStatus('COMPLETE'),dialog = false ">Yes</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogCancel" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="headline">WARNING</span>
        </v-card-title>
        <v-card-text>Are you sure you want to cancel the task?</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red" text @click="updateStatus('CANCELED'), dialogCancel = false">Yes</v-btn>
          <v-btn color="red" text @click="dialogCancel = false">No</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
//if this component is loaded it will do a get for the task passed in the url -> we don't get the task as a prop because external users will not have acces to the parent lists (external users will only have acces to detail pages of tasks with a certain id)
import api from "../backend-api.js";
import CancelButton from "../ButtonComponents/CancelButton.vue";
import EditButton from "../ButtonComponents/EditButton.vue";
import ExternalEmailDialog from "../GeneralComponents/ExternalEmailDialog.vue";
import AssignTaskDetail from "./AssignTaskDetail.vue";
export default {
  name: "TaskDetail",
  props: ["user"],
  components: {
    CancelButton,
    EditButton,
    ExternalEmailDialog,
    AssignTaskDetail
  },
  data() {
    return {
      loading: false,
      task: null,
      dialog: false,
      dialogAssign: false,
      showBtns: false,
      nearbyText: "",
      dialogCancel: false,
      status: "",
      dialogexternal: false,
      externals: [],
      dialogexternalemailpopup: false
    };
  },
  created: function() {
    this.fetchTask();
  },
  mounted() {
    api.getExternals().then(response => {
      this.externals = response.data;
    });
  },
  methods: {
    refresh() {
      this.task = null;
      this.status = null;
      this.fetchTask();
    },
    showEditButtons() {
      if (
        this.task.status.toLowerCase() === "canceled" ||
        this.task.status.toLowerCase() === "complete"
      ) {
        this.hideEditButtons();
      } else if (
        this.user.role.toLowerCase() == "admin" ||
        this.user.role.toLowerCase() == "logistic coordinator"
      ) {
        this.showBtns = true;
      } else if (
        this.user.id === this.task.metaData.creatorid &&
        this.task.status === "OPEN" &&
        this.task.fixerid === ""
      ) {
        this.showBtns = true;
      } else {
        this.hideEditButtons();
      }
    },
    hideEditButtons() {
      if (
        this.task.status.toLowerCase() === "canceled" ||
        this.task.status.toLowerCase() === "complete"
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

    fetchTask() {
      this.loading = true;
      api.getTask(this.$route.params.id).then(response => {
        this.task = response.data;
        if (this.task.nearby) {
          this.nearbyText = "near";
        }
        this.showEditButtons();
        this.loading = false;
      });
      api.getStatusForTask(this.$route.params.id).then(response => {
        this.status = response.data;
      });
    },
    updateStatus(status) {
      api.updateStatusOfTask(status, this.$route.params.id).then(response => {
        if (response.status == 201) {
          this.emitStatusChanged();
          this.dialog = false;
        }
      });
    },
    emitStatusChanged() {
      this.fetchTask();
      this.dialogexternalemailpopup = false;
      this.dialogAssign = false;
    },
    openExternalDialog() {
      this.dialogexternalemailpopup = true;
      this.item = null;
    },
    updated() {
      api.getTask(this.$route.params.id).then(response => {
        this.task = response.data;
      });
    }
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

.task-buttons {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin: 0;
  padding: 0;
}

.nearby {
  display: inline;
}

.taskcontainer {
  background-color: rgba(255, 255, 255, 0.85);
  width: 70vw;
}

.task-description {
  padding: 12px;
}

.task-info {
  padding: 20px;
}

.taskHeader {
  background-color: rgba(226, 6, 19, 0.85);
  color: #fff;
  padding: 10px 15px;
  font-size: 1.5em;
  font-weight: bolder;
}

.taskHeaderSmall {
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

.status-btn {
  margin-left: 10px;
  margin-top: 5px;
}

@media only screen and (max-width: 960px) {
  .taskcontainer {
    width: 100vw;
  }

  .task-buttons {
    justify-content: flex-end;
  }

  .taskHeaderLocation {
    text-align: left;
    font-size: 80%;
  }

  .task-info {
    padding: 0;
  }

  .taskHeader {
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

  .task-buttons {
    justify-content: flex-start;
  }
}
</style>
