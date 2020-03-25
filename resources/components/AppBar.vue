<template>
<div>
  <v-navigation-drawer
    v-model="navDrawer" 
    app
    mobile-break-point="960"
    :mini-variant="$vuetify.breakpoint.md || $vuetify.breakpoint.lg"
  >
    <div class="d-flex justify-center my-5">
      <v-img src="/logo.png" max-height="50" max-width="50"></v-img>
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
          <v-badge
            :value="item.link === '/commander/settings' && !$store.state.config.a3ServerPath"
            icon="mdi-exclamation"
            color="error"
            overlap
          >
            <v-icon>{{ item.icon }}</v-icon>
          </v-badge>          
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
            <v-list-item-title>{{ $t('menu.myAccount') }}</v-list-item-title>
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
            <v-list-item-title>{{ $t('menu.logout') }}</v-list-item-title>
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

    
    <v-menu 
      bottom
      right
      transition="slide-y-transition"
    >
      <template v-slot:activator="{ on }">
        <v-btn
          :icon="$vuetify.breakpoint.smAndDown"
          :small="$vuetify.breakpoint.mdAndUp"
          text          
          v-on="on"          
        >
          <v-icon :left="$vuetify.breakpoint.mdAndUp">mdi-translate</v-icon>
          {{ $vuetify.breakpoint.smAndDown ? '' : activatedLocale }}
          <v-icon 
            v-show="$vuetify.breakpoint.mdAndUp"
            right 
          >mdi-menu-down</v-icon>
        </v-btn>
      </template>

      <v-list 
        nav 
        dense
      >
        <v-list-item
          v-for="locale in $store.state.i18n.locales"
          :key="locale.code"
          @click="switchLocale(locale.code)"
        >
          <v-list-item-content>
            <v-list-item-title>{{ locale.name }}</v-list-item-title>
          </v-list-item-content>

          <v-list-item-icon v-if="locale.code === $store.state.i18n.locale">
            <v-icon color="primary">mdi-check</v-icon>
          </v-list-item-icon>
        </v-list-item>
      </v-list>
    </v-menu>

    <v-chip 
      small 
      label 
      outlined
      :color="$auth.user.privilege === 0 ? 'senary' : 'tertiary'"
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
      <v-icon :left="$vuetify.breakpoint.mdAndUp">mdi-play</v-icon>{{ $vuetify.breakpoint.smAndDown ? '' : $t('serverState.start') }}
    </v-btn>

    <v-btn
      :icon="$vuetify.breakpoint.smAndDown" 
      text 
      color="warning"
      @click="restartA3Server()" 
      :disabled="$store.state.downloadInfo.type === 'updateServer' || !$store.state.a3Server.isStarted || !$store.state.config.a3ServerPath"
    >
      <v-icon :left="$vuetify.breakpoint.mdAndUp">mdi-restart</v-icon>{{ $vuetify.breakpoint.smAndDown ? '' : $t('serverState.restart') }}
    </v-btn>

    <v-btn
      :icon="$vuetify.breakpoint.smAndDown" 
      text 
      color="error"
      @click="stopA3Server()" 
      :disabled="$store.state.downloadInfo.type === 'updateServer' || !$store.state.a3Server.isStarted || !$store.state.config.a3ServerPath"
    >
      <v-icon :left="$vuetify.breakpoint.mdAndUp">mdi-stop</v-icon>{{ $vuetify.breakpoint.smAndDown ? '' : $t('serverState.stop') }}
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
      {{ $t('menu.updateServer') }}
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
        { link: '/commander', name: this.$t('menu.index'), icon: 'mdi-view-dashboard' },
        { link: '/commander/profiles', name: this.$t('menu.profiles'), icon: 'mdi-folder-cog' },
        { link: '/commander/mods', name: this.$t('menu.mods'), icon: 'mdi-toy-brick' },
        { link: '/commander/mission', name: this.$t('menu.missions'), icon: 'mdi-target' },        
        { link: '/commander/logs', name: this.$t('menu.logs'), icon: 'mdi-post' }
      ],
      privileges: [this.$t('privileges.normal'), this.$t('privileges.admin'), this.$t('privileges.supAdmin')]
    }
  },

  computed: {
    measure () {
      const length = this.$store.state.monitor.measures.length
      return this.$store.state.monitor.measures[length - 1]
    },

    activatedLocale () {
      const locale = this.$store.state.i18n.locales.find(el => el.code === this.$store.state.i18n.locale)
      return locale.name
    }
  },

  created () {
    if (this.$auth.user.privilege >= 1) this.items.push({ link: '/commander/users', name: this.$t('menu.users'), icon: 'mdi-account-group' })
    if (this.$auth.user.privilege === 2) this.items.push({ link: '/commander/settings', name: this.$t('menu.settings'), icon: 'mdi-cogs' })    
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
      this.$toast.global.appInfo(this.$t('serverState.startProgress'))
    },

    restartA3Server () {
      this.a3ServerWs.emit('restart')
      this.$toast.global.appInfo(this.$t('serverState.restartProgress'))
    },

    stopA3Server () {
      this.a3ServerWs.emit('stop')
      this.$toast.global.appInfo(this.$t('serverState.stopProgress'))
    },

    switchLocale (code) {
      this.$cookies.set("locale", code, {
        path: "/"
      })

      window.location.reload(true)
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
