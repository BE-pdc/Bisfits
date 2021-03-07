<template>
  <div>
    <h1 class="display-2 text-center">What can we help you with?</h1>
    <v-expansion-panels class="helppanel" :hover="hover">
      <v-expansion-panel v-for="(item, i) in helpitems" :key="i">
        <v-expansion-panel-header>{{ item.title }}</v-expansion-panel-header>
        <v-expansion-panel-content v-if="item.title == 'Assigning defect/task to AP user'">
          <h5>Step 1: Admin Overview</h5>
          <p>
            First of all you need to go to the admin overview page. If you want
            to assign a task to a AP user you will need to go to the 'Task' tab.
            Otherwise you can choose between the 'All defects', 'Assigned
            defects' and 'Unassigned defects' tabs. You can reassign an other
            user to a defect/task but you can not reassign the same person to a
            defect/task.
          </p>
          <h5>Step 2: Assign button</h5>
          <p>
            To assign a defect/task, you will first need to search for the right
            defect/task. Once you found it you can click on the assign button of
            the right row. Select the AP user you want to assign the defect/task
            to. You can reassign an other user to a defect/task but you can not
            reassign the same person to a defect/task.
          </p>
        </v-expansion-panel-content>

        <v-expansion-panel-content v-if="item.title == 'Assigning defect/task to external user'">
          <h5>Step 1: Admin Overview</h5>
          <p>
            You will need to go to the details page of the defect/task you want
            to assign to an external
          </p>
          <h5>Step 2: Assign external button</h5>
          <p>
            When you press the assign to external button you can select from the
            list of externals who you would like to assign it to. When you
            select the external you can automaticly send a mail to the external.
          </p>
        </v-expansion-panel-content>

        <v-expansion-panel-content v-if="item.title == 'Creating a new defect/task'">
          <h5>Step 1: Plus Button</h5>
          <p>
            You can find the plus button on the admin overview or on the
            homepage. There you can make a choice between creating a new task or
            a new defect.
          </p>
          <h5>Step 2: Fill out the form</h5>
          <p>
            Filling in the form is not very hard. Where you see the '0 / 25' you
            can not type in more then 25 characters. Before you can choose a
            room you need to select a campus. If the defect or task is not in a
            room you can select the 'nearby' and write in the description
            exectly where you meant.
          </p>
          <h5>Step 3: Photo</h5>
          <p>
            When you create a defects you can also send in picture with it. You
            can upload it by clicking on the bottom left button of the dialog
            saying: 'add picture'.
          </p>
        </v-expansion-panel-content>

        <v-expansion-panel-content v-if="item.title == 'Creating a new external'">
          <h5>Step 1: Users page</h5>
          <p>
            When creating a new external you need to be in the users page. It
            does not matter if are in the users tab or the external tab. In the
            bottom right corner is a red plus button. This is the button that
            creates a new external
          </p>
          <h5>Step 2: Fill out the form</h5>
          <p>Now just fill out the form and you are done!</p>
        </v-expansion-panel-content>

        <v-expansion-panel-content v-if="item.title == 'How to archive a defect'">
          <h5>Step 1: Admin Overview</h5>
          <p>
            The defect is archived when it has the status 'complete' or the
            status 'cancelled'. To archive a defect or a task you will need to
            change the status.
          </p>
          <h5>Step 2: Changing status</h5>
          <p>
            When you click on a defect or task you can see the details of the
            defect or the task. If the defect/task is open you can only change
            the status to cancelled. After it is assigned you can still cancel a
            defect/task but you can also go though all the statussen until it is
            completed.
          </p>
        </v-expansion-panel-content>

        <v-expansion-panel-content v-if="item.title == 'How to change the role of a AP user'">
          <h5>Step 1: User page</h5>
          <p>
            To edit the role of a user you will need to go to the users page.
            Make sure you are in the 'user' tab. Look for the user who's role
            you would like to edit.
          </p>
          <h5>Step 2: Edit</h5>
          <p>
            Click on the edit role button and select the role you want give the
            user.
          </p>
          <h5>Step 3: Admin</h5>
          <p>
            it is possible to make multiple people admin. But there always needs
            to be one admin.
          </p>
        </v-expansion-panel-content>
        <v-expansion-panel-content v-if="item.title == 'How to see/add/delete rooms'">
          <h5>Step 1: Admin Settings</h5>
          <p>
            First you have to go to the admin settings page. You can access this
            page by opening the menubar and there you will find the admin
            settings page link. When you are on the page you can see different
            menu items, here you can choose which item you want to see.
          </p>
          <h5>Step 2: Add a room</h5>
          <p>
            When you click on campuses you can see the list of campuses and if
            you click on those you can see all the rooms that are available in
            that specific campus. Next to the campus there is a plus button,
            with this button you can add a room to the selected campus .
          </p>
          <h5>Step 3: Delete a room</h5>
          <p>
            In every room there is a bin icon, with this icon you can delete the
            wanted room.
          </p>
        </v-expansion-panel-content>
        <v-expansion-panel-content v-if="item.title == 'How to see/add/delete emergency contacts'">
          <h5>Step 1: Admin Settings</h5>
          <p>
            First you have to go to the admin settings page. You can access this
            page by opening the menubar and there you will find the admin
            settings page link. When you are on the page you can see different
            menu items, here you can choose which item you want to see.
          </p>
          <h5>Step 2: Add a emergency contact</h5>
          <p>
            When you click on emergency numbers you can see the list of the
            different compartments and if you click on those you can see all the
            emergency numbers in that specific compartment. Next to the
            compartments there is a plus button, with this button you can add an
            emergency number to the selected compartment .
          </p>
          <h5>Step 3: Delete a emergency contact</h5>
          <p>
            Every emergency number has a pencil and a bin icon. With these icons
            you can edit or delete the selected emergency number.
          </p>
        </v-expansion-panel-content>
        <v-expansion-panel-content v-if="item.title == 'How to see/add/delete categories'">
          <h5>Step 1: Admin Settings</h5>
          <p>
            First you have to go to the admin settings page. You can access this
            page by opening the menubar and there you will find the admin
            settings page link. When you are on the page you can see different
            menu items, here you can choose which item you want to see.
          </p>
          <h5>Step 2: Add category</h5>
          <p>
            When you click on categories you can see the list of main categories
            and if you click on those you can see the sub categories. Next to
            the main categories there is a plus button, with this button you can
            add a sub category to the selected main category .
          </p>
          <h5>Step 3: Delete category</h5>
          <p>
            In every sub category there is a bin icon, with this icon you can
            delete the wanted category.
          </p>
        </v-expansion-panel-content>
        <v-expansion-panel-content v-if="item.title == 'How to edit email templates'">
          <h5>Step 1: Admin Settings</h5>
          <p>
            First you have to go to the admin settings page. You can access this
            page by opening the menubar and there you will find the admin
            settings page link. When you are on the page you can see different
            menu items, here you can choose which item you want to see.
          </p>
          <h5>Step 2: Edit template</h5>
          <p>
            When you click on email templates you can see the list of the
            different email templates. When you click on the pencil you can edit
            the template. When you clicked on the pencil you get to see
            different buttons that stand for an object that get filled in when
            the mail gets send. When you are done editing you can save the
            template by clicking on save or discarding if you don’t want to save
            your changes.
          </p>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>

<script>
export default {
  props: ["user"],
  data() {
    return {
      helpitems: []
    };
  },
  methods: {
    help() {
      if (this.user.role == "Facility Coordinator") {
        this.helpitems = [
          {
            title: "Assigning defect/task to AP user"
          },
          {
            title: "Assigning defect/task to external user"
          },
          {
            title: "Creating a new defect/task"
          }
        ];
      } else if (this.user.role == "Facility Employee") {
        this.helpitems = [
          {
            title: "Creating a new defect/task"
          }
        ];
      } else if (this.user.role == "Logistic Coordinator") {
        this.helpitems = [
          {
            title: "Assigning defect/task to AP user"
          },
          {
            title: "Assigning defect/task to external user"
          },
          {
            title: "Creating a new defect/task"
          }
        ];
      } else if (this.user.role == "Logistic Employee") {
        this.helpitems = [
          {
            title: "Creating a new defect/task"
          }
        ];
      } else if (this.user.role == "Department Head") {
        this.helpitems = [
          {
            title: "Creating a new defect/task"
          }
        ];
      } else if (this.user.role == "Employee") {
        this.helpitems = [
          {
            title: "Creating a new defect/task"
          }
        ];
      } else {
        this.helpitems = [
          {
            title: "Assigning defect/task to AP user"
          },
          {
            title: "Assigning defect/task to external user"
          },
          {
            title: "Creating a new defect/task"
          },
          {
            title: "Creating a new external"
          },
          {
            title: "How to archive a defect"
          },
          {
            title: "How to change the role of a AP user"
          },
          {
            title: "How to see/add/delete categories"
          },
          {
            title: "How to see/add/delete rooms"
          },
          {
            title: "How to see/add/delete emergency contacts"
          },
          {
            title: "How to edit email templates"
          }
        ];
      }
    }
  },
  mounted() {
    this.help();
  }
};
</script>

<style lang="scss" scoped>
p {
  font-size: small;
}
.helppanel {
  padding-left: 10%;
  padding-right: 10%;
  padding-top: 2%;
  width: 100%;
}

v-expansion-panel {
  padding-left: 10%;
  padding-right: 10%;
  padding-top: 2%;
}
</style>
