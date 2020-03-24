<template>
  <v-toolbar
  flat
  short
>
  <v-spacer></v-spacer>

  <v-btn
    color="tertiary"
    text
    :href="helpLink"
    target="_blank"
  >
    <v-icon left>mdi-help-circle</v-icon>{{ $t('common.help') }}
  </v-btn>

  <v-btn
    color="quaternary"
    text
    :loading="loadingReset"
    @click="$emit('reset')"	
  >
    <v-icon left>mdi-alert-circle</v-icon>{{ $t('common.reset') }}			
  </v-btn>

  <v-btn
    color="primary"
    text
    :loading="loadingUpdate"
    @click="$emit('save')"
  >
    <v-icon left>mdi-content-save</v-icon>{{ $t('common.save') }}
  </v-btn>
</v-toolbar>
</template>

<script>
export default {
  props: [
    'helpLink',
    'loadingReset',
    'loadingUpdate'
  ]
}
</script>