<template>
  <v-layout>
    <v-flex lg1 md2 sm1 xs2>
      <v-avatar color="red">
        <span class="white--text headline">{{ nameToInitials(commentername) }}</span>
      </v-avatar>
    </v-flex>
    <v-flex class="comment-content" lg11 md10 sm11 xs10>
      <v-flex class="comment-poster-date">
        <span class="comment-poster">{{ commentername }}</span>
        <v-icon>mdi-circle-small</v-icon>
        <span class="comment-date">{{ getFormattedTime(comment) }}</span>
        <v-icon
          v-if="checkIfCreator(comment.metaData.creatorid)"
          medium
          class="deletecomment"
          @click.stop="deleteComment(comment.id)"
        >mdi-delete</v-icon>
      </v-flex>
      <v-flex>
        <p>{{ comment.text }}</p>
      </v-flex>
    </v-flex>
  </v-layout>
</template>

<script>
import api from "../backend-api.js";

export default {
  props: ["comment", "user"],
  data() {
    return {
      commentername: "",
      userPhoto: ""
    };
  },

  methods: {
    getFormattedTime(postedComment) {
      let temp = postedComment.metaData.date;
      let newDate = temp.slice(0, 19).replace("T", " ");

      return newDate;
    },
    checkIfCreator(commenterid) {
      if (commenterid === this.user.id) {
        return true;
      }
    },
    getUserName(userid) {
      api.getUser(userid).then(response => {
        this.commentername =
          response.data.firstname + " " + response.data.lastname;
      });
    },
    nameToInitials(fullName) {
      const namesArray = fullName.split(" ");
      if (namesArray.length === 1) return `${namesArray[0].charAt(0)}`;
      else
        return `${namesArray[0].charAt(0)}${namesArray[
          namesArray.length - 1
        ].charAt(0)}`;
    },
    emitCommentAddedOrDeleted() {
      this.$emit("commentAddedOrDeleted");
    },
    deleteComment(id) {
      api.deleteComment(id).then(response => {
        if (response.status == 204) {
          this.emitCommentAddedOrDeleted();
        }
      });
    }
  },
  mounted() {
    this.getUserName(this.comment.metaData.creatorid);
    this.$msal.acquireToken().then(res => {
      var ref = this;
      setTimeout(() => {}, 1000);
      this.$msal
        .msGraph([
          {
            url: "/me/photo/$value",
            responseType: "blob",
            headers: {
              Authorization: `Bearer ${res}`
            }
          }
        ])
        .then(res => {
          if (res[0].status === 404) {
            ref.userPhoto = "";
          } else {
            ref.userPhoto = res[0].body;
          }
        });
    });
  }
};
</script>

<style lang="scss" scoped>
.comment-date {
  color: gray;
  font-weight: bold;
  font-size: small;
}
.comments {
  padding: 12px;
}

.comment {
  margin: 0 0 20px 0;
}

.comment-content {
  padding-left: 5px;
}

.comment-poster {
  font-weight: bold;
}

.comment-poster-date {
  margin-bottom: 3px;
}

.add-comment {
  padding: 0 15px;
}

.comment-send-btn {
  margin: 20px;
}

.comment-send-btn * {
  color: #fff;
}

.deletecomment {
  padding-left: 2%;
}

@media only screen and (max-width: 600px) {
  .comment-content {
    padding-left: 15px;
  }
}
</style>