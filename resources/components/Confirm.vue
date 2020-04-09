<template>
  <v-dialog
    :value="true"
    max-width="500"
    persistent
  >
    <v-card>
      <v-progress-linear
        :value="100"
        :color="type"
      ></v-progress-linear>

      <v-card-title primary-title>
        <v-icon 
          v-if="type === 'error'"
          left
          color="error"
        >mdi-alert</v-icon>

        <v-icon 
          v-if="type === 'warning'"
          left
          color="warning"
        >mdi-exclamation-thick</v-icon>
        {{ title }}
      </v-card-title>

      <v-card-text>
        {{ message }}
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          text
          @click="close"
        >Cancel</v-btn>

        <v-btn
          :color="type"
          @click="confirm"
        >
          Continue
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: ['type', 'title', 'message'],

  data: () => ({
    value: false
  }),

  methods: {
    confirm () {
      this.value = true
      this.$destroy()
    },

    close () {
      this.$destroy()
    }
  }
}
</script>