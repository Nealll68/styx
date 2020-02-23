<template>
  <v-dialog
    v-model="show"
    max-width="600px"
    persistent
  >
    <v-card>
      <v-card-title>
        <v-alert
          v-if="!isMission"
          type="error"
          border="left"
          text
          dense
        >Si vous voulez mettre à jour un mod local, supprimez-le avant.</v-alert>

        <v-alert
          v-if="!isMission"
          type="warning"
          border="left"
          text
          dense
        >Points important :
          <ul>
            <li>Le dossier du mod doit être correctement nommé (avec un "@" devant le nom et sans espace)</li>
            <li>Le dossier du mod doit être mis dans un .zip</li>
          </ul>
        </v-alert>

        <v-alert
          v-if="isMission"
          type="info"
          border="left"
          text
          dense
        >Pour mettre à jour une mission il suffitt de la retélécharger sur le serveur.</v-alert>

        <v-alert
          v-if="isMission"
          type="warning"
          border="left"
          text
          dense
        >Points important :
          <ul>
            <li>La mission doit être correctement nommée (sans espace et un nom de map valide)</li>
            <li>La mission doit être un fichier avec comme extension .pbo</li>
          </ul>
        </v-alert>    
      </v-card-title>

      <v-card-text>
        <v-file-input
          v-model="file"
          :label="isMission ? 'Fichier PBO' : 'Dossier ZIP contenant le mod'"
          :accept="isMission ? '.pbo' : '.zip'"
          filled
          hide-details
          show-size
          single-line
        ></v-file-input>

        <div class="text-center">
          <v-progress-circular
            v-show="uploadPercentage > 0"
            v-model="uploadPercentage"
            size="50"
            color="primary"
            class="mt-5"   
          >{{ uploadPercentage }}</v-progress-circular>
        </div>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn
          text
          @click="$emit('close')"
        >Fermer</v-btn>

        <v-btn
          text
          color="primary"
          @click="upload()"
        >Continuer</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    show: Boolean, 
    isMission: {
      type: Boolean,
      default: false
    }
  },

  data () {
    return {
      file: null,
      uploadPercentage: 0
    }
  },

  methods: {
    async upload () {
      if (!this.file) return this.$toast.global.appInfo('Veuillez sélectionner un fichier')

      try {
        let formData = new FormData()
        formData.append('file', this.file)

        await this.$axios.$post(this.isMission ? 'server/mission' : 'server/mod', formData, {
          headers: {
            'content-type': 'multipart/form-data'
          },
          onUploadProgress: function (progressEvent) {
            this.uploadPercentage = parseInt(Math.round((progressEvent.loaded / progressEvent.total) * 100))
          }.bind(this)
        })

        this.$emit('file-uploaded')
        this.uploadPercentage = 0

        if (this.isMission) {
          this.$toast.global.appSuccess('Téléchargement réussi')
        } else {
          this.$toast.global.appSuccess('Téléchargement réussi. Utilisez "Ajouter un mod existant" pour l\'utiliser')
        }

        this.file = null
        this.$emit('close')
      } catch (ex) {
        if (ex.response.data === 'E_INVALID_FILE_EXTENSION') {
          if (this.isMission) {
            this.$toast.global.appError('Le fichier doit être un pbo')
          } else {
            this.$toast.global.appError('Le fichier doit être un zip')
          }
        }
      }
    },
  }
}
</script>
