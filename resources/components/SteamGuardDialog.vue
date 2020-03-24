<template>
  <v-dialog
  value="true"
  max-width="300px"
  persistent
>
  <v-card>
    <v-card-title>Steam Guard</v-card-title>

    <v-divider></v-divider>

    <v-card-text class="mt-2 pb-0">
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

    <v-divider></v-divider>

    <v-card-actions>
      <v-spacer></v-spacer>
      
      <v-btn
        text
        @click="closeDialog()"
      >{{ $t('common.cancel') }}</v-btn>

      <v-btn
        depressed
        color="primary"
        @click="sendCode()"
      >{{ $t('common.contiue') }}</v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>
</template>

<script>
export default {
  data () {
    return {
      value: '',
      formValid: false,
      requiredRule: [
        v => !!v || this.$t('rules.required')
      ]
    }
  },

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