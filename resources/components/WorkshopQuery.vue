<template>
  <v-bottom-sheet v-model="show" @click:outside="$emit('close')">
    <v-sheet color="grey darken-4">
      <v-container class="app-container">
        <v-card color="transparent" flat>
          <v-card-title class="pb-0">
            <v-row>
              <v-col>
                <v-text-field
                  v-model="workshopId"
                  filled
                  :label="$t('workshop.idWorkshop')"
                  :prepend-inner-icon="icons.mdiPlusBox"
                ></v-text-field>
              </v-col>

              <v-col>
                <v-text-field
                  v-model="collectionId"
                  filled
                  :label="$t('workshop.idCollection')"
                  :prepend-inner-icon="icons.mdiPlusBoxMultiple"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-card-title>

          <v-card-text v-if="getDetailsLoading" class="text-center">
            <v-progress-circular
              indeterminate
              color="primary"
            ></v-progress-circular>
          </v-card-text>

          <v-card-text
            v-if="modsDetails.length > 0"
            style="max-height: 300px"
            class="scrollbar"
          >
            <v-list
              v-for="mod of modsDetails"
              :key="mod.publishedfileid"
              color="transparent"
            >
              <v-list-item>
                <v-list-item-avatar>
                  <v-img :src="mod.preview_url"></v-img>
                </v-list-item-avatar>

                <v-list-item-content>
                  <v-list-item-title>{{ mod.title }}</v-list-item-title>
                  <v-list-item-subtitle
                    >{{ $t('workshop.publishedAt') }}
                    {{ 
                      $moment
                        .unix(mod.time_created)
                        .format('ll')
                    }}</v-list-item-subtitle
                  >
                  <v-list-item-subtitle
                    >MàJ :
                    {{
                      $moment
                        .unix(mod.time_updated)
                        .format('lll')
                    }}</v-list-item-subtitle
                  >
                  <v-list-item-subtitle
                    >Taille :
                    {{ mod.file_size | formatBytes }}</v-list-item-subtitle
                  >
                </v-list-item-content>

                <v-list-item-action>
                  <v-btn
                    color="quaternary"
                    text
                    @click="
                      downloadInfo(
                        mod.publishedfileid,
                        mod.title,
                        mod.file_size,
                        mod.file_url,
                        mod.filename
                      )
                    "
                    :disabled="$store.state.downloadInfo.type ? true : false"
                  >
                    <v-icon left>{{ icons.mdiDownload }}</v-icon>{{ $t('common.download') }}
                  </v-btn>
                </v-list-item-action>
              </v-list-item>

              <v-divider inset></v-divider>
            </v-list>
          </v-card-text>
        </v-card>
      </v-container>
    </v-sheet>
  </v-bottom-sheet>
</template>

<script>
import {
  mdiPlusBox,
  mdiPlusBoxMultiple,
  mdiDownload
} from '@mdi/js'
import debounce from 'debounce'

export default {
  props: ['show'],

  data: () => ({
    getDetailsLoading: false,
    workshopId: null,
    collectionId: null,
    modsDetails: [],
    icons: {
      mdiPlusBox,
      mdiPlusBoxMultiple,
      mdiDownload
    }
  }),

  watch: {
    workshopId() {
      this.getWorkshopDetails()
    },

    collectionId() {
      this.getCollectionDetails()
    }
  },

  methods: {
    downloadInfo(workshopId, title, fileSize, fileUrl, filename) {
      this.$emit('download-info', {
        workshopId,
        title,
        fileSize,
        fileUrl,
        filename
      })
    },

    getWorkshopDetails: debounce(async function() {
      this.getDetailsLoading = true

      if (this.workshopId) {
        try {
          this.collectionId = null
          this.modsDetails = []

          const response = await this.$axios.$get(
            `server/workshop/file/${this.workshopId}`
          )
          this.modsDetails.push(response)
        } catch (ex) {
          this.$snackbar({
            type: 'error',
            message: this.$t('workshop.idError')
          })
        }
      }

      this.getDetailsLoading = false
    }, 500),

    getCollectionDetails: debounce(async function() {
      this.getDetailsLoading = true

      if (this.collectionId) {
        try {
          this.workshopId = null
          this.modsDetails = []

          const response = await this.$axios.$get(`server/workshop/collection/${this.collectionId}`)
          this.modsDetails = response
        } catch (ex) {
          this.$snackbar({
            type: 'error',
            message: this.$t('workshop.idError')
          })
        }
      }

      this.getDetailsLoading = false
    }, 500)
  }
}
</script>
