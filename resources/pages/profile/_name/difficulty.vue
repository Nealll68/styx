<template>
<v-card flat>
    <panel-header
      help-link="https://community.bistudio.com/wiki/server.armaprofile#Example_Configuration_File"
      :loadingReset="loadingReset"
      :loadingUpdate="loadingUpdate"
      :disabled="$store.state.a3Server.isStarted"
      @reset="reset()"
      @save="update()"
    ></panel-header>

    <v-card-text>
      <v-alert
        v-if="$store.state.a3Server.isStarted"
        type="warning"
        border="left"
        text
      >{{ $t('errors.serverStarted') }}</v-alert>

      <v-alert
        border="left"
        text 
        type="info" 
        dense
      >{{ $t('difficulty.information') }}</v-alert>

      <v-skeleton-loader
        :loading="loading"
        type="paragraph@2"
      >
        <v-textarea
          v-model="difficulty"
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
        <v-icon>mdi-arrow-up</v-icon>
      </v-btn>
    </v-fab-transition>
</v-card>
</template>

<script>
const PanelHeader = () => import('@/components/PanelHeader')

export default {
  head () {
    return {
      title: `${this.$t('profiles.tabTitles.difficulty')} - ${this.$route.params.name}`
    }
  },

	data () {
		return {
      loading: true,
			loadingUpdate: false,
      loadingReset: false,
      fab: false,
      difficulty: null
		}
  },
  
  components: {
    PanelHeader
  },

	async mounted () {
    this.difficulty = await this.$axios.$get(`server/difficulty/${this.$route.params.name}`)
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
      
      await this.$axios.$put(`server/difficulty/${this.$route.params.name}`, {
        config: this.difficulty
      })
      
      this.$snackbar({
        type: 'success',
        message: this.$t('common.updated')
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
        this.difficulty = await this.$axios.$delete(`server/difficulty/${this.$route.params.name}`)  
        this.$snackbar({
          type: 'success',
          message: this.$t('common.reseted')
        })
      }

      this.loadingReset = false
      this.$emit('loading', false)
		}
	}
}
</script>