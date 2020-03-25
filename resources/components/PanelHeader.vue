<template>
<div>
<v-toolbar
  flat
  short
  class="hidden-sm-and-down"
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

<v-bottom-navigation 
  app
  grow
  class="hidden-md-and-up"
>
  <v-btn
    :href="helpLink"
    target="_blank"
  >
    <span>{{ $t('common.help') }}</span>
    <v-icon>mdi-help-circle</v-icon>
  </v-btn>

  <v-btn
    :loading="loadingReset"
    @click="$emit('reset')"	
  >
    <span>{{ $t('common.reset') }}</span>
    <v-icon>mdi-alert-circle</v-icon>
  </v-btn>

  <v-btn
    :loading="loadingUpdate"
    @click="$emit('save')"
  >
    <span>{{ $t('common.save') }}</span>
    <v-icon>mdi-content-save</v-icon>
  </v-btn>
</v-bottom-navigation>
</div>
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