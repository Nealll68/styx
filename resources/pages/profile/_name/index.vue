<template>
  <v-card flat>
    <panel-header
      :loadingReset="loadingReset"
      :loadingUpdate="loadingUpdate"
      @reset="reset()"
      @save="update()"
    >
      <v-chip 
        label
        class="mx-1 hidden-xs-only"
      >{{ $t('serverMod.modsActivated') }} : {{ mods.filter(e => e.activated).length }}</v-chip>

      <v-chip
        label
        class="mx-1 hidden-xs-only"
      >{{ $t('serverMod.serverModsActivated') }} : {{ mods.filter(e => e.server_mod).length }}</v-chip>
    </panel-header>

    <v-card-text>
      <v-text-field
        v-model="modsSearch"
        :append-icon="icons.mdiToyBrickSearch"
        :label="$t('mods.search')"
        single-line
        hide-details
        filled
        dense
      ></v-text-field>
    </v-card-text>

    <v-card-text>
      <v-data-table
        :items="mods"
        :headers="modsHeaders"
        disable-pagination
        sort-by="activated"
        sort-desc
        hide-default-footer
        :no-data-text="$t('mods.noMods')"
        :no-results-text="$t('common.noResult')"
        :search="modsSearch"
        :loading="loading"
      >
        <template v-slot:item.activated="{ item }">
          <v-simple-checkbox
            v-model="item.activated"
            :disabled="item.server_mod ? true : false"
            color="primary"
            hide-details
            class="pt-0 my-2"
          ></v-simple-checkbox>
        </template>

        <template v-slot:item.server_mod="{ item }">
          <v-simple-checkbox
            v-model="item.server_mod"
            :disabled="item.activated ? true : false"
            color="primary"
            hide-details
            class="pt-0 my-2"
          ></v-simple-checkbox>
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<script>
import { mdiToyBrickSearch } from '@mdi/js'
const PanelHeader = () => import('@/components/PanelHeader')

export default {
  head () {
    return {
      title: `${this.$t('profiles.tabTitles.mods')} - ${this.$route.params.name}`
    }
  },

  data () {
    return {
      loading: false,
      loadingUpdate: false,
      loadingReset: false,
      mods: [],
      modsSearch: '',
      modsHeaders: [
        { text: this.$t('common.name'), value: 'name' },
        { text: '-mod', value: 'activated' },
        { text: '-serverMod', value: 'server_mod' }
      ],
      paramsId: null,
      icons: {
        mdiToyBrickSearch
      }
    }
  },

  components: {
    PanelHeader
  },

  async mounted () {
    this.loading = true

    const profile = await this.$axios.$get(`server/profile/${this.$route.params.name}`)        
    const params = profile.params
    this.paramsId = params.id

    let activatedMods = []
    if (params.mods) {
      activatedMods = params.mods.split(';')
    }

    let activatedServerMods = []
    if (params.server_mod) {
      activatedServerMods = params.server_mod.split(';')
    }

    this.mods = await this.$axios.$get('server/mod')

    this.mods.forEach(element => {
      element.activated = activatedMods.includes(element.name)
      element.server_mod = activatedServerMods.includes(element.name)
    })

    this.loading = false
  },

  methods: {
    async save () {
      this.$emit('loading', true)
      this.loadingUpdate = true

      const mods = this.mods
        .filter(element => element.activated)
        .map(element => element.name)
        .join(';')
      
      const serverMods = this.mods
        .filter(element => element.server_mod)
        .map(element => element.name)
        .join(';')

      await this.$axios.$put(`server/params/${this.paramsId}`, {
        mods,
        server_mod: serverMods
      })

      this.$snackbar({
        type: 'success',
        message: this.$t('serverMod.updated')
      })

      this.loadingUpdate = false
      this.$emit('loading', false)
    },

    async reset () {
      this.$emit('loading', true)
      this.loadingReset = true

      this.mods.forEach(element => {
        element.activated = false
        element.server_mod = false
      })

      await this.$axios.$put(`server/params/${this.paramsId}`, {
        mods: '',
        server_mod: ''
      })

      this.$snackbar({
        type: 'success',
        message: this.$t('serverMod.reseted')
      })

      this.loadingReset = false
      this.$emit('loading', false)
    }
  }
}
</script>
