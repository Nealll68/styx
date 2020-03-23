<template>
  <div>
    <v-toolbar flat short>
      <v-spacer></v-spacer>

      <v-btn
        color="tertiary"
        text
        href="https://community.bistudio.com/wiki/Arma_3_Startup_Parameters"
        target="_blank"
      >
        <v-icon left>mdi-help-circle</v-icon>{{ $t('common.help') }}
      </v-btn>

      <v-btn color="quaternary" text :loading="loadingReset" @click="reset()">
        <v-icon left>mdi-alert-circle</v-icon>{{ $t('common.reset') }}
      </v-btn>

      <v-btn color="primary" text :loading="loadingUpdate" @click="update()">
        <v-icon left>mdi-content-save</v-icon>{{ $t('common.save') }}
      </v-btn>
    </v-toolbar>

    <v-card-text>
      <v-switch
        v-model="serverParams.auto_init"
        :label="$t('params.autoInitLabel')"
        color="primary"
        inset
        :hint="$t('params.autoInitHint')"
        persistent-hint
      ></v-switch>

      <v-switch
        v-model="serverParams.load_mission_to_memory"
        :label="$t('params.loadMissionToMemoryLabel')"
        color="primary"
        inset
        :hint="$t('params.loadMissionToMemoryHint')"
        persistent-hint
      ></v-switch>

      <v-switch
        v-model="serverParams.no_logs"
        color="primary"
        inset
        :label="$t('params.noLogsLabel')"
        :hint="$t('params.noLogsHint')"
        persistent-hint
      ></v-switch>

      <v-switch
        v-model="serverParams.huge_pages"
        color="primary"
        inset
        :label="$t('params.hugePagesLabel')"
        :hint="$t('params.hugePagesHint')"
        persistent-hint
      ></v-switch>

      <v-switch
        v-model="serverParams.enable_ht"
        color="primary"
        inset
        :label="$t('params.enableHTLabel')"
        :hint="$t('params.enableHTHint')"
        persistent-hint
      ></v-switch>

      <v-switch
        v-model="serverParams.file_patching"
        color="primary"
        inset
        :label="$t('params.filePatchingLabel')"
        :hint="$t('params.filePatchingHint')"
        persistent-hint
      ></v-switch>
    </v-card-text>
  </div>
</template>

<script>
export default {
  props: ['serverParams'],

  data() {
    return {
      loadingUpdate: false,
      loadingReset: false
    }
  },

  methods: {
    async update() {
      this.loadingUpdate = true

      const response = await this.$axios.$put(
        `server/params/${this.serverParams.id}`,
        this.serverParams
      )
      this.$toast.global.appSuccess($t('params.updated'))

      this.loadingUpdate = false
    },

    async reset() {
      this.loadingReset = true

      const response = await this.$axios.$delete(`server/params/${this.serverParams.id}`)
      this.$emit('update', { component: 'params', data: response })

      this.$toast.global.appSuccess($t('params.reseted'))

      this.loadingReset = false
    }
  }
}
</script>
