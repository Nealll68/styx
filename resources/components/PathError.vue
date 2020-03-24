<template>
<v-container fluid>
  <v-alert
    prominent
    type="error"
    text
    outlined
  >
  <v-row align="center">
    <v-col class="grow">{{ $t('errors.undefinedPath') }}</v-col>
    <v-col class="shrink">
      <v-btn
        outlined
        color="error"
        nuxt
        to="/commander/settings"
      >{{ $t('menu.settings') }}</v-btn>
    </v-col>
    </v-row>
  </v-alert>
</v-container>
</template>