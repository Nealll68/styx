<template>
<div>
  <v-navigation-drawer
    v-model="navDrawer" 
    app
    mobile-break-point="960"
    :mini-variant="$vuetify.breakpoint.md || $vuetify.breakpoint.lg"
  >
    <div class="d-flex justify-center my-5">
      <v-img src="/logo_cp17_light_150x150.png" max-height="50" max-width="50"></v-img>
    </div>

    <v-list nav>      
      <v-list-item 
        v-for="item in items" 
        :key="item.name"
        nuxt
        :to="item.link"
        exact
        color="primary"
      >
        <v-list-item-icon>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>{{ item.name }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>

    <template v-slot:append>
      <v-list nav>
        <v-list-item
          nuxt
          to="/commander/user"
          exact
          color="primary"
        >
          <v-list-item-icon>
            <v-icon>mdi-account-cog</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>Mon compte</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item
          @click="logout()"
          color="error"
        >
          <v-list-item-icon>
            <v-icon>mdi-logout</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>Déconnexion</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </template>
  </v-navigation-drawer>

  <v-app-bar 
    app 
    elevate-on-scroll
    dense
  >
    <v-btn
      icon
      @click.stop="navDrawer = !navDrawer"
      class="hidden-md-and-up"
    >
      <v-icon>mdi-menu</v-icon>
    </v-btn>

    <v-chip 
      small 
      label 
      outlined
      class="mx-1 hidden-sm-and-down"
    >
      <v-icon 
        small 
        left
      >mdi-account</v-icon> {{ $auth.user.username }} - {{ privileges[$auth.user.privilege] }}            
    </v-chip>

    <v-chip 
      small 
      label 
      outlined
      class="mx-1 hidden-sm-and-down"
    >CPU : <span v-if="measure" class="ml-1">{{ measure.cpu_usage }}%</span></v-chip>

    <v-chip 
      small 
      label 
      outlined
      class="mx-1 hidden-sm-and-down"
    >MEM : <span v-if="measure" class="ml-1">{{ measure.mem_used }}%</span></v-chip>

    <v-spacer></v-spacer>

    <v-btn
      :icon="$vuetify.breakpoint.smAndDown" 
      text 
      color="success"
      @click="startA3Server()" 
      :disabled="$store.state.downloadInfo.type === 'updateServer' || $store.state.a3Server.isStarted || !$store.state.config.a3ServerPath"
    >
      <v-icon :left="$vuetify.breakpoint.mdAndUp">mdi-play</v-icon>{{ $vuetify.breakpoint.smAndDown ? '' : 'Démarrer' }}
    </v-btn>

    <v-btn
      :icon="$vuetify.breakpoint.smAndDown" 
      text 
      color="warning"
      @click="restartA3Server()" 
      :disabled="$store.state.downloadInfo.type === 'updateServer' || !$store.state.a3Server.isStarted || !$store.state.config.a3ServerPath"
    >
      <v-icon :left="$vuetify.breakpoint.mdAndUp">mdi-restart</v-icon>{{ $vuetify.breakpoint.smAndDown ? '' : 'Redémarrer' }}
    </v-btn>

    <v-btn
      :icon="$vuetify.breakpoint.smAndDown" 
      text 
      color="error"
      @click="stopA3Server()" 
      :disabled="$store.state.downloadInfo.type === 'updateServer' || !$store.state.a3Server.isStarted || !$store.state.config.a3ServerPath"
    >
      <v-icon :left="$vuetify.breakpoint.mdAndUp">mdi-stop</v-icon>{{ $vuetify.breakpoint.smAndDown ? '' : 'Arrêter' }}
    </v-btn>
    
    <v-tooltip 
      v-if="$auth.user.privilege === 2"
      bottom
    >
      <template v-slot:activator="{ on }">
        <v-btn
          icon
          :loading="loadingUpdate"
          v-on="on"
          @click="updateServer()"
          :disabled="$store.state.downloadInfo.type === 'updateServer' || !$store.state.config.a3ServerPath"
        >
          <v-icon>mdi-update</v-icon>
        </v-btn>
      </template>
      Mettre à jour le serveur
    </v-tooltip>
  </v-app-bar>

  <download-info-bar />
</div>
</template>

<script>
const DownloadInfoBar = () => import('@/components/DownloadInfoBar')

export default {
  name: 'app-bar',

  components: {
    DownloadInfoBar
  },

  data () {
    return {
      loadingUpdate: false,
      navDrawer: null,
      a3ServerWs: null,
      items: [
        { link: '/commander', name: $t('menu.home'), icon: 'mdi-view-dashboard' },
        { link: '/commander/profiles', name: 'Profils', icon: 'mdi-settings' },
        { link: '/commander/mods', name: 'Mods', icon: 'mdi-toy-brick' },
        { link: '/commander/mission', name: 'Missions', icon: 'mdi-target' },        
        { link: '/commander/logs', name: 'Logs', icon: 'mdi-post' }
      ],
      privileges: ['Normal', 'Administrateur', 'Super Administrateur']
    }
  },

  computed: {
    measure () {
      const length = this.$store.state.monitor.measures.length
      return this.$store.state.monitor.measures[length - 1]
    }
  },

  created () {
    if (this.$auth.user.privilege >= 1) this.items.push({ link: '/commander/users', name: 'Utilisateurs', icon: 'mdi-account-group' })
    if (this.$auth.user.privilege === 2) this.items.push({ link: '/commander/settings', name: 'Paramètres', icon: 'mdi-cogs' })    
  },

  mounted () {
    const ws = this.$adonisWs(process.env.WS_URL)
    ws.connect()

    ws.on('open', () => {
      this.a3ServerWs = ws.subscribe('a3-server')

      this.a3ServerWs.on('start', () => {
          this.$store.commit('a3Server/start')
      })

      this.a3ServerWs.on('stop', code => {
          this.$store.commit('a3Server/stop', code)
      })

      this.a3ServerWs.on('logs', data => {
          this.$store.commit('a3Server/logs', data)
      })
    })
  },

  beforeDestroy () {
    this.a3ServerWs.close()
  },

  methods: {
    startA3Server () {
      this.a3ServerWs.emit('start')
      this.$toast.global.appInfo('Démarrage du serveur...')
    },

    restartA3Server () {
      this.a3ServerWs.emit('restart')
      this.$toast.global.appInfo('Redémarrage du serveur...')
    },

    stopA3Server () {
      this.a3ServerWs.emit('stop')
      this.$toast.global.appInfo('Arrêt du serveur...')
    },

    async updateServer (guard = null) {
      this.loadingUpdate = true

      try {
        await this.$axios.$post('server/download/update', {
          steamGuard: null
        })
      } catch (ex) {
        if (ex.response.data === 'E_STEAM_GUARD_REQUIRED') {
          const steamGuard = await this.$steamGuard()

          if (steamGuard) {
            await this.$axios.$post('server/download/update', {
              steamGuard: steamGuard
            })
          }
        }
      }

      this.loadingUpdate = false
    },

    async logout () {
      await this.$auth.logout()
    }
  }
}
</script>
