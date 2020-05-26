<template>
<v-dialog
  value="true"
  max-width="300px"
  persistent
>
  <v-card>
    <v-progress-linear
      :value="100"
      color="primary"
    ></v-progress-linear>

    <v-card-title primary-title>
      <v-icon left>{{ mdiSteam }}</v-icon> Steam Guard
    </v-card-title>

    <v-card-text>
      <v-form
        v-model="formValid"
        ref="guardForm"
      >
        <v-text-field
          v-model="value"
          filled
          label="Steam Guard"
          :rules="requiredRule"
        ></v-text-field>
      </v-form>      
    </v-card-text>

    <v-card-actions>
      <v-spacer></v-spacer>
      
      <v-btn
        text
        @click="closeDialog()"
      >{{ cancelBtnText }}</v-btn>

      <v-btn
        color="primary"
        @click="sendCode()"
      >{{ continueBtnText }}</v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>
</template>

<script>
import { mdiSteam } from '@mdi/js'

export default {
  props: ['continueBtnText', 'cancelBtnText', 'requiredRuleText', ],

  data: () => ({
    value: '',
    formValid: false,
    requiredRule: [
      v => !!v || this.requiredRuleText
    ],
    mdiSteam
  }),

  methods: {
    sendCode () {
      if (this.$refs.guardForm.validate()) {
        this.$emit('steam-guard', this.guard)
        this.$destroy()
      }  
    },

    closeDialog () {
      this.value = ''
      this.$destroy()
    }
  }
}
</script>