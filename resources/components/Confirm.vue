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
        >{{ icons.mdiAlert }}</v-icon>

        <v-icon 
          v-if="type === 'warning'"
          left
          color="warning"
        >{{ icons.mdiExclamationThick }}</v-icon>
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
        >{{ cancelBtnText }}</v-btn>

        <v-btn
          :color="type"
          @click="confirm"
        >{{ continueBtnText }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import {
  mdiAlert,
  mdiExclamationThick
} from '@mdi/js'

export default {
  props: ['type', 'title', 'message', 'continueBtnText', 'cancelBtnText'],

  data: () => ({
    value: false,
    icons: {
      mdiAlert,
      mdiExclamationThick
    }
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