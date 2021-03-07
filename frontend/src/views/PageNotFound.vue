<template>
<v-container
    class="text-center"
    fill-height
    style="height: calc(100vh - 58px);"
  >
    <v-row align="center">
      <v-col>
        <h1 class="display-2">Whoops, 404</h1>
        <p class="text404 ">It seems you took a wrong turn somewhere!</p>
        <v-btn
          :to="`/`"
          color="#e62a35"
          id="backbutton"
        >
          Get me out of here!
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.card404 {
  max-width: 10vw;
}
#backbutton {
  color: white;
}
.text404 {
  font-weight: bold;
}
</style>