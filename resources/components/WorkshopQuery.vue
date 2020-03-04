<template>
  <v-bottom-sheet v-model="show" @click:outside="$emit('close')">
    <v-sheet color="grey darken-4">      
      <v-container class="app-container">
        <v-card
          color="transparent"
          flat
        >
          <v-card-title class="pb-0">
            <v-row>
              <v-col>
                <v-text-field
                  v-model="workshopId"
                  filled
                  label="ID de l'objet workshop"
                  prepend-inner-icon="mdi-plus-box"
                ></v-text-field>
              </v-col>

              <v-col>
                <v-text-field
                  v-model="collectionId"
                  filled
                  label="ID de la collection workshop"
                  prepend-inner-icon="mdi-plus-box-multiple"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-card-title>

          <v-card-text v-if="getDetailsLoading" class="text-center">
            <v-progress-circular indeterminate color="primary"></v-progress-circular>
          </v-card-text>

          <v-card-text v-if="modsDetails.length > 0" style="max-height: 300px" class="scrollbar">
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
                  <v-list-item-subtitle>Publié le : {{ $moment.unix(mod.time_created).format('DD MMM YYYY') }}</v-list-item-subtitle>
                  <v-list-item-subtitle>MàJ : {{ $moment.unix(mod.time_updated).format('DD MMM YYYY à HH:mm') }}</v-list-item-subtitle>
                  <v-list-item-subtitle>Taille : {{ mod.file_size | formatBytes }}</v-list-item-subtitle>
                </v-list-item-content>

                <v-list-item-action>
                  <v-btn
                    color="quaternary"
                    text
                    @click="downloadInfo(mod.publishedfileid, mod.title, mod.file_size, mod.file_url)"
                    :disabled="$store.state.downloadInfo.type"      
                  >
                    <v-icon left>mdi-download</v-icon>Télécharger
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
import debounce from 'debounce'

export default {
  props: ['show'],

  data () {
    return {
      getDetailsLoading: false,
      workshopId: null,
      collectionId: null,
      modsDetails: []
    }
  },

  watch: {
    workshopId () {
      this.getWorkshopDetails()
    },

    collectionId () {
      this.getCollectionDetails()
    }
  },

  methods: {
    downloadInfo (workshopId, title, fileSize, fileUrl) {
      this.$emit('download-info', {
        workshopId,
        title,
        fileSize,
        fileUrl
      })
    },

    getWorkshopDetails: debounce(async function () {
      this.getDetailsLoading = true

      if (this.workshopId) {
        try {
          this.collectionId = null
          this.modsDetails = []
    
          const response = await this.$axios.$get(`server/workshop/file/${this.workshopId}`)
          this.modsDetails.push(response)
        } catch (ex) {
          this.$toast.global.appError('Erreur : vérifier l\'ID workshop')
        }
      }

      this.getDetailsLoading = false
    }, 500),

    getCollectionDetails: debounce(async function () {
      this.getDetailsLoading = true

      if (this.collectionId) {
        try {
          this.workshopId = null
          this.modsDetails = []

          const response = await this.$axios.$get(`server/workshop/collection/${this.collectionId}`)
          this.modsDetails = response
        } catch (ex) {
          this.$toast.global.appError('Erreur : vérifier l\'ID workshop')
        }
      }

      this.getDetailsLoading = false
    }, 500),
  }
}
</script>