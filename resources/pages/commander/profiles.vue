<template>
  <v-container fluid>
    <v-alert
      v-if="!$store.state.config.a3ServerPath"
      text
      type="error"
      border="left"
    >
      Aucun chemin vers le dossier Arma 3 n'a été spécifié. Rendez-vous dans la page "Paramètres" pour le définir.
    </v-alert>

    <v-row v-else>
      <v-col md="12" lg="3">
        <profile-list :profiles="profiles" @show-profile="showProfile($event)" @refresh="refreshProfiles()"></profile-list>
      </v-col>

      <v-col md="12" lg="9">
        <v-alert 
          border="left" 
          text 
          type="info"
          v-if="profile === null"
        >
          Vous pouvez créer un profil utilisant le bouton "Créer un profil"
        </v-alert>

        <v-card v-else>
          <v-overlay 
            :value="loading" 
            absolute
          >
            <v-progress-circular 
              indeterminate 
              color="primary"
            ></v-progress-circular>
          </v-overlay>

          <v-tabs 
            v-model="tab"
            grow
            show-arrows
          >
            <v-tab>Mission</v-tab>           
            <v-tab>Mods</v-tab>
            <v-tab>Paramètres</v-tab>
            <v-tab>Configuration</v-tab>
            <v-tab>Difficulté</v-tab>
          </v-tabs>

          <v-tabs-items v-model="tab">
            <v-tab-item>
              <server-mission-panel 
                :server-config="profile.config" 
                @update="updateComponents($event)"
              ></server-mission-panel>
            </v-tab-item>

            <v-tab-item>
              <server-mods-panel 
                :server-params="profile.params"
                @update="updateComponents($event)"
              ></server-mods-panel>
            </v-tab-item>

            <v-tab-item>
              <server-params-panel 
                v-if="$auth.user.privilege >= 1"
                :server-params="profile.params" 
                @update="updateComponents($event)"
              ></server-params-panel>

              <v-card-text v-else>
                <v-alert
                  type="warning"
                  border="left"
                  text
                >
                  Vous n'avez pas les permissions nécessaire pour modifier cette catégorie
                </v-alert>
              </v-card-text>

            </v-tab-item>

            <v-tab-item>
              <server-config-panel
                v-if="$auth.user.privilege >= 1"
                :server-config="profile.config" 
                @update="updateComponents($event)"
              ></server-config-panel>

              <v-card-text v-else>
                <v-alert
                  type="warning"
                  border="left"
                  text
                >
                  Vous n'avez pas les permissions nécessaire pour modifier cette catégorie
                </v-alert>
              </v-card-text>
            </v-tab-item>

            <v-tab-item>
              <server-difficulty-panel 
                :server-difficulty="profile.difficulty" 
                @update="updateComponents($event)"
              ></server-difficulty-panel>
            </v-tab-item>
          </v-tabs-items>
        </v-card>
      </v-col>
    </v-row>      
  </v-container>
</template>

<script>
const ProfileList = () => import('@/components/ProfileList')
const ServerMissionPanel = () => import('@/components/ServerMissionPanel')
const ServerModsPanel = () => import('@/components/ServerModsPanel')
const ServerParamsPanel = () => import('@/components/ServerParamsPanel')
const ServerConfigPanel = () => import('@/components/ServerConfigPanel')
const ServerDifficultyPanel = () => import('@/components/ServerDifficultyPanel')

export default {
  layout: 'commander',

  components: {
    ProfileList,
    ServerMissionPanel,
    ServerModsPanel,
    ServerParamsPanel,
    ServerConfigPanel,
    ServerDifficultyPanel
  },

  data () {
    return {
      loading: false,
      tab: null
    }
  },

  async asyncData ({ $axios }) {
    const profiles = await $axios.$get('server/profile')

    let defaultProfile = null
    if (profiles.length > 0) {
      defaultProfile = await $axios.$get(`server/profile/${profiles[0].id}`)
    }

    return {
      profile: defaultProfile,
      profiles
    }    
  },

  methods: {
    async showProfile (profileId) {      
      this.loading = true

      const profile = await this.$axios.$get(`server/profile/${profileId}`)
      this.profile = profile

      this.loading = false
    },

    async refreshProfiles () {
      this.profiles = await this.$axios.$get('server/profile')
    },

    updateComponents ({ component, data }) {
      if (component === 'params') {
        this.profile.params = data  
      } else if (component === 'config') {
        this.profile.config = data
      } else if (component === 'difficulty') {
        this.profile.difficulty = data
      } else if (component === 'mission') {
        this.profile.config = data
      }
    }
  }
}
</script>

<style>

</style>