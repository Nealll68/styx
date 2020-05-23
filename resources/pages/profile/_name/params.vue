<template>
<v-card flat>
  <v-banner
    app
    sticky
  >    
    <template v-slot:actions>
      <v-btn
        :icon="$vuetify.breakpoint.xsOnly"
        color="tertiary"
        text
        href="https://community.bistudio.com/wiki/Arma_3_Startup_Parameters"
        target="_blank"
      >
        <v-icon :left="$vuetify.breakpoint.smAndUp">mdi-help-circle</v-icon>{{ $vuetify.breakpoint.xsOnly ? '' : $t('common.help') }}
      </v-btn>
    </template>
  </v-banner>

  <v-card-text>
    <v-switch
      v-model="params.auto_init"
      :label="$t('params.autoInitLabel')"
      color="primary"
      inset
      :hint="$t('params.autoInitHint')"
      persistent-hint
      :disable="loading"
      :readonly="loading"
      @change="update"
    ></v-switch>

    <v-switch
      v-model="params.load_mission_to_memory"
      :label="$t('params.loadMissionToMemoryLabel')"
      color="primary"
      inset
      :hint="$t('params.loadMissionToMemoryHint')"
      persistent-hint
      :disable="loading"
      :readonly="loading"
      @change="update"
    ></v-switch>

    <v-switch
      v-model="params.no_logs"
      color="primary"
      inset
      :label="$t('params.noLogsLabel')"
      :hint="$t('params.noLogsHint')"
      persistent-hint
      :disable="loading"
      :readonly="loading"
      @change="update"
    ></v-switch>

    <v-switch
      v-model="params.huge_pages"
      color="primary"
      inset
      :label="$t('params.hugePagesLabel')"
      :hint="$t('params.hugePagesHint')"
      persistent-hint
      :disable="loading"
      :readonly="loading"
      @change="update"
    ></v-switch>

    <v-switch
      v-model="params.enable_ht"
      color="primary"
      inset
      :label="$t('params.enableHTLabel')"
      :hint="$t('params.enableHTHint')"
      persistent-hint
      :disable="loading"
      :readonly="loading"
      @change="update"
    ></v-switch>

    <v-switch
      v-model="params.file_patching"
      color="primary"
      inset
      :label="$t('params.filePatchingLabel')"
      :hint="$t('params.filePatchingHint')"
      persistent-hint
      :disable="loading"
      :readonly="loading"
      @change="update"
    ></v-switch>

    <v-switch
      v-model="params.custom_cfg"
      color="primary"
      inset
      :label="$t('params.customCfgLabel')"
      :hint="$t('params.customCfgHint')"
      persistent-hint
      :disable="loading"
      :readonly="loading"
      @change="update"
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
      loading: false
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
      this.loading = true

      const response = await this.$axios.$put(
        `server/params/${this.params.id}`,
        this.params
      )
      this.$snackbar({
        type: 'success',
        message: this.$t('params.updated')
      })

      this.loading = false
      this.$emit('loading', false)
    }
  }
}
</script>
