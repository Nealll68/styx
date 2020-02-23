<template>
<div>
  <v-container fluid>
    <v-row justify="center">
      <v-col 
        v-if="$auth.user.privilege >= 1"
        cols="md-12"
      >
        <v-menu
          v-model="modBtnMenu"
        >
          <template v-slot:activator="{ on }">
            <v-btn
              v-on="on"
              text
              color="primary"
              class="float-right"
              :disabled="$store.state.downloadInfo.type === 'updateServer'"
            >
              <v-icon left>mdi-toy-brick-plus</v-icon>Ajouter un mod
            </v-btn>
          </template>

          <v-list nav>
            <v-subheader>Workshop</v-subheader>

            <v-list-item @click="showModList = true">
              <v-list-item-icon>
                <v-icon>mdi-steam</v-icon>
              </v-list-item-icon>

              <v-list-item-content>
                <v-list-item-title>Depuis le workshop</v-list-item-title>
              </v-list-item-content>
            </v-list-item>

            <v-list-item @click="detectWorkshopMods()">
              <v-list-item-icon>
                <v-icon>mdi-folder-search</v-icon>
              </v-list-item-icon>

              <v-list-item-content>
                <v-list-item-title>Détecter ceux existants</v-list-item-title>
              </v-list-item-content>
            </v-list-item>

            <v-divider></v-divider>

            <v-subheader>Local</v-subheader>

            <v-list-item @click="showModUpload = true">
              <v-list-item-icon>
                <v-icon>mdi-upload</v-icon>
              </v-list-item-icon>

              <v-list-item-content>
                <v-list-item-title>Télécharger un mod</v-list-item-title>
              </v-list-item-content>
            </v-list-item>

            <v-list-item @click="showLocalMods()">
              <v-list-item-icon>
                <v-icon>mdi-plus-box</v-icon>
              </v-list-item-icon>

              <v-list-item-content>
                <v-list-item-title>Ajouter un mod existant</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>      
        </v-menu>
      </v-col>

      <v-col cols="md-12">
        <v-card>    
          <v-card-title class="headline">
            <h3>Mods</h3>
            <v-spacer></v-spacer>

            <v-btn
              text
              @click="refreshModsList()"
              class="mr-2"
              color="tertiary"
            >
              <v-icon left>mdi-refresh</v-icon> Actualiser
            </v-btn>

            <v-text-field
              v-model="modsSearch"
              append-icon="mdi-toy-brick-search"
              label="Rechercher un mod"
              single-line
              hide-details
              filled
              dense
            ></v-text-field>            
          </v-card-title>

          <v-divider></v-divider>

          <v-card-text>
              <v-data-table
                :items="mods" 
                :headers="modsHeaders"
                sort-by="name"
                disable-pagination 
                hide-default-footer
                no-data-text="Aucun mods ajouté"
                no-results-text="Aucun résultat"
                :search="modsSearch"
                :loading="modsTableLoading"
              >           

                <template v-slot:item.created_at="{ item }">
                  {{ $moment(item.created_at).format('DD MMM YYYY') }}
                </template>

                <template v-slot:item.server_updated_at="{ item }">
                  {{ $moment(item.server_updated_at).format('DD MMM YYYY à HH:mm') }}
                </template>

                <template v-slot:item.size="{ item }">
                  {{ formatBytes(item.size) }}
                </template>

                <template v-slot:item.action="{ item }">
                  <v-btn
                    v-if="item.source === 'Workshop'" 
                    text
                    icon
                    :href="`https://steamcommunity.com/workshop/filedetails/?id=${item.workshop_id}`"
                    target="_blank"
                    :disabled="modsTableLoading"
                  >
                    <v-icon>mdi-steam</v-icon>  
                  </v-btn>

                  <v-btn                    
                    v-if="$auth.user.privilege >= 1 && item.source === 'Workshop'"
                    text
                    icon
                    @click="downloadMod(item.workshop_id, item.name, item.size, true)"
                    :disabled="modsTableLoading"
                  >
                    <v-icon>mdi-update</v-icon>  
                  </v-btn>

                  <v-btn
                    v-if="$auth.user.privilege >= 1"
                    text
                    icon
                    color="error"
                    @click="deleteMod(item)"
                    :disabled="modsTableLoading"
                  >
                    <v-icon>mdi-delete</v-icon>  
                  </v-btn>         
                </template>                
              </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>

  <v-bottom-sheet v-model="showModList">
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
                  label="ID workshop du mod"
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
                  <v-list-item-subtitle>Taille : {{ formatBytes(mod.file_size) }}</v-list-item-subtitle>
                </v-list-item-content>

                <v-list-item-action>
                  <v-btn
                    v-if="mods.find(element => element.workshop_id == mod.publishedfileid)"
                    text
                    disabled
                  >
                    Déjà installé
                  </v-btn>

                  <v-btn
                    v-else
                    color="warning"
                    text
                    @click="downloadMod(mod.publishedfileid, mod.title, mod.file_size)"
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

  <v-bottom-sheet v-model="showLocalModList">
    <v-sheet color="grey darken-4">
      <v-container class="app-container">
        <v-card
          color="transparent"
          flat
        >
          <v-card-text v-if="getDetailsLoading" class="text-center">
            <v-progress-circular indeterminate color="primary"></v-progress-circular>
          </v-card-text>

          <v-card-text v-if="localMods.length > 0" style="max-height: 300px" class="scrollbar">
            <v-list 
              v-for="mod of localMods" 
              :key="mod"
              color="transparent"
            >
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>{{ mod }}</v-list-item-title>
                </v-list-item-content>

                <v-list-item-action>
                  <v-btn
                    v-if="mods.find(element => element.name == mod)"
                    text
                    disabled
                  >
                    Déjà ajouté
                  </v-btn>

                  <v-btn
                    v-else
                    color="warning"
                    text
                    @click="addLocalMod(mod)"         
                  >
                    <v-icon left>mdi-plus-box</v-icon>Ajouter
                  </v-btn>
                </v-list-item-action>
              </v-list-item>

              <v-divider inset></v-divider>
            </v-list>
          </v-card-text>

          <v-card-text v-else>
            <v-alert
              type="info"
              border="left"
              text
            >
              Aucun mods trouvé dans le dossier Arma 3
            </v-alert>
          </v-card-text>
        </v-card>
      </v-container>
    </v-sheet>
  </v-bottom-sheet>

  <upload-dialog :show="showModUpload" @close="showModUpload = false"></upload-dialog>
</div>
</template>

<script>
import debounce from 'debounce'
const UploadDialog = () => import('@/components/UploadDialog')

export default {
  layout: 'commander',

  components: {
    UploadDialog
  },

  data () {
    return {
      modBtnMenu: false,
      showModList: false,
      showModUpload: false,  
      showLocalModList: false,
      getDetailsLoading: false,
      workshopFileMenu: false,
      workshopCollectionMenu: false,
      workshopId: null,
      collectionId: null,
      modsDetails: [],
      localMods: [],
      modsTableLoading: false,
      modsSearch: '',
      modsHeaders: [
        { text: 'Nom', value: 'name' },
        { text: 'Workshop ID', value: 'workshop_id' },
        { text: 'Taille', value: 'size' },
        { text: 'Source', value: 'source' },
        { text: 'Dernière MàJ sur serveur', value: 'server_updated_at' },
        { text: '', value: 'action', sortable: false }
      ],
    }
  },

  async asyncData ({ $axios }) {
    const mods = await $axios.$get('server/mod')

    return {
      mods
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
    async refreshModsList () {
      this.modsTableLoading = true

      this.mods = await this.$axios.$get('server/mod')

      this.modsTableLoading = false
    },

    async showLocalMods () {
      const localMods = await this.$axios.$get('server/mod/local')
      this.localMods = localMods.modFolders
      this.showLocalModList = true
    },

    getWorkshopDetails: debounce(async function () {
      this.getDetailsLoading = true

      if (this.workshopId) {
        try {
          this.collectionId = null
          this.modsDetails = []
    
          const response = await this.$axios.$get(`server/workshop/file/${this.workshopId}`)
          this.modsDetails.push(response.response.publishedfiledetails[0])
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

    async downloadMod (id, name, size, isUpdate = false) {
      let modName = name
      let modSize = size
      
      if (isUpdate) {
        this.modsTableLoading = true

        const updatedModDetails = await this.$axios.$get(`server/workshop/file/${id}`)
        modName = updatedModDetails.response.publishedfiledetails[0].title
        modSize = updatedModDetails.response.publishedfiledetails[0].file_size
      }

      try {
        await this.$axios.$post('server/download/workshop', { 
          workshopItemID: id, 
          workshopItemName: modName,
          workshopItemSize: modSize
        })
      } catch (ex) {
        if (ex.response.data === 'E_STEAM_GUARD_REQUIRED') {
          const steamGuard = await this.$steamGuard()

          if (steamGuard) {
            await this.$axios.$post('server/download/workshop', {
              workshopItemID: id,
              workshopItemName: modName,
              workshopItemSize: modSize,
              steamGuard: steamGuard
            })
          }
        }
      }

      if (isUpdate) this.modsTableLoading = false
    },

    async detectWorkshopMods () {
      this.modsTableLoading = true

      await this.$axios.$get('server/mod/detect')
      await this.refreshModsList()

      this.$toast.global.appSuccess('Les mods qui ont pus être détectés ont était importés')
      this.modsTableLoading = false
    },

    async addLocalMod (name) {
      this.getDetailsLoading = true

      await this.$axios.$post('server/mod/local', { name })
      await this.refreshModsList()

      this.getDetailsLoading = false
    },

    async deleteMod (mod) {
      this.modsTableLoading = true

      try {  
        if (mod.source === 'Workshop') {
          await this.$axios.$delete(`server/mod/${mod.id}`)
        } else {
          await this.$axios.$delete(`server/mod/local/${mod.id}`)
        }
  
        this.mods.splice(this.mods.indexOf(mod), 1)
      } catch (ex) {
        if (ex.response.data === 'E_UNABLE_TO_ACCESS') {
          this.$toast.global.appError(`Le mod n'a pas été correctement supprimé car certains dossier n'existe pas ou l'application n'y a pas accès`)
        }
      }

      this.modsTableLoading = false
    },

    formatBytes (bytes) {
      const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
      const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 10)

      if (i === 0) return `${bytes} ${sizes[i]}`

      return `${(bytes / (1024 ** i)).toFixed(1)} ${sizes[i]}`
    }
  }
}
</script>