<template>
<div>
  <v-container fluid>
    <v-alert
      v-if="!$store.state.config.a3ServerPath"
      text
      type="error"
      border="left"
    >
      Aucun chemin vers le dossier Arma 3 n'a été spécifié. Rendez-vous dans la page "Paramètres" pour le définir.
    </v-alert>

    <v-row
      v-else
      justify="center"
    >
      <v-col 
        v-if="$auth.user.privilege >= 1"
        cols="md-12"
      >
        <v-tooltip left>
          <template v-slot:activator="{ on }">
            <v-btn
              icon
              color="primary"
              class="float-right"
              v-on="on"
              @click="detectExistingMission()"
            >
              <v-icon>mdi-file-search</v-icon>
            </v-btn>            
          </template>
          Détecter les missions existantes
        </v-tooltip>      

        <v-btn
          text
          color="primary"
          class="float-right mx-2"
          @click="showUploadDialog = true"
        >
          <v-icon left>mdi-plus-box</v-icon>Ajouter une mission
        </v-btn>         
      </v-col>

      <v-col cols="md-12">
        <v-card>    
          <v-card-title class="headline">
            <h3>Missions</h3>
            <v-spacer></v-spacer>

            <v-text-field
              v-model="missionSearch"
              append-icon="mdi-magnify"
              label="Rechercher une mission"
              single-line
              hide-details
              filled
              dense
            ></v-text-field>            
          </v-card-title>

          <v-divider></v-divider>

          <v-card-text>
            <v-data-table
              :items="missions" 
              :headers="missionHeaders"
              sort-by="updated_at"
		          sort-desc
              disable-pagination 
              hide-default-footer
              no-data-text="Aucune mission ajoutée"
              no-results-text="Aucun résultat"
              :search="missionSearch"
              :loading="tableLoading"
            >           

              <template v-slot:item.updated_at="{ item }">
                {{ $moment(item.updated_at).format('DD MMM YYYY à HH:mm') }}
              </template>

              <template v-slot:item.size="{ item }">
                {{ formatBytes(item.size) }}
              </template>

              <template v-slot:item.action="{ item }">
                <v-btn
                  v-if="$auth.user.privilege >= 1" 
                  text
                  icon
                  color="error"
                  @click="deleteMission(item)"
                  :disabled="tableLoading"
                >
                  <v-icon>mdi-delete</v-icon>  
                </v-btn>         
              </template>                
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>

  <upload-dialog :show="showUploadDialog" @file-uploaded="refershMissionList()" @close="showUploadDialog = false" isMission></upload-dialog>
</div>
</template>

<script>
const UploadDialog = () => import('@/components/UploadDialog')

export default {
  layout: 'commander',

  components: {
    UploadDialog
  },

  data () {
    return {
      showUploadDialog: false,
      tableLoading: false,
      missionSearch: '',
      missionHeaders: [
        { text: 'Nom', value: 'name' },
        { text: 'Carte', value: 'map' },
        { text: 'Taille', value: 'size' },
        { text: `Date d'ajout`, value: 'updated_at' },
        { text: '', value: 'action', sortable: false }
      ],
    }
  },

  async asyncData ({ $axios }) {
    const missions = await $axios.$get('server/mission')

    return {
      missions
    }
  },

  methods: {
    async refershMissionList () {
      this.tableLoading = true

      this.missions = await this.$axios.$get('server/mission')

      this.tableLoading = false
    },

    async deleteMission (mission) {
      this.tableLoading = true

      await this.$axios.$delete(`server/mission/${mission.id}`)
      this.missions.splice(this.missions.indexOf(mission), 1)

      this.tableLoading = false
    },

    async detectExistingMission () {
      this.tableLoading = true

      await this.$axios.$get(`server/mission/detect`)
      await this.refershMissionList()

      this.tableLoading = false
    },

    formatBytes (bytes) {
      const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
      const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 10)

      if (i === 0) return `${bytes} ${sizes[i]}`

      return `${(bytes / (1024 ** i)).toFixed(1)} ${sizes[i]}`
    }
  }
}
</script>