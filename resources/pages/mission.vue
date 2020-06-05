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
          v-model="menu"
        >
          <template v-slot:activator="{ on }">
            <v-btn
              v-on="on"
              outlined
              color="primary"
              class="float-right"
              :disabled="$store.state.downloadInfo.type === 'updateServer'"
            >
              <v-icon left>{{icons.mdiPlusBox}}</v-icon>{{ $t('mission.add') }}
            </v-btn>
          </template>

          <v-list nav>
            <v-list-item
              @click="showWorkshopQuery = true"
            >
              <v-list-item-icon>
                <v-icon>{{icons.mdiSteam}}</v-icon>
              </v-list-item-icon>

              <v-list-item-content>
                <v-list-item-title>{{ $t('common.fromWorkshop') }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>

            <v-list-item @click="showUploadDialog = true">
              <v-list-item-icon>
                <v-icon>{{icons.mdiUpload}}</v-icon>
              </v-list-item-icon>

              <v-list-item-content>
                <v-list-item-title>{{ $t('mission.upload') }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>

            <v-list-item @click="detectExistingMission()">
              <v-list-item-icon>
                <v-icon>{{icons.mdiFileSearch}}</v-icon>
              </v-list-item-icon>

              <v-list-item-content>
                <v-list-item-title>{{ $t('mission.detectMission') }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>      
        </v-menu>         
      </v-col>

      <v-col cols="12">
        <v-card :loading="loading">    
          <v-card-title class="headline">
            <h3>{{ $t('mission.title') }}</h3>

            <v-chip
              label
              class="mx-2"
            >{{ missions.length }}</v-chip>

            <v-spacer></v-spacer>

            <v-btn
              text
              @click="refreshMissionList()"
              class="mr-2"
              color="tertiary"
            >
              <v-icon left>{{icons.mdiRefresh}}</v-icon> {{ $t('common.refresh') }}
            </v-btn>

            <v-text-field
              v-model="missionSearch"
              :append-icon="icons.mdiMagnify"
              :label="$t('common.search')"
              single-line
              hide-details
              filled
              dense
            ></v-text-field>            
          </v-card-title>

          <v-divider></v-divider>

          <v-card-text>
            <v-alert
              v-show="showDeleteInfo"
              text
              type="info"
              border="left"
              dense
              dismissible
            >{{ $t('mission.afterDeleteMessage') }}</v-alert>

            <v-skeleton-loader
              v-if="loadingMissions"
              type="table-tbody"
            ></v-skeleton-loader>

            <v-data-table
              :items="missions" 
              :headers="missionHeaders" 
              :items-per-page="10"             
              sort-by="updated_at"
		          sort-desc
              :no-data-text="$t('common.noData')"
              :no-results-text="$t('common.noResult')"
              :search="missionSearch"
              :footer-props="{
                itemsPerPageText: $t('common.rowsPerPage'),
                itemsPerPageAllText: $t('common.all'),
                pageText: `{0}-{1} ${$t('common.of')} {2}`
              }"
            >           
              <template v-slot:item.name="{ item }">                
                <v-avatar 
                  v-if="item.source === 'Workshop'"
                  size="36"
                  class="mr-1"                  
                >
                  <v-img                    
                    :src="item.image ? item.image : 'https://steamuserimages-a.akamaihd.net/ugc/1045345546241945983/B11E2E9F6FCF67B4FCA78F9A2A47604E98008655/'"
                  ></v-img>                  
                </v-avatar>

                <v-avatar
                  v-else
                  size="36"
                  class="mr-1" 
                  color="secondary"
                >
                  <v-icon>{{ icons.mdiTarget }}</v-icon>
                </v-avatar>
                {{ item.name }}
              </template>


              <template v-slot:item.updated_at="{ item }">
                {{ $moment(item.updated_at).format('lll') }}
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
                    rel="noopener noreferrer"
                    :disabled="loading"
                  >
                    <v-icon>{{icons.mdiSteam}}</v-icon>  
                  </v-btn>

                  <v-btn                    
                    v-if="$auth.user.privilege === 1 && item.source === 'Workshop'"
                    text
                    icon
                    @click="updateMission(item.workshop_id)"
                    :disabled="loading || $store.state.downloadInfo.type ? true : false"
                  >
                    <v-icon>{{icons.mdiUpdate}}</v-icon>  
                  </v-btn>

                <v-btn
                  v-if="$auth.user.privilege === 1" 
                  text
                  icon
                  color="error"
                  @click="deleteMission(item)"
                  :disabled="loading"
                >
                  <v-icon>{{ icons.mdiDelete }}</v-icon>  
                </v-btn>         
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>

  <workshop-query :show="showWorkshopQuery" @download-info="downloadMission($event)" @close="showWorkshopQuery = false"></workshop-query>

  <upload-dialog :show="showUploadDialog" @file-uploaded="refreshMissionList()" @close="showUploadDialog = false" isMission></upload-dialog>
</div>
</template>

<script>
import {
  mdiPlusBox,
  mdiPlusBoxMultiple,
  mdiSteam,
  mdiUpload,
  mdiFileSearch,
  mdiRefresh,
  mdiMagnify,
  mdiUpdate,
  mdiDelete,
  mdiTarget
} from '@mdi/js'
const PathError = () => import('@/components/PathError')
const UploadDialog = () => import('@/components/UploadDialog')
const WorkshopQuery = () => import('@/components/WorkshopQuery')

export default {
  layout: 'interface',
  
  head () {
    return {
      title: this.$t('menu.missions')
    }
  },

  components: {
    PathError,
    UploadDialog,
    WorkshopQuery
  },

  data () {
    return {
      showUploadDialog: false,
      showWorkshopQuery: false,
      loading: false,
      loadingMissions: true,
      missions: [],
      menu: false,
      missionSearch: '',
      missionHeaders: [
        { text: this.$t('common.name'), value: 'name' },
        { text: this.$t('mission.map'), value: 'map' },
        { text: this.$t('common.size'), value: 'size' },
        { text: this.$t('common.source'), value: 'source' },
        { text: 'Workshop ID', value: 'workshop_id' },
        { text: this.$t('common.lastUpdate'), value: 'updated_at' },
        { text: '', value: 'action', sortable: false }
      ],
      showDeleteInfo: false,
      icons: {
        mdiPlusBox,
        mdiPlusBoxMultiple,
        mdiSteam,
        mdiUpload,
        mdiFileSearch,
        mdiRefresh,
        mdiMagnify,
        mdiUpdate,
        mdiDelete,
        mdiTarget
      }
    }
  },

  async mounted () {
    this.missions = await this.$axios.$get('server/mission')
    this.loadingMissions = false
  },

  methods: {
    async refreshMissionList () {
      this.loading = true

      this.missions = await this.$axios.$get('server/mission')

      this.loading = false
    },

    async downloadMission (payload) {
      if (!payload.fileUrl) return this.$snackbar({
        type: 'error',
        message: this.$t('mission.workshopDownloadError')
      })
      await this.$axios.$post('server/mission/workshop', payload)
      await this.refreshMissionList()
    },

    async updateMission (workshopId) {
      const response = await this.$axios.$get(`server/workshop/file/${workshopId}`)
      const payload = {
        workshopId: response.publishedfileid,
        title: response.title,
        fileSize: response.file_size,
        fileUrl: response.file_url,
        filename: response.filename,
        image: response.preview_url
      }

      if (!payload.fileUrl) return this.$snackbar({
        type: 'error',
        message: this.$t('workshop.missionDownloadError')
      })
      await this.$axios.$post('server/mission/workshop', payload)
      await this.refreshMissionList()
    },

    async deleteMission (mission) {
      this.loading = true

      await this.$axios.$delete(`server/mission/${mission.id}`)
      this.missions.splice(this.missions.indexOf(mission), 1)

      this.showDeleteInfo = true
      this.loading = false
    },

    async detectExistingMission () {
      this.loading = true

      await this.$axios.$get(`server/mission/detect`)
      await this.refreshMissionList()

      this.loading = false
    }
  }
}
</script>