<template>
  <div>
    <v-card>
      <v-container>
        <v-row>
          <v-col
          v-for="(chip, i) in chips"
          :key="i"
          class="shrink"
          >
            <v-chip
              label
              @click="insertText(chip.text)"
            >
              {{ chip.name }}
            </v-chip>
          </v-col>
        </v-row>
        <v-textarea
          name="input-7-1"
          filled
          label="Label"
          auto-grow
          v-model="templatetext"
          id="inputtextfield"
        ></v-textarea>
      </v-container>
    </v-card>
  </div>
</template>

<script>
export default {
  name: 'EmailTemplate',
  data () {
    return {
      chips: [
        {name: 'Name', text: '[[name]]'},
        {name: 'Defect', text: '[[defect]]'},
        {name: 'Task', text: '[[task]]'}
        ],
      templatetext: "Hello, how are you? \n\nI've been testing and trying this out for quite some time now :D.",
      buttontext: "[[test.text]]",
    }
  },
  methods: {
    insertText(text){
      let start = document.getElementById("inputtextfield").selectionStart;
      let end = document.getElementById("inputtextfield").selectionEnd;
      this.templatetext = this.templatetext.substring(0, start) + text + this.templatetext.substring(end);
    }
  }
}
</script>

<style>

</style>