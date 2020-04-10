<template>
  <v-snackbar
    :value="true"
    :timeout="6000"
    top
  >
    <v-icon
      v-if="type === 'info'"
      color="info"
      left
    >mdi-alert-circle</v-icon>

    <v-icon
      v-if="type === 'error'"
      color="error"
      left
    >mdi-alert</v-icon>

    <v-icon
      v-if="type === 'warning'"
      color="warning"
      left
    >mdi-exclamation-thick</v-icon>

    <v-icon
      v-if="type === 'success'"
      color="success"
      left
    >mdi-check</v-icon>

    {{ message }}
    
    <v-btn
      icon
      color="white"
      @click="close"
    >
      <v-icon>mdi-close</v-icon>
    </v-btn>
  </v-snackbar>
</template>

<script>
export default {
  props: ['type', 'message'],

  methods: {
    close () {
      this.$destroy()
    }
  }
}
</script>