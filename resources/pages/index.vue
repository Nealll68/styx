<template>
  <v-container fluid>
    <path-error v-if="!$store.state.config.a3ServerPath"></path-error>

    <v-row justify="center">
      <v-col md="6" sm="12">
        <v-card :disabled="cpuUsage.length === 0">
          <v-progress-linear
            :indeterminate="cpuUsage.length === 0"
            :value="cpuUsage[cpuUsage.length - 1]"
            color="tertiary"
          ></v-progress-linear>

          <v-card-text class="py-0">
            <v-list>
              <v-list-item>
                <v-list-item-icon class="mr-5">
                  <v-icon size="50" color="tertiary">mdi-chip</v-icon>
                </v-list-item-icon>

                <v-list-item-content>
                  <v-list-item-subtitle>CPU</v-list-item-subtitle>
                  <v-list-item-title class="display-1 font-weight-light"
                    >{{ cpuUsage[cpuUsage.length - 1] }}%</v-list-item-title
                  >
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-card-text>
          <apexchart
            v-show="cpuUsage.length >= 2"
            type="area"
            :series="[
              {
                name: 'CPU',
                data: cpuUsage
              }
            ]"
            :options="{
              chart: {
                id: 'cpu-chart',
                background: '#1E1E1E',
                sparkline: {
                  enabled: true
                }
              },
              xaxis: {
                categories: takeAt
              },
              yaxis: {
                min: 0,
                max: 100
              },
              theme: {
                mode: 'dark',
                monochrome: {
                  enabled: true,
                  color: '#FF6859',
                  shadeTo: 'dark',
                  shadeIntensity: 0.65
                }
              },
              tooltip: {
                y: [
                  {
                    formatter(v) {
                      return `${v}%`
                    }
                  }
                ]
              }
            }"
            height="150px"
          ></apexchart>
        </v-card>
      </v-col>

      <v-col md="6" sm="12">
        <v-card :disabled="memUsed.length === 0">
          <v-progress-linear
            :indeterminate="memUsed.length === 0"
            :value="memUsed[memUsed.length - 1]"
            color="quaternary"
          ></v-progress-linear>

          <v-card-text class="py-0">
            <v-list>
              <v-list-item>
                <v-list-item-icon class="mr-5">
                  <v-icon size="50" color="quaternary">mdi-memory</v-icon>
                </v-list-item-icon>

                <v-list-item-content>
                  <v-list-item-subtitle>MEM</v-list-item-subtitle>
                  <v-list-item-title class="display-1 font-weight-light"
                    >{{ memUsed[memUsed.length - 1] }}%</v-list-item-title
                  >
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-card-text>
          <apexchart
            v-show="memUsed.length >= 2"
            type="area"
            :series="[
              {
                name: 'MEM',
                data: memUsed
              }
            ]"
            :options="{
              chart: {
                id: 'mem-chart',
                background: '#1E1E1E',
                sparkline: {
                  enabled: true
                }
              },
              xaxis: {
                categories: takeAt
              },
              yaxis: {
                min: 0,
                max: 100
              },
              theme: {
                mode: 'dark',
                monochrome: {
                  enabled: true,
                  color: '#FFCF44',
                  shadeTo: 'dark',
                  shadeIntensity: 0.65
                }
              },
              tooltip: {
                y: [
                  {
                    formatter(v) {
                      return `${v}%`
                    }
                  }
                ]
              }
            }"
            height="150px"
          ></apexchart>
        </v-card>
      </v-col>
    </v-row>

    <v-row justify="center">
      <v-col cols="12">
        <v-card :loading="loading">
          <v-card-title>
            <v-icon left>mdi-post</v-icon>
            {{ $t('index.logsTitle') }}

            <v-spacer></v-spacer>

            <v-switch
              v-model="automaticRefresh"
              :label="$t('index.automaticRefresh')"
              inset
              color="primary"
              class="mr-2"
            ></v-switch>

            <v-btn
              text
              @click="refreshLogs()"
              class="mr-2"
              color="tertiary"
              :disabled="loading || automaticRefresh || !$store.state.a3Server.isStarted"
            >
              <v-icon left>mdi-refresh</v-icon> {{ $t('common.refresh') }}
            </v-btn>
          </v-card-title>
          <v-card-text>
            <v-sheet
              v-if="$store.state.a3Server.isStarted"
              color="grey darken-4"
              class="pa-2 scrollbar"
              id="logsContainer"
              height="500px"
            >
              <div v-for="(log, i) of serverLogs" :key="i" class="my-2">
                {{ log }}
              </div>
            </v-sheet>

            <v-alert v-else type="info" border="left" text>{{
              $t('index.noLogs')
            }}</v-alert>
          </v-card-text>
        </v-card>
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
      title: this.$t('menu.index')
    }
  },

  components: {
    PathError
  },

  data () {
    return {
      loading: false,
      interval: null,
      automaticRefresh: false
    }
  },

  computed: {
    cpuUsage() {
      let values = []
      this.$store.state.monitor.measures.forEach(element => {
        values.push(element.cpu_usage)
      })
      return values
    },

    memUsed() {
      let values = []
      this.$store.state.monitor.measures.forEach(element => {
        values.push(element.mem_used)
      })
      return values
    },

    takeAt() {
      let values = []
      this.$store.state.monitor.measures.forEach(element => {
        values.push(this.$moment(element.take_at).format('LTS'))
      })
      return values
    }
  },

  async created() {
    if (this.$store.state.a3Server.isStarted) {
      await this.refreshLogs()
    }
    this.automaticLogsRefresh()
  },

  beforeDestroy() {
    clearInterval(this.interval)
  },

  methods: {
    async refreshLogs() {
      this.loading = true

      const response = await this.$axios.$get('server/logs/current')
      this.serverLogs = response.logs.split('\n')

      const el = document.getElementById('logsContainer')
      el.scrollTop = el.scrollHeight

      this.loading = false
    },

    automaticLogsRefresh() {
      this.interval = setInterval(async () => {
        if (this.automaticRefresh && this.$store.state.a3Server.isStarted) {
          await this.refreshLogs()
        }
      }, 3000)
    }
  }
}
</script>
