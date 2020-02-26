<template>
  <v-app dark>
    <app-bar />

    <v-content>
      <v-slide-y-transition mode="out-in">
        <nuxt />
      </v-slide-y-transition>
    </v-content>
  </v-app>
</template>

<script>
const AppBar = () => import('@/components/AppBar')

export default {  
  components: {
    AppBar
  },

  data () {
    return {
      ws: null
    }
  },

  head () {
    return {
      title: 'Commander'
    }
  },

  async mounted () {
      const config = await this.$axios.$get('config')
      this.$store.commit('config/set', config)

      this.ws = this.$adonisWs(process.env.WS_URL)

      this.ws.connect()

      this.ws.on('open', () => {
        const monitor = this.ws.subscribe('monitor')

        monitor.on('data', data => {
            this.$store.commit('monitor/init', data)
        })

        monitor.on('last', data => {
            this.$store.commit('monitor/add', data)
        })

        const downloadInfo = this.ws.subscribe('download-info')

        downloadInfo.on('start', data => {
            this.$store.commit('downloadInfo/init', data)
        })

        downloadInfo.on('stop', code => {
            this.$store.commit('downloadInfo/stop', code)
        })
      })
  },

  beforeDestroy () {
    this.ws.close()
  }
}
</script>
