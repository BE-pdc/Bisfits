<template>
  <div>
    <div>
      {{ status }}
      <v-spacer></v-spacer>
      Status changed:
      {{ defect.statusChanged }}
      <v-spacer></v-spacer>
      <v-btn
        tile
        color="rgb(226, 6, 19, 0.85)"
        dark
        v-if="defect.status == 'OPEN' && (user.role.toLowerCase() == 'admin' || user.role.toLowerCase() == 'facility coordinator')"
        @click="updateStatus('IN_PROGRESS')"
        class="status-btn"
      >Start processing</v-btn>
      <v-btn
        tile
        color="rgb(226, 6, 19, 0.85)"
        dark
        v-if="defect.status == 'IN_PROGRESS' && (user.role.toLowerCase() == 'admin' || user.role.toLowerCase() == 'facility coordinator')"
        @click="updateStatus('PASSED_TO_PROVINCE')"
        class="status-btn"
      >Pass</v-btn>
      <v-btn
        tile
        color="rgb(226, 6, 19, 0.85)"
        dark
        v-if="defect.status == 'IN_PROGRESS' && (user.role.toLowerCase() == 'admin' || user.role.toLowerCase() == 'facility coordinator')"
        @click="updateStatus('PROCESS_BY_AP')"
        class="status-btn"
      >Pick up</v-btn>
      <v-btn
        tile
        color="rgb(226, 6, 19, 0.85)"
        dark
        v-if="(defect.status == 'PROCESS_BY_AP' || defect.status == 'PASSED_TO_PROVINCE') && (user.role.toLowerCase() == 'admin' || user.role.toLowerCase() == 'facility coordinator')"
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
                  v-if="dialogexternalemailpopup == true"
                  :external="item"
                  :user="user"
                  :selecteditemprop="defectid"
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
        v-if="defect.status == 'PROCESS_BY_AP' && (user.role.toLowerCase() == 'admin' || user.role.toLowerCase() == 'facility coordinator')"
        @click="dialogAssign = true"
        class="status-btn"
      >Assign AP employee</v-btn>
      <assign-defect-detail
        v-if="dialogAssign"
        :itemid="defect.id"
        @apAssignClosed="emitStatusChanged"
      />
      <v-btn
        tile
        color="rgb(226, 6, 19, 0.85)"
        dark
        @click="dialog = true"
        v-if="(defect.status == 'EXECUTING_BY_AP' || defect.status == 'EXECUTING_BY_EXTERNAL') && ((user.role.toLowerCase() == 'admin' || user.role.toLowerCase() == 'facility coordinator') || user.id === defect.fixerid)"
        class="status-btn"
      >Complete</v-btn>
      <v-btn
        tile
        color="rgb(226, 6, 19, 0.85)"
        dark
        v-if="(defect.status == 'PROCESS_BY_AP' || defect.status == 'PASSED_TO_PROVINCE') && (user.role.toLowerCase() == 'admin' || user.role.toLowerCase() == 'facility coordinator')"
        @click="dialogCancel = true"
        class="status-btn"
      >CANCEL</v-btn>
    </div>

    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="headline">WARNING</span>
        </v-card-title>
        <v-card-text>Are you sure you want to mark the defect as complete?</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red darken-1" text @click="dialog = false">No</v-btn>
          <v-btn color="red darken-1" text @click="updateStatus('COMPLETE')">Yes</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogCancel" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="headline">WARNING</span>
        </v-card-title>

        <v-card-text>Are you sure you want to cancel the defect?</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red" text @click="updateStatus('CANCELED'), dialogCancel = false">Yes</v-btn>
          <v-btn color="red" text @click="dialogCancel = false">No</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import api from "../backend-api";
import ExternalEmailDialog from "../GeneralComponents/ExternalEmailDialog.vue";
import AssignDefectDetail from "./AssignDefectDetail.vue";

export default {
  name: "StatusSection",
  components: {
    ExternalEmailDialog,
    AssignDefectDetail
  },
  props: ["user"],
  data() {
    return {
      defect: "",
      status: "",
      dialogCancel: false,
      dialog: false,
      dialogexternal: false,
      dialogAssign: false,
      externals: [],
      dialogexternalemailpopup: false,
      defectid: this.$route.params.id
    };
  },
  methods: {
    updateStatus(status) {
      api.updateStatusOfDefect(status, this.$route.params.id).then(response => {
        if (response.status == 201) {
          this.emitStatusChanged();
          this.dialog = false;
        }
      });
    },
    emitStatusChanged() {
      this.$emit("statusChanged");
      this.dialogexternalemailpopup = false;
    },
    openExternalDialog() {
      this.dialogexternalemailpopup = true;
      this.item = null;
    }
  },
  mounted() {
    api.getDefect(this.$route.params.id).then(response => {
      this.defect = response.data;
    });
    api.getStatusForDefect(this.$route.params.id).then(response => {
      this.status = response.data;
    });
    api.getExternals().then(response => {
      this.externals = response.data;
    });
  }
};
</script>

<style scoped>
.status-btn {
  margin: 10px;
}
.externalemaildialog {
  position: absolute;
}
</style>