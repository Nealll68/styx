<template>
<div>
  <v-container fluid>
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
              <v-icon left>mdi-plus-box</v-icon>{{ $t('mission.add') }}
            </v-btn>
          </template>

          <v-list nav>
            <v-list-item @click="showWorkshopQuery = true">
              <v-list-item-icon>
                <v-icon>mdi-steam</v-icon>
              </v-list-item-icon>

              <v-list-item-content>
                <v-list-item-title>{{ $t('common.fromWorkshop') }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>

            <v-list-item @click="showUploadDialog = true">
              <v-list-item-icon>
                <v-icon>mdi-upload</v-icon>
              </v-list-item-icon>

              <v-list-item-content>
                <v-list-item-title>{{ $t('mission.upload') }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>

            <v-list-item @click="detectExistingMission()">
              <v-list-item-icon>
                <v-icon>mdi-file-search</v-icon>
              </v-list-item-icon>

              <v-list-item-content>
                <v-list-item-title>{{ $t('mission.detectMission') }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>      
        </v-menu>         
      </v-col>

      <v-col cols="12">
        <v-card>    
          <v-card-title class="headline">
            <h3>{{ $t('mission.title') }}</h3>

            <v-chip
              label
              class="mx-2"
            >{{ missions.length }}</v-chip>

            <v-spacer></v-spacer>

            <v-btn
              text
              @click="refershMissionList()"
              class="mr-2"
              color="tertiary"
            >
              <v-icon left>mdi-refresh</v-icon> {{ $t('common.refresh') }}
            </v-btn>

            <v-text-field
              v-model="missionSearch"
              append-icon="mdi-magnify"
              :label="$t('mission.search')"
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

            <v-data-table
              :items="missions" 
              :headers="missionHeaders" 
              :items-per-page="10"             
              sort-by="updated_at"
		          sort-desc
              :no-data-text="$t('mission.noMission')"
              :no-results-text="$t('common.noResult')"
              :search="missionSearch"
              :loading="tableLoading"
              :footer-props="{
                itemsPerPageText: $t('common.rowsPerPage'),
                itemsPerPageAllText: $t('common.all'),
                pageText: `{0}-{1} ${$t('common.of')} {2}`
              }"
            >           

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
                    :disabled="tableLoading"
                  >
                    <v-icon>mdi-steam</v-icon>  
                  </v-btn>

                  <v-btn                    
                    v-if="$auth.user.privilege === 1 && item.source === 'Workshop'"
                    text
                    icon
                    @click="updateMission(item.workshop_id)"
                    :disabled="tableLoading || $store.state.downloadInfo.type ? true : false"
                  >
                    <v-icon>mdi-update</v-icon>  
                  </v-btn>

                <v-btn
                  v-if="$auth.user.privilege === 1" 
                  text
                  icon
                  color="error"
                  @click="deleteMission(item)"
                  :disabled="tableLoading"
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

  <workshop-query :show="showWorkshopQuery" @download-info="downloadMission($event)" @close="showWorkshopQuery = false"></workshop-query>

  <upload-dialog :show="showUploadDialog" @file-uploaded="refershMissionList()" @close="showUploadDialog = false" isMission></upload-dialog>
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
      tableLoading: false,
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
      showDeleteInfo: false
    }
  },

  async asyncData ({ $axios }) {
    const missions = await $axios.$get('server/mission')

    return {
      missions
    }
  },

  methods: {
    async refershMissionList () {
      this.tableLoading = true

      this.missions = await this.$axios.$get('server/mission')

      this.tableLoading = false
    },

    async downloadMission (payload) {
      if (!payload.fileUrl) return this.$snackbar({
        type: 'error',
        message: this.$t('mission.workshopDownloadError')
      })
      await this.$axios.$post('server/mission/workshop', payload)
      await this.refershMissionList()
    },

    async updateMission (workshopId) {
      const response = await this.$axios.$get(`server/workshop/file/${workshopId}`)
      const payload = {
        workshopId: response.publishedfileid,
        title: response.title,
        fileSize: response.file_size,
        fileUrl: response.file_url,
        filename: response.filename
      }

      if (!payload.fileUrl) return this.$snackbar({
        type: 'error',
        message: this.$t('mission.workshopDownloadError')
      })
      await this.$axios.$post('server/mission/workshop', payload)
      await this.refershMissionList()
    },

    async deleteMission (mission) {
      this.tableLoading = true

      await this.$axios.$delete(`server/mission/${mission.id}`)
      this.missions.splice(this.missions.indexOf(mission), 1)

      this.showDeleteInfo = true
      this.tableLoading = false
    },

    async detectExistingMission () {
      this.tableLoading = true

      await this.$axios.$get(`server/mission/detect`)
      await this.refershMissionList()

      this.tableLoading = false
    }
  }
}
</script>