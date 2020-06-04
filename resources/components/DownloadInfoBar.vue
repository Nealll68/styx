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
            <v-icon>{{ icon }}</v-icon>
            {{ title }}
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
              >{{ icons.mdiDownloadOff }}</v-icon>
              {{ $vuetify.breakpoint.smAndDown ? '' : $t('common.cancel') }}
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </v-footer>
</template>

<script>
import {
  mdiDownload,
  mdiDownloadOff,
  mdiFolderZip
} from '@mdi/js'

export default {
  data: () => ({
    loadingCancel: false,
    icons: {
      mdiDownload,
      mdiDownloadOff,
      mdiFolderZip
    }
  }),

  computed: {
    title () {
      if (this.$store.state.downloadInfo.type === 'downloadMission' || this.$store.state.downloadInfo.type === 'zipExtract') {
        return this.$t(`download.${this.$store.state.downloadInfo.type}`)
      } else {
        return this.$t(`download.${this.$store.state.downloadInfo.type}`, {
          name: this.$store.state.downloadInfo.title
        })
      }
    },

    icon () {
      return this.$store.state.downloadInfo.type === 'zipExtract' ? this.icons.mdiDownload : this.icons.mdiFolderZip
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
