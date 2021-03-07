<!--To use this component simply import it and reference "<photo-creator v-on:change-photo="changePhoto" />" in the parent component (make sure to write the changePhoto method!)
If you want to get the actual image from the get request use "this.loadedImage = resonse.data.image.data" to get the base64 string and "<img v-bind:src="'data:image/png;base64,'+loadedImage" />" for the front end-->
<template>
  <div>
    <v-btn class="addimagebtn" :loading="isSelecting" @click="onButtonClick">
      <v-icon left>cloud_upload</v-icon>
      {{ buttonText }}
    </v-btn>
    <input ref="uploader" class="d-none" type="file" accept="image/*" @change="onFileChanged" />
  </div>
</template>

<script>
export default {
  name: "PhotoCreator",

  data: () => ({
    defaultButtonText: "ADD PICTURE",
    selectedFile: null,
    isSelecting: false
  }),
  computed: {
    buttonText() {
      return this.selectedFile
        ? this.selectedFile.name.substring(0, 10)
        : this.defaultButtonText;
    }
  },
  methods: {
    checkMobile() {
      if (
        navigator.userAgent.match(/Android/i) ||
        navigator.userAgent.match(/webOS/i) ||
        navigator.userAgent.match(/iPhone/i) ||
        navigator.userAgent.match(/iPad/i) ||
        navigator.userAgent.match(/iPod/i) ||
        navigator.userAgent.match(/BlackBerry/i) ||
        navigator.userAgent.match(/Windows Phone/i)
      ) {
        return true;
      }
      return false;
    },
    onButtonClick() {
      this.isSelecting = true;
      window.addEventListener(
        "focus",
        () => {
          this.isSelecting = false;
        },
        { once: true }
      );
      this.$refs.uploader.click();

      if (this.checkMobile()) {
        this.isSelecting = false;
      }
    },
    onFileChanged(e) {
      this.selectedFile = e.target.files[0];
      this.$emit("change-photo", this.selectedFile);
    }
  }
};
</script>

<style>
.addimgbtn {
  color: rgba(226, 6, 19, 0.85) !important;
}
</style>
