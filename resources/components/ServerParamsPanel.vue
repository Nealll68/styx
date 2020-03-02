<template>
<div>

<v-card-title>
  <v-spacer></v-spacer>

  <v-btn
    color="tertiary"
    text
    href="https://community.bistudio.com/wiki/Arma_3_Startup_Parameters"			
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
    <v-icon left>mdi-content-save</v-icon> Enregistrer les paramètres
  </v-btn>
</v-card-title>

<v-divider></v-divider>

<v-card-text>
	<v-switch
		v-model="serverParams.auto_init"
		label="Initialisation automatique de la mission"
		color="primary"
		inset
		hint="-autoInit - Initialise la mission comme le premier client le fait. Si activé, vérifier que la mission soit persistente sinon le serveur ne démarre pas"
		persistent-hint
	></v-switch>

	<v-switch
		v-model="serverParams.load_mission_to_memory"
		label="Charger la mission dans la mémoire"
		color="primary"
		inset
		hint="-loadMissionToMemory - Met la mission en cache lors du premier téléchargement"
		persistent-hint
	></v-switch>

	<v-switch
		v-model="serverParams.no_logs"
		color="primary"
		inset
		label="Pas de logs"
		hint="-noLogs - Désactive l'écriture de logs"
		persistent-hint	
	></v-switch>

	<v-switch
		v-model="serverParams.huge_pages"
		color="primary"
		inset
		label="Autoriser les pages volumineuses"
		hint="-hugepages - Active les pages volumineuses pour le serveur et les clients"
		persistent-hint
	></v-switch>

	<v-switch
		v-model="serverParams.enable_ht"
		color="primary"
		inset
		label="Activer l'HyperThreading"
		hint="-enableHT - Active l'utilisation de tous les cœurs logiques du CPU. Si le processeur n'est pas compatible, le paramètre est ignoré"
		persistent-hint
	></v-switch>

	<v-switch
		v-model="serverParams.file_patching"
		color="primary"
		inset
		label="Autoriser le file patching"
		hint="-filePatching - Autorise le jeu à charger les données décompressées"
		persistent-hint
	></v-switch>
</v-card-text>

</div>
</template>

<script>
export default {
	props: ['serverParams'],

	data () {
		return {
      panels: [0, 1],
			loadingUpdate: false,
			loadingReset: false,
			requiredRule: [
				v => !!v || 'Veuillez préciser un port (par défaut : 2302)'
			]
		}
	},

	methods: {
		async update () {
			this.loadingUpdate = true	
			
			const response = await this.$axios.$put(`server/params/${this.serverParams.id}`, this.serverParams)			
			this.$toast.global.appSuccess('Paramètres mis à jour')
			
			this.loadingUpdate = false			
		},

		async reset () {
			this.loadingReset = true

			const response = await this.$axios.$delete(`server/params/${this.serverParams.id}`)
			this.$emit('update', { component: 'params', data: response })
			
			this.$toast.global.appSuccess('Paramètres remis par défaut')

			this.loadingReset = false
		}
	}
}
</script>