<template>
<div>
  <v-container class="app-container">
    <path-error v-if="!$store.state.config.a3ServerPath"></path-error>

    <v-row
      v-else
      justify="center"
    >
      <v-col cols="12">
        <v-menu
          v-model="modBtnMenu"
        >
          <template v-slot:activator="{ on }">
            <v-btn
              v-on="on"
              outlined
              color="primary"
              class="float-right"
              :disabled="$store.state.downloadInfo.type ? true : false"
            >
              <v-icon left>mdi-toy-brick-plus</v-icon>{{ $t('mods.add') }}
            </v-btn>
          </template>

          <v-list nav>
            <v-subheader>Workshop</v-subheader>

            <v-list-item 
              :disabled="!$store.state.config.steamCmdPath"
              @click="showModList = true"
            >
              <v-list-item-icon>
                <v-icon>mdi-steam</v-icon>
              </v-list-item-icon>

              <v-list-item-content>
                <v-list-item-title>{{ $t('common.fromWorkshop') }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>

            <v-list-item 
              :disabled="!$store.state.config.steamCmdPath"
              @click="detectWorkshopMods()"
            >
              <v-list-item-icon>
                <v-icon>mdi-folder-search</v-icon>
              </v-list-item-icon>

              <v-list-item-content>
                <v-list-item-title>{{ $t('mods.detect') }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>

            <v-subheader>{{ $t('mods.local') }}</v-subheader>

            <v-list-item @click="showModUpload = true">
              <v-list-item-icon>
                <v-icon>mdi-upload</v-icon>
              </v-list-item-icon>

              <v-list-item-content>
                <v-list-item-title>{{ $t('mods.upload') }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>

            <v-list-item @click="showLocalMods()">
              <v-list-item-icon>
                <v-icon>mdi-plus-box</v-icon>
              </v-list-item-icon>

              <v-list-item-content>
                <v-list-item-title>{{ $t('mods.addLocal') }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>      
        </v-menu>
      </v-col>

      <v-col cols="12">
        <v-card>    
          <v-card-title class="headline">
            <h3>{{ $t('mods.title') }}</h3>

            <v-chip
              label
              class="mx-2"
            >{{ mods.length }}</v-chip>

            <v-spacer></v-spacer>

            <v-btn
              text
              @click="refreshModsList()"
              class="mr-2"
              color="tertiary"
            >
              <v-icon left>mdi-refresh</v-icon>{{ $t('common.refresh') }}
            </v-btn>

            <v-text-field
              v-model="modsSearch"
              append-icon="mdi-toy-brick-search"
              :label="$t('mods.search')"
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
                :items-per-page="10"
                sort-by="name"
                :no-data-text="$t('mods.noMods')"
                :no-results-text="$t('common.noResult')"
                :search="modsSearch"
                :loading="modsTableLoading"
                :footer-props="{
                  itemsPerPageText: $t('common.rowsPerPage'),
                  itemsPerPageAllText: $t('common.all'),
                  pageText: `{0}-{1} ${$t('common.of')} {2}`
                }"
              >           

                <template v-slot:item.created_at="{ item }">
                  {{ $moment(item.created_at).format('ll') }}
                </template>

                <template v-slot:item.server_updated_at="{ item }">
                  {{ $moment(item.server_updated_at).format('lll') }}
                </template>

                <template v-slot:item.size="{ item }">
                  {{ item.size | formatBytes }}
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
                    v-if="$auth.user.privilege === 1 && item.source === 'Workshop'"
                    text
                    icon
                    @click="downloadMod({ workshopId: item.workshop_id, title: item.name, fileSize: item.size, isUpdate: true })"
                    :disabled="modsTableLoading || $store.state.downloadInfo.type ? true : false"
                  >
                    <v-icon>mdi-update</v-icon>  
                  </v-btn>

                  <v-btn
                    v-if="$auth.user.privilege === 1"
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
                  >{{ $t('mods.alreadyAdded') }}</v-btn>

                  <v-btn
                    v-else
                    color="warning"
                    text
                    @click="addLocalMod(mod)"         
                  >
                    <v-icon left>mdi-plus-box</v-icon>{{ $t('common.add') }}
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
            >{{ $t('mods.noLocalMod') }}</v-alert>
          </v-card-text>
        </v-card>
      </v-container>
    </v-sheet>
  </v-bottom-sheet>

  <workshop-query :show="showModList" @download-info="downloadMod($event)" @close="showModList = false"></workshop-query>

  <upload-dialog :show="showModUpload" @close="showModUpload = false"></upload-dialog>
</div>
</template>

<script>
const PathError = () => import('@/components/PathError')
const UploadDialog = () => import('@/components/UploadDialog')
const WorkshopQuery = () => import('@/components/WorkshopQuery')

export default {
  layout: 'interface',

  head () {
    return {
      title: this.$t('menu.mods')
    }
  },

  components: {
    PathError,
    UploadDialog,
    WorkshopQuery
  },

  data () {
    return {
      getDetailsLoading: false,
      modBtnMenu: false,
      showModList: false,
      showModUpload: false,  
      showLocalModList: false,
      workshopFileMenu: false,
      workshopCollectionMenu: false,
      localMods: [],
      modsTableLoading: false,
      modsSearch: '',
      modsHeaders: [
        { text: this.$t('common.name'), value: 'name' },
        { text: this.$t('common.size'), value: 'size' },
        { text: this.$t('common.source'), value: 'source' },
        { text: 'Workshop ID', value: 'workshop_id' },
        { text: this.$t('common.lastUpdate'), value: 'server_updated_at' },
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

    async downloadMod (payload) {
      const { workshopId, title, fileSize, isUpdate = false } = payload

      let modName = title
      let modSize = fileSize
      
      if (isUpdate) {
        this.modsTableLoading = true

        const updatedModDetails = await this.$axios.$get(`server/workshop/file/${workshopId}`)
        modName = updatedModDetails.title
        modSize = updatedModDetails.file_size
      }

      try {
        await this.$axios.$post('server/download/workshop', { 
          workshopItemID: workshopId, 
          workshopItemName: modName,
          workshopItemSize: modSize
        })
      } catch (ex) {
        if (ex.response.data === 'E_STEAM_GUARD_REQUIRED') {
          const steamGuard = await this.$steamGuard()

          if (steamGuard) {
            await this.$axios.$post('server/download/workshop', {
              workshopItemID: workshopId,
              workshopItemName: modName,
              workshopItemSize: modSize,
              steamGuard: steamGuard
            })
          }
        } else if (ex.response.data === 'E_STEAM_ACCOUNT_REQUIRED') {
          this.$snackbar({
            type: 'error',
            message: this.$t('errors.steamAccountRequired')
          })
        }
      }

      if (isUpdate) this.modsTableLoading = false
    },

    async detectWorkshopMods () {
      this.modsTableLoading = true

      await this.$axios.$get('server/mod/detect')
      await this.refreshModsList()

      this.$snackbar({
        type: 'success',
        message: this.$t('mods.importSuccess')
      })
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
          this.$snackbar({ 
            type: 'warning',
            message: this.$t('mods.notEntirelyDeleted')
          })
        }
      }

      this.modsTableLoading = false
    }
  }
}
</script>