<template>
<div>

<v-card-text>
  <v-subheader>Difficulté</v-subheader>
  <v-btn-toggle
    v-model="serverConfig.mission_difficulty"
    mandatory
    color="primary"
    @change="changeDifficulty()"
  >
    <v-btn
      value="Recruit"
      text
      :loading="difficultyLoading"
    >
      <v-icon left>mdi-emoticon</v-icon>Recrue
    </v-btn>

    <v-btn
      value="Regular"
      text
      :loading="difficultyLoading"
    >
      <v-icon left>mdi-emoticon-cool</v-icon>Normal
    </v-btn>

    <v-btn
      value="Veteran"
      text
      :loading="difficultyLoading"
    >
      <v-icon left>mdi-emoticon-dead</v-icon>Vétéran
    </v-btn>
    
    <v-btn
      value="Custom"
      text
      :loading="difficultyLoading"
    >
      <v-icon left>mdi-emoticon-neutral</v-icon>Personalisé
    </v-btn>    
  </v-btn-toggle>
</v-card-text>

<v-divider></v-divider>

<v-card-text>
  <v-overflow-btn
    v-model="selected"
    :items="missions"
    no-data-text="Aucune mission disponible"
    label="Ajouter une mission"
    editable
    filled
    hint="Sélectionnez une mission et cliquez sur ajouter pour l'activer sur le serveur"
    persistent-hint
    class="my-2"
  >
    <template v-slot:append-outer>
      <v-btn
        text
        color="primary"
        @click="addMission()"
        :loading="loading"
      >Ajouter</v-btn>
    </template>
  </v-overflow-btn>
</v-card-text>

<v-divider></v-divider>

<v-card-text>
  <v-list>
    <v-subheader>Mission(s) activée(s) (plusieurs missions activées créeront une rotation)</v-subheader>

    <v-subheader v-if="activatedMissions.length === 0">
      Aucune mission d'activée
    </v-subheader>

    <v-list-item 
      v-for="(mission, index) in activatedMissions" 
      :key="`mission-${index}`"
    >
      <v-list-item-content>
        <v-list-item-title>{{ mission }}</v-list-item-title>
      </v-list-item-content>

      <v-list-item-action>
        <v-btn
          text
          icon
          color="error"    
          @click="deleteMission(mission)"      
        >
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </v-list-item-action>      
    </v-list-item>
  </v-list>
</v-card-text>

</div>
</template>

<script>
export default {
	props: ['serverConfig'],

	data () {
		return {
      loading: false,
      difficultyLoading: false,
      selected: null,
      missions: [],
      activatedMissions: []
		}
  },

	async mounted () {
		this.loading = true
		
    const missions = await this.$axios.$get('server/mission')

    if (this.serverConfig.mission_name) this.activatedMissions = this.serverConfig.mission_name.split(';')
    if (missions.length > 0) this.missions = missions
                                              .map(e => e.filename.slice(0, -4))
                                              .filter(e => !this.activatedMissions.includes(e))

		this.loading = false
	},

	methods: {
    async changeDifficulty () {
      this.difficultyLoading = true

      const response = await this.$axios.$put(`server/config/${this.serverConfig.id}`, {
        mission_difficulty: this.serverConfig.mission_difficulty,
      })

      this.$emit('update', { component: 'mission', data: response })
      this.$toast.global.appSuccess('Diffculté mise à jour')

      this.difficultyLoading = false
    },

		async addMission () {
			this.loading = true
      
      let missions = this.selected
      if (this.serverConfig.mission_name) {
        missions = this.serverConfig.mission_name.split(';')
        missions.push(this.selected)
        missions = missions.join(';')
      }

      const response = await this.$axios.$put(`server/config/${this.serverConfig.id}`, {
        mission_name: missions,
      })

      this.$emit('update', { component: 'mission', data: response })      

      this.activatedMissions.push(this.selected)
      this.missions.splice(this.missions.indexOf(this.selected), 1)      
      this.selected = null

      this.$toast.global.appSuccess('Liste des missions mise à jour')

			this.loading = false
    },
    
    async deleteMission (mission) {
      let missions = this.serverConfig.mission_name.split(';')
      if (missions.length > 1) {
        missions.splice(missions.indexOf(mission), 1)
        missions = missions.join(';')
      } else {
        missions = ''
      }

      const response = await this.$axios.$put(`server/config/${this.serverConfig.id}`, {
        mission_name: missions,
      })

      this.$emit('update', { component: 'mission', data: response })

      this.missions.push(mission)
      this.activatedMissions.splice(this.activatedMissions.indexOf(mission), 1)

      this.$toast.global.appSuccess('Liste des missions mise à jour')
    }
	}
}
</script>