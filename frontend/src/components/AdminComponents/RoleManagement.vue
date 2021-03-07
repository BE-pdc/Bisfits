<template>
  <v-container>
    <v-card>
      <div class="filter">
        <v-layout justify-space-around align-center wrap>
          <v-select
            mobile-breakpoint="750"
            clearable
            :items="roles"
            v-model="roleFilterSelected"
            label="Select role"
            item-text="rolename"
            single-line
            :return-object="false"
          ></v-select>
        </v-layout>
      </div>

      <div class="filter">
        <v-layout justify-space-around align-center wrap>
          <v-text-field
            v-model="search"
            mobile-breakpoint="750"
            append-icon="mdi-magnify"
            label="Search"
            single-line
            hide-details
            color="red"
          ></v-text-field>
        </v-layout>
      </div>

      <v-data-table
        :items="users"
        :headers="headers"
        :search="search"
        mobile-breakpoint="750"
        sort-by="role"
        item-key="id"
        class="elevation-1"
      >
        <template v-slot:item.actions="{ item }">
          <v-btn block tile color="rgb(225,6,19)" dark @click="editItem(item)">
            <v-icon dark style="padding-right: 10px;">mdi-pencil</v-icon>Edit
            role
          </v-btn>
        </template>
      </v-data-table>
    </v-card>

    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="headline">Edit Role</span>
        </v-card-title>

        <v-card-text>
          <v-text-field v-model="editedItem.firstname" label="firstname" readonly color="red"></v-text-field>
          <v-text-field v-model="editedItem.lastname" label="lastname" readonly color="red"></v-text-field>
          <v-text-field v-model="editedItem.email" label="email" readonly color="red"></v-text-field>
          <v-select
            :items="roles"
            v-model="editedItem.role"
            label="Select role"
            item-text="rolename"
            single-line
            :return-object="false"
            color="red"
          ></v-select>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red" text @click="close">Cancel</v-btn>
          <v-btn color="red" text @click="save">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogError" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="headline">Error</span>
        </v-card-title>

        <v-card-text>
          there always has to be atleast one person with the Admin
          role.
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="red"
            text
            @click="
              dialogError = false;
              dialog = false;
            "
          >Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import api from "../backend-api.js";
export default {
  name: "RoleManagement",
  data() {
    return {
      search: "",
      roles: [],
      users: [],
      adminCount: 1,
      roleFilterSelected: null,
      headers: [
        {
          text: "Email",
          align: "start",
          value: "email"
        },
        {
          text: "S/P Email",
          align: "start",
          value: "spEmail"
        },
        { text: "Firstname", value: "firstname" },
        { text: "Lastname", value: "lastname" },
        { text: "Role", value: "role", filter: this.roleFilter },
        { text: "", value: "actions" }
      ],
      dialog: false,
      dialogError: false,
      oldRole: "",
      editedIndex: -1,
      editedItem: {
        email: "",
        firstname: "",
        lastname: "",
        role: ""
      }
    };
  },
  mounted: function() {
    this.getRoles();
    this.getUsers();
    api.getAdminRoles().then(respons => {
      this.adminCount = respons.data;
    });
  },
  methods: {
    getUsers() {
      api
        .getUsers()
        .then(respons => {
          this.users = respons.data;
        })
        .catch(error => {
          console.error(error);
        });
    },
    getRoles() {
      api
        .getRoles()
        .then(respons => {
          this.roles = respons.data;
        })
        .catch(error => {
          console.error(error);
        });
    },
    roleFilter(value) {
      if (!this.roleFilterSelected) {
        return true;
      }
      return value === this.roleFilterSelected;
    },
    updateRole(id, role) {
      api.updateRole(id, role);
    },
    save() {
      if (this.oldRole === "Admin") {
        if (this.adminCount != 1) {
          this.updateRole(this.editedItem.id, this.editedItem.role);
          this.close();
          location.reload();
        } else {
          this.dialogError = true;
        }
      } else {
        this.updateRole(this.editedItem.id, this.editedItem.role);
        this.close();
        location.reload();
      }
    },
    close() {
      this.dialog = false;
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      }, 300);
    },
    editItem(item) {
      this.oldRole = item.role;
      this.editedIndex = this.users.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    }
  }
};
</script>

<style lang="scss" scoped>
.overview {
  background-color: rgba(255, 255, 255, 0.85);
  border-radius: 20px;
  width: 100%;
  margin: 20px auto;
}

.overview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  background-color: #e60005;
  color: #fff;
  padding: 5px 15px;
}
.filter {
  width: 90%;
  margin-left: 4%;
}
@media only screen and (max-width: 960px) {
  .filter {
    width: 90%;
    margin-left: 4%;
  }
}

@media only screen and (max-width: 600px) {
  .filter {
    width: 90%;
    margin-left: 4%;
  }
}

@media only screen and (max-width: 405px) {
}
</style>
