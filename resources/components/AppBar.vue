<template>
<div>
  <v-navigation-drawer    
    v-model="navDrawer" 
    app
    floating
  >
    <div class="d-flex justify-center my-5">
      <Logo width="50px" height="50px" />
    </div>

    <v-list nav>      
      <v-list-item 
        v-for="link in links" 
        :key="link.url"
        nuxt
        :to="link.url"
        :exact="link.url === '/'"
        color="primary"
      >
        <v-list-item-icon>
          <v-icon>{{ link.icon }}</v-icon>    
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>{{ link.name }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>

  <v-app-bar
    app
    elevate-on-scroll
    fixed
  >
    <v-container class="app-container px-0">
      <v-row align="center">
        <v-col 
          md="4"
          sm="6"
        >
          <v-btn
            icon
            @click.stop="navDrawer = !navDrawer"
            class="hidden-md-and-up"
          >
            <v-icon>mdi-menu</v-icon>
          </v-btn>

          <Logo v-show="$vuetify.breakpoint.mdAndUp" width="50px" height="50px" />
        </v-col>

        <v-col
          v-show="$vuetify.breakpoint.mdAndUp"
          md="4" 
          :class="$vuetify.breakpoint.mdAndUp ? 'd-flex justify-center' : ''"
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
                :exact="link.url === '/'"
                nuxt
                text
                class="mx-1"
                active-class="appbar-active-link"
              >
                <v-icon>{{ link.icon }}</v-icon>
              </v-btn>
            </template>
            <span>{{ link.name }}</span>
          </v-tooltip>          
        </v-col>

        <v-col 
          md="4"
          sm="6"
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
                active-class="appbar-active-link"
              >
                <v-icon>mdi-account-cog</v-icon>
              </v-btn>
            </template>
            <span>{{ $auth.user.username }}</span>
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
      <v-container class="app-container px-0">
        <v-row align="center">
          <v-col>
            <v-progress-circular
              v-if="measure"
              :value="measure.cpu_usage"
              color="tertiary"
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
              class="ml-1"
            >
              <v-icon 
                small
                color="quaternary"
              >mdi-memory</v-icon>
            </v-progress-circular>
          </v-col>
          <v-col class="d-flex justify-end">
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
          </v-col>
        </v-row>
      </v-container>
    </template> 
  </v-app-bar>
</div>
</template>

<script>
const Logo = () => import('@/components/Logo')

export default {
  name: 'app-bar',

  components: {
    Logo
  },

  data () {
    return {
      loadingUpdate: false,
      navDrawer: false,
      a3ServerWs: null,
      links: [
        { url: '/', name: this.$t('menu.index'), icon:  'mdi-view-dashboard' },
        { url: '/profile', name: this.$tc('menu.profile', 2), icon: 'mdi-folder-cog' },
        { url: '/mods', name: this.$t('menu.mods'), icon: 'mdi-toy-brick' },
        { url: '/mission', name: this.$t('menu.missions'), icon: 'mdi-target' },        
        { url: '/logs', name: this.$t('menu.logs'), icon: 'mdi-post' }
      ],
      privileges: [this.$t('privileges.sergeant'), this.$t('privileges.commander')],
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
      this.$router.push('/login')
    }
  }
}
</script>
