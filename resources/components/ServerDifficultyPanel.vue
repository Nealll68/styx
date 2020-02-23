<template>
<div>

<v-card-title>
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
</v-card-title>

<v-card-text>
	<v-alert
		border="left"
		text 
		type="info" 
		dense
	>
		Pour utiliser une difficulté personalisée vous devez l'activer dans les paramètres de mission en sélectionnant "Personalisé" pour la difficulté
	</v-alert>
</v-card-text>

<v-divider></v-divider>

<v-expansion-panels 
	multiple
	accordion
  v-model="panels"
>
	<v-expansion-panel>
		<v-expansion-panel-header>
			<template v-slot:actions>
				<v-icon color="primary">$expand</v-icon>
			</template>
			Simulation
		</v-expansion-panel-header>
		<v-expansion-panel-content>
			<v-switch
				v-model="serverDifficulty.reduced_damage"
				color="primary"
				inset
				label="Dégâts limités"
			></v-switch>

			<p>Niveau IA</p>
			<v-radio-group 
        v-model="serverDifficulty.ai_level_preset" 
        row
      >
        <v-radio 
          label="Novice" 
          :value="0"
          color="primary"
        ></v-radio>
        <v-radio 
          label="Normal" 
          :value="1"
          color="primary"
        ></v-radio>
        <v-radio 
          label="Expert" 
          :value="2"
          color="primary"
        ></v-radio>
				<v-radio 
          label="Personnalisé" 
          :value="3"
          color="primary"
        ></v-radio>
      </v-radio-group>

			<v-slider
				v-model="serverDifficulty.skill_ai"
				color="primary"
				label="Compétence"
				min="0"
				max="1"
				step="0.05"
				thumb-label="always"
				v-show="serverDifficulty.ai_level_preset === 3"
				class="mt-4"
			></v-slider>

			<v-slider
				v-model="serverDifficulty.precision_ai"
				color="primary"
				label="Précision"
				min="0"
				max="1"
				step="0.05"
				thumb-label="always"
				v-show="serverDifficulty.ai_level_preset === 3"
				class="mt-4"
			></v-slider>
		</v-expansion-panel-content>
	</v-expansion-panel>

	<v-expansion-panel>
		<v-expansion-panel-header>
			<template v-slot:actions>
				<v-icon color="primary">$expand</v-icon>
			</template>
			Perception de la situation
		</v-expansion-panel-header>
		<v-expansion-panel-content>
			<p>Indicateurs de groupe</p>
      <v-radio-group 
        v-model="serverDifficulty.group_indicators" 
        row
      >
        <v-radio 
          label="Cacher" 
          :value="0"
          color="primary"
        ></v-radio>
        <v-radio 
          label="Distance limitée" 
          :value="1"
          color="primary"
        ></v-radio>
        <v-radio 
          label="Montrer" 
          :value="2"
          color="primary"
        ></v-radio>
      </v-radio-group>

			<p>Tags alliés</p>
      <v-radio-group 
        v-model="serverDifficulty.friendly_tags" 
        row
      >
        <v-radio 
          label="Cacher" 
          :value="0"
          color="primary"
        ></v-radio>
        <v-radio 
          label="Distance limitée" 
          :value="1"
          color="primary"
        ></v-radio>
        <v-radio 
          label="Montrer" 
          :value="2"
          color="primary"
        ></v-radio>
      </v-radio-group>

			<p>Tags ennemis</p>
      <v-radio-group 
        v-model="serverDifficulty.enemy_tags" 
        row
      >
        <v-radio 
          label="Cacher" 
          :value="0"
          color="primary"
        ></v-radio>
        <v-radio 
          label="Distance limitée" 
          :value="1"
          color="primary"
        ></v-radio>
        <v-radio 
          label="Montrer" 
          :value="2"
          color="primary"
        ></v-radio>
      </v-radio-group>

			<p>Mines détectées</p>
      <v-radio-group 
        v-model="serverDifficulty.detected_mines" 
        row
      >
        <v-radio 
          label="Cacher" 
          :value="0"
          color="primary"
        ></v-radio>
        <v-radio 
          label="Distance limitée" 
          :value="1"
          color="primary"
        ></v-radio>
        <v-radio 
          label="Montrer" 
          :value="2"
          color="primary"
        ></v-radio>
      </v-radio-group>

			<p>Commandes</p>
      <v-radio-group 
        v-model="serverDifficulty.commands" 
        row
      >
        <v-radio 
          label="Cacher" 
          :value="0"
          color="primary"
        ></v-radio>
        <v-radio 
          label="Fondu" 
          :value="1"
          color="primary"
        ></v-radio>
        <v-radio 
          label="Montrer" 
          :value="2"
          color="primary"
        ></v-radio>
      </v-radio-group>

			<p>Points de passage</p>
      <v-radio-group 
        v-model="serverDifficulty.waypoints" 
        row
      >
        <v-radio 
          label="Cacher" 
          :value="0"
          color="primary"
        ></v-radio>
        <v-radio 
          label="Fondu" 
          :value="1"
          color="primary"
        ></v-radio>
        <v-radio 
          label="Montrer" 
          :value="2"
          color="primary"
        ></v-radio>
      </v-radio-group>

			<v-switch
				v-model="serverDifficulty.tactical_ping"
				color="primary"
				inset
				label="Ping tactique"
			></v-switch>
		</v-expansion-panel-content>
	</v-expansion-panel>

	<v-expansion-panel>
		<v-expansion-panel-header>
			<template v-slot:actions>
				<v-icon color="primary">$expand</v-icon>
			</template>
			Perception personnelle
		</v-expansion-panel-header>
		<v-expansion-panel-content>
			<p>Info sur l'arme</p>
      <v-radio-group 
        v-model="serverDifficulty.weapon_info" 
        row
      >
        <v-radio 
          label="Cacher" 
          :value="0"
          color="primary"
        ></v-radio>
        <v-radio 
          label="Fondu" 
          :value="1"
          color="primary"
        ></v-radio>
        <v-radio 
          label="Montrer" 
          :value="2"
          color="primary"
        ></v-radio>
      </v-radio-group>

			<p>Indicateur de position</p>
      <v-radio-group 
        v-model="serverDifficulty.stance_indicator" 
        row
      >
        <v-radio 
          label="Cacher" 
          :value="0"
          color="primary"
        ></v-radio>
        <v-radio 
          label="Fondu" 
          :value="1"
          color="primary"
        ></v-radio>
        <v-radio 
          label="Montrer" 
          :value="2"
          color="primary"
        ></v-radio>
      </v-radio-group>

			<v-switch
				v-model="serverDifficulty.stamina_bar"
				color="primary"
				inset
				label="Barre d'endurance"
			></v-switch>

			<v-switch
				v-model="serverDifficulty.weapon_crosshair"
				color="primary"
				inset
				label="Réticule"
			></v-switch>

			<v-switch
				v-model="serverDifficulty.vision_aid"
				color="primary"
				inset
				label="Aide à la vision"
			></v-switch>
		</v-expansion-panel-content>
	</v-expansion-panel>


	<v-expansion-panel>
		<v-expansion-panel-header>
			<template v-slot:actions>
				<v-icon color="primary">$expand</v-icon>
			</template>
			Vue
		</v-expansion-panel-header>
		<v-expansion-panel-content>
			<v-switch
				v-model="serverDifficulty.third_person_view"
				color="primary"
				inset
				label="Vue extérieure"
			></v-switch>

			<v-switch
				v-model="serverDifficulty.camera_shake"
				color="primary"
				inset
				label="Vibrations caméra"
			></v-switch>
		</v-expansion-panel-content>
	</v-expansion-panel>

	<v-expansion-panel>
		<v-expansion-panel-header>
			<template v-slot:actions>
				<v-icon color="primary">$expand</v-icon>
			</template>
			Multijoueur
		</v-expansion-panel-header>
		<v-expansion-panel-content>
			<v-switch
				v-model="serverDifficulty.score_table"
				color="primary"
				inset
				label="Tableau des scores"
			></v-switch>

			<v-switch
				v-model="serverDifficulty.death_messages"
				color="primary"
				inset
				label="Tué par"
			></v-switch>

			<v-switch
				v-model="serverDifficulty.von_id"
				color="primary"
				inset
				label="VON ID"
			></v-switch>
		</v-expansion-panel-content>
	</v-expansion-panel>

	<v-expansion-panel>
		<v-expansion-panel-header>
			<template v-slot:actions>
				<v-icon color="primary">$expand</v-icon>
			</template>
			Autre
		</v-expansion-panel-header>
		<v-expansion-panel-content>
			<v-switch
				v-model="serverDifficulty.map_content"
				color="primary"
				inset
				label="Données de carte"
			></v-switch>

			<v-switch
				v-model="serverDifficulty.auto_report"
				color="primary"
				inset
				label="Rapports automatiques"
			></v-switch>

			<v-switch
				v-model="serverDifficulty.multiple_saves"
				color="primary"
				inset
				label="Sauvegardes multiples"
			></v-switch>
		</v-expansion-panel-content>
	</v-expansion-panel>
</v-expansion-panels>

</div>
</template>

<script>
export default {
	props: ['serverDifficulty'],

	data () {
		return {
			panels: [0, 1, 2, 3, 4, 5],
			loadingUpdate: false,
			loadingReset: false
		}
	},

	methods: {
		async update () {
			this.loadingUpdate = true	
			
			const response = await this.$axios.$put(`server/difficulty/${this.serverDifficulty.id}`, this.serverDifficulty)			
			this.$toast.global.appSuccess('Difficulté mise à jour')
			
			this.loadingUpdate = false			
		},

		async reset () {
			this.loadingReset = true

			const response = await this.$axios.$delete(`server/difficulty/${this.serverDifficulty.id}`)
			this.$emit('update', { component: 'difficulty', data: response })
			
			this.$toast.global.appSuccess('Difficulté remise par défaut')
			
			this.loadingReset = false
		}
	}
}
</script>