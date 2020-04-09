<template>
<v-card flat>
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
</v-card>
</template>

<script>
const PanelHeader = () => import('@/components/PanelHeader')

export default {
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

    this.difficulty = await this.$axios.$get(`server/difficulty/${this.$route.params.name}`)

    this.$emit('loading', false)
  },

	methods: {
		async update () {
      this.$emit('loading', true)
      this.loadingUpdate = true
      
      await this.$axios.$put(`server/difficulty/${this.$route.params.name}`, {
        config: this.difficulty
      })
      
      this.$snackbar({
        type: 'success',
        message: this.$t('difficulty.updated')
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
          message: this.$t('difficulty.reseted')
        })
      }

      this.loadingReset = false
      this.$emit('loading', false)
		}
	}
}
</script>