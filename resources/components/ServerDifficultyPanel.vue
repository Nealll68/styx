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
    href="https://community.bistudio.com/wiki/server.armaprofile#Example_Configuration_File"			
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
    <v-icon left>mdi-content-save</v-icon> Enregistrer la difficulté
  </v-btn>
</v-toolbar>

<v-card-text>
	<v-alert
		border="left"
		text 
		type="info" 
		dense
	>
		Pour utiliser une difficulté personalisée indiqué "Custom" dans le fichier de configuration du serveur.
	</v-alert>

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
    v-model="difficulty"
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
      difficulty: null
		}
	},

	async mounted () {
    this.loadingContent = true

    this.difficulty = await this.$axios.$get(`server/difficulty/${this.profile.name}`)

    this.loadingContent = false
  },

	methods: {
		async update () {
      this.loadingUpdate = true
      
      await this.$axios.$put(`server/difficulty/${this.profile.name}`, {
        config: this.difficulty
      })
      
      this.$toast.global.appSuccess('Diffculté mise à jour')
			
			this.loadingUpdate = false			
		},

		async reset () {
      this.loadingReset = true

      const confirm = await this.$confirm('Etes-vous sûr de vouloir rétatblir la difficulté par défaut ?', { 
        title: 'Rétablir par défaut', 
        buttonTrueText: 'Continuer', 
        buttonFalseText: 'Annuler', 
        color: 'warning',
        persistent: true
      })
      
      if (confirm) {
        this.difficulty = await this.$axios.$delete(`server/difficulty/${this.profile.name}`)  
        this.$toast.global.appSuccess('Diffculté remise par défaut')
      }

			this.loadingReset = false
		}
	}
}
</script>