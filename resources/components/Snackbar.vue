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
    >{{ icons.mdiAlertCircle }}</v-icon>

    <v-icon
      v-if="type === 'error'"
      color="error"
      left
    >{{ icons.mdiAlert }}</v-icon>

    <v-icon
      v-if="type === 'warning'"
      color="warning"
      left
    >{{ icons.mdiExclamationThick }}</v-icon>

    <v-icon
      v-if="type === 'success'"
      color="success"
      left
    >{{ icons.mdiCheck }}</v-icon>

    {{ message }}
    
    <v-btn
      icon
      color="white"
      @click="close"
    >
      <v-icon>{{ icons.mdiClose }}</v-icon>
    </v-btn>
  </v-snackbar>
</template>

<script>
import {
  mdiAlertCircle,
  mdiAlert,
  mdiExclamationThick,
  mdiCheck,
  mdiClose
} from '@mdi/js'

export default {
  props: ['type', 'message'],

  data: () => ({
    icons: {
      mdiAlertCircle,
      mdiAlert,
      mdiExclamationThick,
      mdiCheck,
      mdiClose
    }
  }),

  methods: {
    close () {
      this.$destroy()
    }
  }
}
</script>