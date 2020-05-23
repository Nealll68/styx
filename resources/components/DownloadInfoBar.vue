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
            <v-icon>mdi-download</v-icon>
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
              :disabled="$store.state.downloadInfo.type === 'downloadMission'"
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
  <!--<div>
    <v-system-bar
      v-if="$store.state.downloadInfo.type"
      app
      fixed
      window
      color="grey darken-4"
    >
      <v-container fluid>
        <v-row 
          align="center" 
          justify="center"
          column
        >
          <v-col class="text-truncate">
            <v-icon>mdi-download</v-icon>
            {{ $store.state.downloadInfo.title }}
          </v-col>

          <v-col>
            <v-progress-linear indeterminate></v-progress-linear>
          </v-col>

          <v-col>
            <v-btn
              :icon="$vuetify.breakpoint.smAndDown"
              text
              color="error"
              class="float-right"
              @click="cancel()"
              :loading="loadingCancel"
              :disabled="$store.state.downloadInfo.type === 'downloadMission'"
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
    </v-system-bar>
  </div>-->
</template>

<script>
export default {
  data() {
    return {
      loadingCancel: false
    }
  },

  methods: {
    async cancel() {
      this.loadingCancel = true

      await this.$axios.$get('server/download/cancel')

      this.loadingCancel = false
    }
  }
}
</script>
