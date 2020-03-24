<template>
  <v-container fluid>
    <v-row>
      <v-col md="12" lg="3">
        <v-card>
          <v-card-text>
            <v-btn
              text
              color="error"
              block
              :loading="deleteAllLoading"
              @click="deleteAllLogs()"
            >
              <v-icon left>mdi-delete-forever</v-icon> {{ $t('logs.deleteAll') }}
            </v-btn>
          </v-card-text>

          <v-divider></v-divider>
       
          <v-list 
            max-height="500px" 
            class="scrollbar"
          >
            <v-subheader>{{ $t('menu.profiles') }}</v-subheader>

            <v-list-group 
              v-for="item of logFiles"
              :key="item.profile_name"
              v-model="item.active"
            >
              <template v-slot:activator>
                <v-list-item-content>
                  <v-list-item-title v-text="item.profile_name"></v-list-item-title>
                </v-list-item-content>
              </template>

              <v-list-item 
                v-for="logFile in item.files" 
                :key="logFile"
                @click="showLogs(item.profile_name, logFile)"
              >
                  <v-list-item-content>
                    <v-list-item-title>{{ logFile.substring(16, 35) }}</v-list-item-title>
                  </v-list-item-content>

                  <v-list-item-action>
                    <v-btn
                      icon
                      color="error"
                      @click.stop="deleteLogs(item.profile_name, logFile)"
                    >
                      <v-icon>mdi-delete</v-icon>
                    </v-btn>
                  </v-list-item-action>
              </v-list-item>
            </v-list-group>
          </v-list>
        </v-card> 
      </v-col>

      <v-col md="12" lg="9">
        <v-card>
          <template v-if="logs">
            <v-card-title>
              <v-icon left>mdi-post</v-icon>{{ logs.filename }}
              <v-spacer></v-spacer>
              <v-btn
                color="primary"
                text
                @click="downloadLog(logs.profileName, logs.filename)"
              >
                <v-icon left>mdi-download</v-icon>{{ $t('common.download') }}
              </v-btn>
            </v-card-title>

            <v-card-text>
              <v-sheet
                color="grey darken-4" 
                class="pa-2 scrollbar"
                max-height="700px"
              >
                <div 
                  v-for="(log, i) of logs.logs"
                  :key="i"
                  class="my-2"
                >
                  {{ log }}
                </div>
              </v-sheet>           
            </v-card-text>
          </template>

          <v-card-text v-else>
            <v-alert
              type="info"
              border="left"
              text
            >{{ $t('logs.filterInfo') }}</v-alert>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  layout: 'commander',
  middleware: 'undefinedPath',

  data () {
    return {
      selectedLog: null,
      logs: null,
      deleteAllLoading: false
    }
  },

  async asyncData ({ $axios }) {
    const logs = await $axios.$get('server/logs')

    return {
      logFiles: logs
    }
  },

  methods: {
    async showLogs (profileName, filename) {
      const logs = await this.$axios.$get(`server/logs/${profileName}/${filename}`)      
      this.logs = {
        profileName,
        filename,
        logs: logs.split('\r\n')
      }
    },

    async downloadLog (profileName, filename) {
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
    },

    async deleteLogs (profileName, filename) {      
      const confirm = await this.$confirm(this.$t('logs.confirmDeletion'), { 
        title: this.$t('common.deletion'), 
        buttonTrueText: this.$t('common.continue'), 
        buttonFalseText: this.$t('common.cancel'), 
        color: 'error',
        persistent: true
      })

      if (confirm) {
        await this.$axios.$delete(`server/logs/${profileName}/${filename}`)

        const index = this.logFiles.findIndex(element => element.profile_name === profileName)
        this.logFiles[index].files.splice(this.logFiles[index].files.indexOf(filename), 1)

        if (this.logs.profileName === profileName) {
          this.logs = null
        }
      }      
    },

    async deleteAllLogs () {
      const confirm = await this.$confirm(this.$t('logs.confirmAllDelete'), { 
        title: this.$t('common.deletion'), 
        buttonTrueText: this.$t('common.continue'), 
        buttonFalseText: this.$t('common.cancel'),
        color: 'error',
        persistent: true
      })

      if (confirm) {
        this.deleteAllLoading = true

        for (const profile of this.logFiles) {
          for (const filename of profile.files) {
            await this.$axios.$delete(`server/logs/${profile.profile_name}/${filename}`)
          }

          profile.files = []
        }
        
        this.logs = null
        this.deleteAllLoading = false
      }
    }
  }
}
</script>