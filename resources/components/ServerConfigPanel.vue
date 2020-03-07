<template>
<div>

<v-toolbar
  flat
  short
>
  <v-spacer></v-spacer>

  <v-btn
    color="tertiary"
    text
    href="https://community.bistudio.com/wiki/server.cfg#Example_Configuration_File"			
    target="_blank"
  >
    <v-icon left>mdi-help-circle</v-icon> Aide
  </v-btn>

  <v-btn
    color="quaternary"
    text
    :loading="loadingReset"
    @click="reset()"	
  >
    <v-icon left>mdi-alert-circle</v-icon> Rétablir par défaut			
  </v-btn>

  <v-btn
    color="primary"
    text
    :loading="loadingUpdate"
    @click="update()"
  >
    <v-icon left>mdi-content-save</v-icon> Enregistrer la config
  </v-btn>
</v-toolbar>

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
      
      this.$toast.global.appSuccess('Config mise à jour')
			
			this.loadingUpdate = false			
		},

		async reset () {
      this.loadingReset = true

      const confirm = await this.$confirm('Etes-vous sûr de vouloir rétatblir la configuration par défaut ?', { 
        title: 'Rétablir par défaut', 
        buttonTrueText: 'Continuer', 
        buttonFalseText: 'Annuler', 
        color: 'warning',
        persistent: true
      })
      
      if (confirm) {
        this.config = await this.$axios.$delete(`server/config/${this.profile.name}`)  
        this.$toast.global.appSuccess('Config remise par défaut')
      }

			this.loadingReset = false
		}
	}
}
</script>