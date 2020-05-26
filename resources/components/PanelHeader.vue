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
      <v-icon :left="$vuetify.breakpoint.smAndUp">{{ icons.mdiHelpCircle }}</v-icon>{{ $vuetify.breakpoint.xsOnly ? '' : $t('common.help') }}
    </v-btn>

    <v-btn
      :icon="$vuetify.breakpoint.xsOnly"
      color="quaternary"
      text
      :loading="loadingReset"
      @click="$emit('reset')"
      :disabled="disabled"	
    >
      <v-icon :left="$vuetify.breakpoint.smAndUp">{{ icons.mdiAlertCircle }}</v-icon>{{ $vuetify.breakpoint.xsOnly ? '' : $t('common.reset') }}			
    </v-btn>

    <v-btn
      :icon="$vuetify.breakpoint.xsOnly"
      color="primary"
      text
      :loading="loadingUpdate"
      @click="$emit('save')"
      :disabled="disabled"
    >
      <v-icon :left="$vuetify.breakpoint.smAndUp">{{ icons.mdiContentSave }}</v-icon>{{ $vuetify.breakpoint.xsOnly ? '' : $t('common.save') }}
    </v-btn>
  </template>
</v-banner>
</template>

<script>
import {
  mdiHelpCircle,
  mdiAlertCircle,
  mdiContentSave
} from '@mdi/js'

export default {
  props: [
    'helpLink',
    'loadingReset',
    'loadingUpdate',
    'disabled'
  ],

  data: () => ({
    icons: {
      mdiHelpCircle,
      mdiAlertCircle,
      mdiContentSave
    }
  })
}
</script>