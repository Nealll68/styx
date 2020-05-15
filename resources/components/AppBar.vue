<template>
<div>
  <download-info-bar />
  
  <v-app-bar
    v-if="$vuetify.breakpoint.mdAndUp"
    app
    elevate-on-scroll
    fixed
  >
    <v-container fluid>
      <v-row align="center">
        <v-col md="4">
          <Logo width="50px" height="50px" />
        </v-col>

        <v-col 
          md="4" 
          class="d-flex justify-center"
        >
           <v-tooltip 
            v-for="link in links"
            :key="link.url"
            bottom
           >
            <template v-slot:activator="{ on }">
              <v-btn 
                v-on="on"
                :to="link.url"
                nuxt
                text
                class="mx-1"
                exact-active-class="appbar-active-link"
              >
                <v-badge
                  :value="link.url === '/settings' && !$store.state.config.a3ServerPath"
                  icon="mdi-exclamation"
                  color="error"
                  overlap
                >
                  <v-icon>{{ link.icon }}</v-icon>
                </v-badge>
              </v-btn>
            </template>
            <span>{{ link.name }}</span>
          </v-tooltip>          
        </v-col>

        <v-col 
          md="4"
          class="d-flex justify-end"
        >
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn 
                v-on="on"
                to="/user"
                nuxt
                text
                class="mx-1"
                exact-active-class="appbar-active-link"
              >
                <v-icon>mdi-account-cog</v-icon>
              </v-btn>
            </template>
            <span>{{ $t('menu.myAccount') }}</span>
          </v-tooltip>

          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn 
                v-on="on"
                @click="logout()"
                text
                class="mx-1"
                exact-active-class="appbar-active-link"
              >
                <v-icon>mdi-logout</v-icon>
              </v-btn>
            </template>
            <span>{{ $t('menu.logout') }}</span>
          </v-tooltip>
        </v-col>
      </v-row>
    </v-container>

    <template v-slot:extension> 
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

      <v-progress-circular
        v-if="measure"
        :value="measure.cpu_usage"
        color="tertiary"
        class="mx-2 hidden-xs-only"
      >
        <v-icon 
          small
          color="tertiary"
        >mdi-chip</v-icon>
      </v-progress-circular>

      <v-progress-circular
        v-if="measure"
        :value="measure.mem_used"
        color="quaternary"
        class="mx-2 hidden-xs-only"
      >
        <v-icon 
          small
          color="quaternary"
        >mdi-memory</v-icon>
      </v-progress-circular>

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
        v-if="$auth.user.privilege === 1 && $store.state.config.steamCmdPath"
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
    </template> 
  </v-app-bar>

  <v-app-bar
    v-else
    app
    elevate-on-scroll
    fixed
  >
    <v-btn
      icon
      @click.stop="navDrawer = !navDrawer"
      class="hidden-md-and-up"
    >
      <v-icon>mdi-menu</v-icon>
    </v-btn>

    <Logo width="50px" height="50px" />

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

    <v-progress-circular
      v-if="measure"
      :value="measure.cpu_usage"
      color="tertiary"
      class="mx-2 hidden-xs-only"
    >
      <v-icon 
        small
        color="tertiary"
      >mdi-chip</v-icon>
    </v-progress-circular>

    <v-progress-circular
      v-if="measure"
      :value="measure.mem_used"
      color="quaternary"
      class="mx-2 hidden-xs-only"
    >
      <v-icon 
        small
        color="quaternary"
      >mdi-memory</v-icon>
    </v-progress-circular>

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
      v-if="$auth.user.privilege === 1 && $store.state.config.steamCmdPath"
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

  <v-navigation-drawer
    v-if="$vuetify.breakpoint.smAndDown"
    v-model="navDrawer" 
    app
  >
    <v-list>      
      <v-list-item 
        v-for="link in links" 
        :key="link.url"
        nuxt
        :to="link.url"
        :exact="link.url === '/'"
        color="primary"
      >
        <v-list-item-icon>
          <v-badge
            :value="link.url === '/settings' && !$store.state.config.a3ServerPath"
            icon="mdi-exclamation"
            color="error"
            overlap
          >
            <v-icon>{{ link.icon }}</v-icon>
          </v-badge>          
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>{{ link.name }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>

    <template v-slot:append>
      <v-list>
        <v-list-item
          nuxt
          to="/user"
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
</div>
</template>

<script>
const Logo = () => import('@/components/Logo')
const DownloadInfoBar = () => import('@/components/DownloadInfoBar')

export default {
  name: 'app-bar',

  components: {
    Logo,
    DownloadInfoBar
  },

  data () {
    return {
      loadingUpdate: false,
      navDrawer: null,
      a3ServerWs: null,
      links: [
        { url: '/', name: this.$t('menu.index'), icon: 'mdi-view-dashboard' },
        { url: '/profile', name: this.$t('menu.profiles'), icon: 'mdi-folder-cog' },
        { url: '/mods', name: this.$t('menu.mods'), icon: 'mdi-toy-brick' },
        { url: '/mission', name: this.$t('menu.missions'), icon: 'mdi-target' },        
        { url: '/logs', name: this.$t('menu.logs'), icon: 'mdi-post' }
      ],
      privileges: [this.$t('privileges.sergeant'), this.$t('privileges.commander')]
    }
  },

  computed: {
    measure () {
      const length = this.$store.state.monitor.measures.length
      return this.$store.state.monitor.measures[length - 1]
    },
  },

  created () {
    if (this.$auth.user.privilege === 1) {
      this.links.push({ url: '/users', name: this.$t('menu.users'), icon: 'mdi-account-group' })
      this.links.push({ url: '/settings', name: this.$t('menu.settings'), icon: 'mdi-cogs' })    
    }
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
      this.$snackbar({
        type: 'info',
        message: this.$t('serverState.startProgress')
      })
    },

    restartA3Server () {
      this.a3ServerWs.emit('restart')
      this.$snackbar({
        type: 'info',
        message: this.$t('serverState.restartProgress')
      })
    },

    stopA3Server () {
      this.a3ServerWs.emit('stop')
      this.$snackbar({
        type: 'info',
        message: this.$t('serverState.stopProgress')
      })
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
