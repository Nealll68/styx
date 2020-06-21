<template>
  <v-footer
    v-if="$store.state.downloadInfo.type"
    app
    padless
  >
    <v-card 
      flat
      tile
      width="100%"
    >
      <v-progress-linear
        indeterminate
        buffer-value="0"
      ></v-progress-linear>

      <v-container class="app-container">
        <v-row>
          <v-col class="text-truncate">
            <v-icon>{{ $store.state.downloadInfo.type === 'zipExtract' ? 'mdi-download' : 'mdi-folder-zip' }}</v-icon>
            {{ $store.state.downloadInfo.title }}
          </v-col>

          <v-col class="d-flex justify-end">
            <v-btn
              :icon="$vuetify.breakpoint.smAndDown"
              outlined
              color="error"
              class="float-right"
              @click="cancel()"
              :loading="loadingCancel"
              :disabled="$store.state.downloadInfo.type === 'downloadMission' || $store.state.downloadInfo.type === 'zipExtract'"
            >
              <v-icon 
                :left="$vuetify.breakpoint.mdAndUp"
                color="error"
              >mdi-download-off</v-icon>
              {{ $vuetify.breakpoint.smAndDown ? '' : $t('common.cancel') }}
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </v-footer>
</template>

<script>
export default {
  data: () => ({
    loadingCancel: false
  }),

  methods: {
    async cancel() {
      this.loadingCancel = true

      await this.$axios.$get('server/download/cancel')

      this.loadingCancel = false
    }
  }
}
</script>
