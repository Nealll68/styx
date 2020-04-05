<template>
  <v-card>
    <template v-if="logs">
      <v-card-title>
        <v-icon left>mdi-post</v-icon>{{ logs.filename }}
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          text
          @click="downloadLog(logs.profileName, logs.filename)"
        >
          <v-icon left>mdi-download</v-icon>{{ $t('common.download') }}
        </v-btn>
      </v-card-title>

      <v-card-text>
        <v-sheet
          color="grey darken-4" 
          class="pa-2 scrollbar"
          max-height="700px"
        >
          <div 
            v-for="(log, i) of logs.logs"
            :key="i"
            class="my-2"
          >
            {{ log }}
          </div>
        </v-sheet>           
      </v-card-text>
    </template>

    <v-card-text v-else>
      <v-alert
        type="info"
        border="left"
        text
      >{{ $t('logs.filterInfo') }}</v-alert>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  layout: 'demeter'
}
</script>