<template>
<v-card flat>
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
</v-card>
</template>

<script>
const PanelHeader = () => import('@/components/PanelHeader')

export default {
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

    this.config = await this.$axios.$get(`server/config/${this.$route.params.name}`)

    this.$emit('loading', false)
  },

	methods: {
		async update () {
      this.$emit('loading', true)
      this.loadingUpdate = true
      
      await this.$axios.$put(`server/config/${this.$route.params.name}`, {
        config: this.config
      })
      
      this.$snackbar({
        type: 'success',
        message: this.$t('config.updated')
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
          message: this.$t('config.reseted')
        })
      }

      this.loadingReset = false
      this.$emit('loading', false)
		}
	}
}
</script>