<template>
  <v-card>
    <v-banner
      app
      sticky
      single-line
    >
      <v-icon slot="icon">mdi-post</v-icon>
      {{ logs.filename }}

      <template v-slot:actions>
        <v-btn
          color="primary"
          text
          @click="downloadLog(logs.profileName, logs.filename)"
          :loading="downloadLoading"
          :disable="deleteLoading"
        >
          <v-icon left>mdi-download</v-icon>{{ $t('common.download') }}
        </v-btn>

        <v-btn
          color="error"
          text
          @click="deleteLog(logs.profileName, logs.filename)"
          :loading="deleteLoading"
          :disable="downloadLoading"
        >
          <v-icon left>mdi-delete-forever</v-icon>{{ $t('common.delete') }}
        </v-btn>
      </template>
    </v-banner>

    <v-card-text>
      <v-sheet
        color="grey darken-4" 
        class="pa-2"
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

    <v-fab-transition>
      <v-btn
        v-scroll="onScroll"
        v-show="fab"
        fab
        fixed
        bottom
        right
        color="primary"
        @click="$vuetify.goTo(0)"
      >
        <v-icon>mdi-arrow-up</v-icon>
      </v-btn>
    </v-fab-transition>
  </v-card>
</template>

<script>
export default {
  data: () => ({
    downloadLoading: false,
    deleteLoading: false,
    fab: false
  }),

  async asyncData ({ $axios, params, error }) {
    const profileName = params.profile
    const filename = params.log
    const response = await $axios.$get(`server/logs/${profileName}/${filename}`).catch (() => {
      return false
    })

    if (!response) return error ({ statusCode: 404, message: "Unable to find the log file" })

    return {
      logs: {
        profileName,
        filename,
        logs: response.split('\r\n')
      }
    }
  },

  methods: {
    onScroll (e) {
      if (typeof window === 'undefined') return
      const top = window.pageYOffset || e.target.scrollTop || 0
      this.fab = top > 300
    },

    async downloadLog (profileName, filename) {
      this.downloadLoading = true

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

      this.downloadLoading = false
    },

    async deleteLog (profileName, filename) {
      this.deleteLoading = true

      const confirm = await this.$confirm(this.$t('logs.confirmDeletion'), { 
        title: this.$t('common.deletion'),
        color: 'error'
      })

      if (confirm) {
        await this.$axios.$delete(`server/logs/${profileName}/${filename}`)

        this.deleteLoading = false

        this.$emit('refresh')
        this.$router.push('/demeter/logs')

        if (this.logs.profileName === profileName) {
          this.logs = null
        }
      }      
    }
  }
}
</script>