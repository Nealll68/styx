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
  <v-textarea
    v-model="config"
    filled
    auto-grow
    :disabled="loadingUpdate || loadingReset"
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
			loadingUpdate: false,
      loadingReset: false,
      config: null
		}
  },

  components: {
    PanelHeader
  },
  
  async mounted () {
    this.$emit('loading', true)

    this.config = await this.$axios.$get(`server/config/${this.profile.name}`)

    this.$emit('loading', false)
  },

	methods: {
		async update () {
      this.$emit('loading', true)
      this.loadingUpdate = true
      
      await this.$axios.$put(`server/config/${this.profile.name}`, {
        config: this.config
      })
      
      this.$toast.global.appSuccess(this.$t('config.updated'))
			
      this.loadingUpdate = false	
      this.$emit('loading', false)		
		},

		async reset () {
      this.$emit('loading', true)
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
      this.$emit('loading', false)
		}
	}
}
</script>