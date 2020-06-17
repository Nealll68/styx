<template>
<v-card flat>
  <panel-header
    help-link="https://community.bistudio.com/wiki/server.cfg#Example_Configuration_File"
    :loadingReset="loadingReset"
    :loadingUpdate="loadingUpdate"
    :disabled="$store.state.a3Server.isStarted"
    @reset="reset()"
    @save="update()"
  >
    <v-dialog 
      v-model="dialog"
      scrollable
      max-width="500px"
      :fullscreen="$vuetify.breakpoint.smAndDown"
    >
      <template v-slot:activator="{ on }">
        <v-btn 
          color="primary" 
          v-on="on"
          :disabled="loading"
        >
          <v-icon left>{{icons.mdiTarget}}</v-icon>{{ $t('menu.missions') }}
        </v-btn>
      </template>

      <v-card>
        <v-card-title>{{ $t('menu.missions') }}</v-card-title>
        
        <v-card-text style="max-height: 500px;">
          <v-alert
            v-if="missions && missions.length === 0"
            type="info"
            border="left"
            dense
            text
            :icon="icons.mdiAlertCircle"
          >{{ $t('common.noData') }}</v-alert>

          <v-list 
            v-else
            subheader
          >
            <v-subheader>{{ $t('information.missionDialogSubheader') }}</v-subheader>            

            <v-list-item 
              v-for="mission in missions"
              :key="mission.id"
            >
              <v-list-item-content>
                <v-list-item-title>{{ mission.filename.substring(0, mission.filename.length - 4) }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card-text>
        
        <v-card-actions>
          <v-btn 
            block
            text
            color="error"
            @click="dialog = false"
          >{{ $t('common.close') }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </panel-header>

  <v-card-text>
    <v-alert
      v-if="$store.state.a3Server.isStarted"
      type="warning"
      border="left"
      text
      :icon="icons.mdiExclamationThick"
    >{{ $t('errors.serverStarted') }}</v-alert>
    
    <v-skeleton-loader
      :loading="loading"
      type="paragraph@2"
    >
      <v-textarea
        v-model="config"
        filled
        auto-grow
        :disabled="loadingUpdate || loadingReset"
        spellcheck="false"
        autocorrect="off"
        autocapitalize="off"
      ></v-textarea>
    </v-skeleton-loader>
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
      <v-icon>{{icons.mdiArrowUp}}</v-icon>
    </v-btn>
  </v-fab-transition>
</v-card>
</template>

<script>
import {
  mdiTarget,
  mdiArrowUp,
  mdiAlertCircle,
  mdiExclamationThick
} from '@mdi/js'

const PanelHeader = () => import('@/components/PanelHeader')

export default {
  head () {
    return {
      title: `${this.$t('profiles.tabTitles.configuration')} - ${this.$route.params.name}`
    }
  },

	data: () => ({
    loading: true,
    loadingUpdate: false,
    loadingReset: false,
    dialog: false,
    fab: false,
    config: null,
    missions: null,
    icons: {
      mdiTarget,
      mdiArrowUp,
      mdiAlertCircle,
      mdiExclamationThick
    }
  }),

  components: {
    PanelHeader
  },
  
  async mounted () {
    this.config = await this.$axios.$get(`server/config/${this.$route.params.name}`)
    this.missions = await this.$axios.$get('server/mission')
    this.loading = false
  },

	methods: {
    onScroll (e) {
      if (typeof window === 'undefined') return
      const top = window.pageYOffset || e.target.scrollTop || 0
      this.fab = top > 300
    },

		async update () {
      this.$emit('loading', true)
      this.loadingUpdate = true
      
      await this.$axios.$put(`server/config/${this.$route.params.name}`, {
        config: this.config
      })
      
      this.$snackbar({
        type: 'success',
        message: this.$t('common.fileSaved')
      })
			
      this.loadingUpdate = false	
      this.$emit('loading', false)		
		},

		async reset () {
      this.$emit('loading', true)
      this.loadingReset = true

      const confirm = await this.$confirm({ 
        title: this.$t('common.reset'),
        message: this.$t('common.confirmReset'),
        type: 'warning'
      })
      
      if (confirm) {
        this.config = await this.$axios.$delete(`server/config/${this.$route.params.name}`)
        
        this.$snackbar({
          type: 'success',
          message: this.$t('common.fileReseted')
        })
      }

      this.loadingReset = false
      this.$emit('loading', false)
    }
	}
}
</script>