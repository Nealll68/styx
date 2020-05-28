<template>
  <v-container class="app-container">
    <path-error v-if="!$store.state.config.a3ServerPath"></path-error>

    <v-card 
      v-else
      :loading="loading"
    >
      <v-card-title class="headline">
        <h3>{{ $t('menu.logs') }}</h3>

        <v-spacer></v-spacer>

        <v-btn
          text
          @click="refreshLogs()"
          class="mr-2"
          color="tertiary"
          :disabled="loading"
        >
          <v-icon left>{{icons.mdiRefresh}}</v-icon> {{ $t('common.refresh') }}
        </v-btn>

        <v-text-field
          v-model="logsSearch"
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
        <v-btn
          v-show="selected.length > 0"
          outlined
          color="error"
          @click="deleteSelected"
        >
          <v-icon>{{ icons.mdiDeleteSweep }}</v-icon> {{ $t('logs.deleteSelected') }}
        </v-btn>

        <v-skeleton-loader
          v-if="loadingLogs"
          type="table-tbody"
        ></v-skeleton-loader>

        <v-data-table
          v-else
          v-model="selected"
          :items="logs" 
          item-key="name"
          :headers="headers" 
          :items-per-page="10"             
          sort-by="createdAt"
          sort-desc
          :no-data-text="$t('common.noData')"
          :no-results-text="$t('common.noResult')"
          :search="logsSearch"
          :footer-props="{
            itemsPerPageText: $t('common.rowsPerPage'),
            itemsPerPageAllText: $t('common.all'),
            pageText: `{0}-{1} ${$t('common.of')} {2}`
          }"
          show-select
        >
          <template v-slot:item.createdAt="{ item }">
            {{ $moment(item.createdAt, 'YYYY-MM-DD_hh-mm-ss').format('lll') }}
          </template>

          <template v-slot:item.action="{ item }">
            <v-btn
              text
              icon
              @click="showLog(item.profileName, item.name)"
            >
              <v-icon>{{ icons.mdiEye }}</v-icon>  
            </v-btn>

            <v-btn
              text
              icon
              color="primary"
              :disabled="loading"
              @click="downloadLog(item.profileName, item.name)"
            >
              <v-icon>{{ icons.mdiDownload }}</v-icon>  
            </v-btn>

            <v-btn
              text
              icon
              color="error"
              :disabled="loading"
              @click="deleteLog(item.profileName, item.name)"
            >
              <v-icon>{{ icons.mdiDeleteForever }}</v-icon>  
            </v-btn>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <v-dialog
      v-model="logViewer"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-app-bar
          fixed
          elevate-on-scroll
          dense
        >
          <v-btn
            text
            icon
            @click="logViewer = !logViewer"
          >
            <v-icon>{{ icons.mdiClose }}</v-icon>
          </v-btn>
          <v-toolbar-title>{{ logsContent.filename }}</v-toolbar-title>
        </v-app-bar>

        <v-card-text class="pt-12">
          <v-skeleton-loader
            v-if="loadingContent"
            type="paragraph@2"
          ></v-skeleton-loader>

          <v-sheet
            v-else
            color="grey darken-4" 
            class="pa-2 mt-4"
          >
            <div 
              v-for="(log, i) of logsContent.logs"
              :key="i"
              class="my-2"
            >
              {{ log }}
            </div>
          </v-sheet>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { 
  mdiDeleteSweep,
  mdiMagnify,
  mdiRefresh,
  mdiDownload,
  mdiEye,
  mdiDeleteForever,
  mdiClose
} from '@mdi/js'
const PathError = () => import('@/components/PathError')

export default {
  layout: 'interface',

  head () {
    return {
      title: this.$t('menu.logs')
    }
  },

  components: {
    PathError
  },

  data () {
    return {
      loading: false,
      loadingLogs: true,
      loadingContent: false,
      logViewer: false,
      icons: {
        mdiDeleteSweep,
        mdiMagnify,
        mdiRefresh,
        mdiDownload,
        mdiEye,
        mdiDeleteForever,
        mdiClose
      },
      logsSearch: null,
      headers: [
        { text: 'File', value: 'name' },
        { text: this.$t('menu.profile'), value: 'profileName' },
        { text: this.$t('common.createdAt'), value: 'createdAt' },
        { text: '', value: 'action', sortable: false }
      ],
      logs: [],
      logsContent: { filename: '', logs: '' },
      selected: []
    }
  },

  async mounted () {
    this.logs = await this.$axios.$get('server/logs')
    this.loadingLogs = false
  },

  methods: { 
    async refreshLogs () {
      this.loading = true
      this.logs = await this.$axios.$get('server/logs')
      this.loading = false
    },

    async showLog (profileName, filename) {
      this.loadingContent = true
      this.logViewer = true

      const response = await this.$axios.$get(`server/logs/${profileName}/${filename}`)

      this.logsContent = {
        filename,
        logs: response.split('\r\n')
      }

      this.loadingContent = false
    },

    async downloadLog (profileName, filename) {
      this.loading = true

      const response = await this.$axios({
        url: `server/logs/download/${profileName}/${filename}`,
        method: 'GET',
        responseType: 'blob'
      })

      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', filename)
      document.body.appendChild(link)
      link.click()

      this.loading = false
    },

    async deleteLog (profileName, filename) {
      this.loading = true

      const confirm = await this.$confirm({ 
        title: this.$t('common.deletion'),
        message: this.$t('logs.confirmDeletion'),
        type: 'error'
      })

      if (confirm) {
        await this.$axios.$delete(`server/logs/${profileName}/${filename}`)
        this.refreshLogs()
        this.$snackbar({
          type: 'success', 
          message:this.$tc('common.fileDeleted', 0)
        })
      }      
      this.loading = false
    },

    async deleteSelected () {
      const confirm = await this.$confirm({ 
        title: this.$t('common.deletion'),
        message: this.$t('logs.confirmDeleteSelected'),
        type: 'error'
      })

      if (confirm) {
        this.loading = true

        for (const log of this.selected) {
          await this.$axios.$delete(`server/logs/${log.profileName}/${log.name}`)          
        }

        this.refreshLogs()
        this.$snackbar({
          type: 'success', 
          message:this.$tc('common.fileDeleted', this.selected.length)
        })
        this.selected = []
        this.loading = false
      }
    }
  }
}
</script>