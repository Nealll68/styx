<template>
<v-card flat>
  <panel-header
    help-link="https://community.bistudio.com/wiki/Arma_3_Startup_Parameters"
    :loadingReset="loadingReset"
    :loadingUpdate="loadingUpdate"
    @reset="reset()"
    @save="update()"
  ></panel-header>

  <v-card-text>
    <v-switch
      v-model="params.auto_init"
      :label="$t('params.autoInitLabel')"
      color="primary"
      inset
      :hint="$t('params.autoInitHint')"
      persistent-hint
    ></v-switch>

    <v-switch
      v-model="params.load_mission_to_memory"
      :label="$t('params.loadMissionToMemoryLabel')"
      color="primary"
      inset
      :hint="$t('params.loadMissionToMemoryHint')"
      persistent-hint
    ></v-switch>

    <v-switch
      v-model="params.no_logs"
      color="primary"
      inset
      :label="$t('params.noLogsLabel')"
      :hint="$t('params.noLogsHint')"
      persistent-hint
    ></v-switch>

    <v-switch
      v-model="params.huge_pages"
      color="primary"
      inset
      :label="$t('params.hugePagesLabel')"
      :hint="$t('params.hugePagesHint')"
      persistent-hint
    ></v-switch>

    <v-switch
      v-model="params.enable_ht"
      color="primary"
      inset
      :label="$t('params.enableHTLabel')"
      :hint="$t('params.enableHTHint')"
      persistent-hint
    ></v-switch>

    <v-switch
      v-model="params.file_patching"
      color="primary"
      inset
      :label="$t('params.filePatchingLabel')"
      :hint="$t('params.filePatchingHint')"
      persistent-hint
    ></v-switch>
  </v-card-text>
</v-card>
</template>

<script>
const PanelHeader = () => import('@/components/PanelHeader')

export default {
  head () {
    return {
      title: `${this.$t('profiles.tabTitles.parameters')} - ${this.$route.params.name}`
    }
  },

  data () {
    return {
      loadingUpdate: false,
      loadingReset: false
    }
  },

  components: {
    PanelHeader
  },

  async asyncData ({ $axios, params }) {
    const profile = await $axios.$get(`server/profile/${params.name}`)        
    return {
      params: profile.params
    }
  },

  methods: {
    async update () {
      this.$emit('loading', true)
      this.loadingUpdate = true

      const response = await this.$axios.$put(
        `server/params/${this.params.id}`,
        this.params
      )
      this.$snackbar({
        type: 'success',
        message: this.$t('params.updated')
      })

      this.loadingUpdate = false
      this.$emit('loading', false)
    },

    async reset() {
      this.$emit('loading', true)
      this.loadingReset = true

      this.params = await this.$axios.$delete(`server/params/${this.params.id}`)     

      this.$snackbar({
        type: 'success',
        message: this.$t('params.reseted')
      })

      this.loadingReset = false
      this.$emit('loading', false)
    }
  }
}
</script>
