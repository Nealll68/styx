<template>
  <v-dialog
    v-model="show"
    max-width="600px"
    persistent
    :fullscreen="$vuetify.breakpoint.smAndDown"
  >
    <v-card>
      <v-card-title>
        <v-alert
          v-if="!isMission"
          type="error"
          border="left"
          text
          dense
        >{{ $t('upload.updateLocalModInfo') }}</v-alert>

        <v-alert
          v-if="!isMission"
          type="warning"
          border="left"
          text
          dense
        >{{ $t('upload.importantPoints') }} :
          <ul>
            <li>{{ $t('upload.modNaming') }}</li>
            <li>{{ $t('upload.modZip') }}</li>
          </ul>
        </v-alert>

        <v-alert
          v-if="isMission"
          type="info"
          border="left"
          text
          dense
        >{{ $t('upload.updateMission') }}</v-alert>

        <v-alert
          v-if="isMission"
          type="warning"
          border="left"
          text
          dense
        >{{ $t('upload.importantPoints') }} :
          <ul>
            <li>{{ $t('upload.missionNaming') }}</li>
            <li>{{ $t('upload.missionExtension') }}</li>
          </ul>
        </v-alert>    
      </v-card-title>

      <v-card-text>
        <v-file-input
          v-model="file"
          :label="isMission ? $t('upload.missionLabel') : $t('upload.modLabel')"
          :accept="isMission ? '.pbo' : '.zip'"
          filled
          hide-details
          show-size
          single-line
        ></v-file-input>

        <v-sheet 
          v-show="uploadPercentage > 0"
          class="text-center" 
        >
          <div class="mt-5 mb-2">
            <v-progress-circular            
              v-model="uploadPercentage"
              size="64"
              color="primary"
            >{{ uploadPercentage }}%</v-progress-circular>
          </div>

          <v-btn
            outlined
            color="error"
            small
            @click="cancelUpload"
          >
            <v-icon left>{{ mdiUploadOff }}</v-icon>{{ $t('common.cancel') }}
          </v-btn>
        </v-sheet>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn
          text
          @click="$emit('close')"
          :disabled="uploadPercentage > 0 && uploadPercentage < 100"
        >{{ $t('common.close') }}</v-btn>

        <v-btn
          depressed
          color="primary"
          @click="upload()"
          :disabled="(uploadPercentage > 0 && uploadPercentage < 100) || !file"
        >{{ $t('common.continue') }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mdiUploadOff } from '@mdi/js'

export default {
  props: {
    show: Boolean, 
    isMission: {
      type: Boolean,
      default: false
    }
  },

  data: () => ({
    file: null,
    uploadPercentage: 0,
    source: null,
    mdiUploadOff
  }),

  methods: {
    async upload () {
      if (!this.file) return this.$snackbar({
        type: 'info',
        message: this.$t('upload.selectFileError')
      })

      try {
        this.source = this.$axios.CancelToken.source()

        let formData = new FormData()
        formData.append('file', this.file)

        await this.$axios.$post(this.isMission ? 'server/mission' : 'server/mod', formData, {
          cancelToken: this.source.token,
          headers: {
            'content-type': 'multipart/form-data'
          },
          onUploadProgress: function (progressEvent) {
            this.uploadPercentage = parseInt(Math.round((progressEvent.loaded / progressEvent.total) * 100))
          }.bind(this)
        })

        this.$emit('file-uploaded')
        this.uploadPercentage = 0

        this.$snackbar({
          type: 'success',
          message:this.$t('upload.success')
        })

        this.file = null
        this.$emit('close')
      } catch (ex) {
        if (ex.response.data === 'E_INVALID_FILE_EXTENSION') {
          this.$snackbar({
            type: 'error',
            message: this.$t('upload.fileExtensionError', { extension: this.isMission ? 'pbo' : 'zip' })
          })
        }
      }
    },

    cancelUpload () {
      this.source.cancel()
      this.uploadPercentage = 0
      this.file = null

      this.$snackbar({
        type: 'success',
        message: this.$t('upload.canceled')
      })        
    }
  }
}
</script>
