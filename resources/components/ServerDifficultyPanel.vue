<template>
<div>

<panel-header
  help-link="https://community.bistudio.com/wiki/server.armaprofile#Example_Configuration_File"
  :loadingReset="loadingReset"
  :loadingUpdate="loadingUpdate"
  @reset="reset()"
  @save="update()"
></panel-header>

<v-card-text>
	<v-alert
		border="left"
		text 
		type="info" 
		dense
	>{{ $t('difficulty.information') }}</v-alert>

  <v-textarea
    v-model="difficulty"
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
      difficulty: null
		}
  },
  
  components: {
    PanelHeader
  },

	async mounted () {
    this.$emit('loading', true)

    this.difficulty = await this.$axios.$get(`server/difficulty/${this.profile.name}`)

    this.$emit('loading', false)
  },

	methods: {
		async update () {
      this.$emit('loading', true)
      this.loadingUpdate = true
      
      await this.$axios.$put(`server/difficulty/${this.profile.name}`, {
        config: this.difficulty
      })
      
      this.$toast.global.appSuccess(this.$t('difficulty.updated'))
			
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
        this.difficulty = await this.$axios.$delete(`server/difficulty/${this.profile.name}`)  
        this.$toast.global.appSuccess(this.$t('difficulty.reseted'))
      }

      this.loadingReset = false
      this.$emit('loading', false)
		}
	}
}
</script>