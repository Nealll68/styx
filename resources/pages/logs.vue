<template>
  <v-container fluid>
    <path-error v-if="!$store.state.config.a3ServerPath"></path-error>

    <v-row v-else>
      <v-col md="12" lg="3">
        <v-card :loading="loading">
          <v-card-text>
            <v-btn
              text
              color="error"
              block
              :disable="loading"
              @click="deleteAllLogs()"
            >
              <v-icon left>mdi-delete-sweep</v-icon> {{ $t('logs.deleteAll') }}
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
                nuxt
                :to="`/logs/${item.profile_name}/${logFile}`"
              >
                <v-list-item-content>
                  <v-list-item-title>{{ logFile.substring(16, 35) }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-group>
          </v-list>
        </v-card> 
      </v-col>

      <v-col md="12" lg="9">
        <nuxt-child @refresh="refresh" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
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
      loading: false
    }
  },

  async asyncData ({ $axios }) {
    const logs = await $axios.$get('server/logs')

    return {
      logFiles: logs
    }
  },

  methods: { 
    async refresh () {
      this.loading = true
      this.logFiles = await this.$axios.$get('server/logs')
      this.loading = false
    },

    async deleteAllLogs () {
      const confirm = await this.$confirm({ 
        title: this.$t('common.deletion'),
        message: this.$t('logs.confirmAllDelete'),
        type: 'error'
      })

      if (confirm) {
        this.loading = true

        for (const profile of this.logFiles) {
          for (const filename of profile.files) {
            await this.$axios.$delete(`server/logs/${profile.profile_name}/${filename}`)
          }

          profile.files = []
        }
        
        this.logs = null
        this.loading = false
      }
    }
  }
}
</script>