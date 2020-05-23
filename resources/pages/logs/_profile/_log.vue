<template>
  <v-card>
    <v-skeleton-loader
      v-if="loading"
      type="table-heading, paragraph@2"
    ></v-skeleton-loader>

    <template v-else>
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
            :disable="deleteLoading || loading"
          >
            <v-icon left>mdi-download</v-icon>{{ $t('common.download') }}
          </v-btn>

          <v-btn
            color="error"
            text
            @click="deleteLog(logs.profileName, logs.filename)"
            :loading="deleteLoading"
            :disable="downloadLoading || loading"
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
    </template>

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
  head () {
    return {
      title: `${this.$route.params.log} - ${this.$route.params.profile} - ${this.$t('menu.logs')}`
    }
  },

  data: () => ({
    loading: true,
    downloadLoading: false,
    deleteLoading: false,
    fab: false,
    logs: null
  }),

  async mounted () {
    const profileName = this.$route.params.profile
    const filename = this.$route.params.log

    const response = await this.$axios.$get(`server/logs/${profileName}/${filename}`).catch (() => {
      return false
    })

    if (!response) return this.$error ({ statusCode: 404, message: "Unable to find the log file" })

    this.logs = {
      profileName,
      filename,
      logs: response.split('\r\n')
    }

    this.loading = false
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

      const confirm = await this.$confirm({ 
        title: this.$t('common.deletion'),
        message: this.$t('logs.confirmDeletion'),
        type: 'error'
      })

      if (confirm) {
        await this.$axios.$delete(`server/logs/${profileName}/${filename}`)

        this.deleteLoading = false

        this.$emit('refresh')
        this.$router.push('/logs')

        if (this.logs.profileName === profileName) {
          this.logs = null
        }
      }      
    }
  }
}
</script>