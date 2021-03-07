<template>
  <v-layout column class="comments">
    <v-layout class="comment" row v-for="comment in postedComments" :key="comment.id">
      <comment :user="user" :comment="comment" @commentAddedOrDeleted="getCommentsForDefect" />
    </v-layout>

    <v-layout class="add-comment" l12 md12 sm12 xs12 align-end>
      <v-flex lg11>
        <v-textarea
          ref="comment"
          label="Leave a comment"
          rows="2"
          color="red"
          v-model="comment"
          :rules="rulesComment"
        ></v-textarea>
      </v-flex>
      <v-flex class="comment-send-btn" lg1>
        <v-btn @click="postComment" medium color="red">Send</v-btn>
      </v-flex>
    </v-layout>
  </v-layout>
</template>

<script>
import api from "../backend-api.js";
import Comment from "./Comment.vue";

export default {
  name: "CommentSection",
  props: ["user"],
  data() {
    return {
      postedComments: [],
      comment: "",
      rulesComment: [v => !!v || "Comment cannot be empty"],
      commentsloading: false
    };
  },
  components: {
    Comment
  },
  methods: {
    postComment() {
      if (this.$refs.comment.validate()) {
        api
          .postComment(this.$route.params.id, this.comment, this.user.id)
          .then(() => {
            this.getCommentsForDefect();
            this.$refs.comment.reset();
          });
      }
    },
    getCommentsForDefect() {
      api.getCommentsForDefect(this.$route.params.id).then(response => {
        this.postedComments = response.data;
      });
    }
  },
  mounted() {
    this.getCommentsForDefect();
  }
};
</script>

<style scoped>
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
