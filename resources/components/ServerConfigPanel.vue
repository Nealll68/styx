<template>
<div>

<panel-header
  help-link="https://community.bistudio.com/wiki/server.cfg#Example_Configuration_File"
  :loadingReset="loadingReset"
  :loadingUpdate="loadingUpdate"
  @reset="reset()"
  @save="update()"
></panel-header>

<v-card-text>
  <v-overlay 
    :value="loadingContent"
    absolute
  >
    <v-progress-circular       
      indeterminate
      size="64"
      color="primary"
    ></v-progress-circular>
  </v-overlay>

  <v-textarea
    v-model="config"
    filled
    auto-grow
    :disabled="loadingUpdate || loadingReset || loadingContent"
    spellcheck="false"
    autocorrect="off"
    autocapitalize="off"
  ></v-textarea>
</v-card-text>

</div>
</template>

<script>
const PanelHeader = () => import('@/components/PanelHeader')

export default {
	props: ['profile'],

	data () {
		return {
      loadingContent: false,
			loadingUpdate: false,
      loadingReset: false,
      config: null
		}
  },

  components: {
    PanelHeader
  },
  
  async mounted () {
    this.loadingContent = true

    this.config = await this.$axios.$get(`server/config/${this.profile.name}`)

    this.loadingContent = false
  },

	methods: {
		async update () {
      this.loadingUpdate = true
      
      await this.$axios.$put(`server/config/${this.profile.name}`, {
        config: this.config
      })
      
      this.$toast.global.appSuccess(this.$t('config.updated'))
			
			this.loadingUpdate = false			
		},

		async reset () {
      this.loadingReset = true

      const confirm = await this.$confirm(this.$t('common.confirmReset'), { 
        title: this.$t('common.reset'), 
        buttonTrueText: this.$t('common.continue'), 
        buttonFalseText: this.$t('common.cancel'), 
        color: 'warning',
        persistent: true
      })
      
      if (confirm) {
        this.config = await this.$axios.$delete(`server/config/${this.profile.name}`)  
        this.$toast.global.appSuccess(this.$t('config.reseted'))
      }

			this.loadingReset = false
		}
	}
}
</script>