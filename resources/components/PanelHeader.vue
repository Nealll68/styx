<template>
<v-banner
  app
  sticky
>
  <slot></slot>
  
  <template v-slot:actions>
    <v-btn
      v-if="helpLink"
      :icon="$vuetify.breakpoint.xsOnly"
      color="tertiary"
      text
      :href="helpLink"
      target="_blank"
    >
      <v-icon :left="$vuetify.breakpoint.smAndUp">mdi-help-circle</v-icon>{{ $vuetify.breakpoint.xsOnly ? '' : $t('common.help') }}
    </v-btn>

    <v-btn
      :icon="$vuetify.breakpoint.xsOnly"
      color="quaternary"
      text
      :loading="loadingReset"
      @click="$emit('reset')"	
    >
      <v-icon :left="$vuetify.breakpoint.smAndUp">mdi-alert-circle</v-icon>{{ $vuetify.breakpoint.xsOnly ? '' : $t('common.reset') }}			
    </v-btn>

    <v-btn
      :icon="$vuetify.breakpoint.xsOnly"
      color="primary"
      text
      :loading="loadingUpdate"
      @click="$emit('save')"
    >
      <v-icon :left="$vuetify.breakpoint.smAndUp">mdi-content-save</v-icon>{{ $vuetify.breakpoint.xsOnly ? '' : $t('common.save') }}
    </v-btn>
  </template>
</v-banner>
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