<template>
<div>

<panel-header
  help-link="https://community.bistudio.com/wiki/Arma_3_Startup_Parameters"
  :loadingReset="loadingReset"
  :loadingUpdate="loadingUpdate"
  @reset="reset()"
  @save="update()"
></panel-header>

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
const PanelHeader = () => import('@/components/PanelHeader')

export default {
  props: ['serverParams'],

  data() {
    return {
      loadingUpdate: false,
      loadingReset: false
    }
  },

  components: {
    PanelHeader
  },

  methods: {
    async update() {
      this.loadingUpdate = true

      const response = await this.$axios.$put(
        `server/params/${this.serverParams.id}`,
        this.serverParams
      )
      this.$toast.global.appSuccess(this.$t('params.updated'))

      this.loadingUpdate = false
    },

    async reset() {
      this.loadingReset = true

      const response = await this.$axios.$delete(
        `server/params/${this.serverParams.id}`
      )
      this.$emit('update', { component: 'params', data: response })

      this.$toast.global.appSuccess(this.$t('params.reseted'))

      this.loadingReset = false
    }
  }
}
</script>
