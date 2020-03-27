<template>
  <div>
    <v-toolbar flat short>
      <v-chip label class="mx-1"
        >{{ $t('serverMod.modsActivated') }} : {{ mods.filter(e => e.activated).length }}</v-chip
      >

      <v-chip label class="mx-1"
        >{{ $t('serverMod.serverModsActivated') }} : {{ mods.filter(e => e.server_mod).length }}</v-chip
      >

      <v-spacer></v-spacer>

      <v-btn color="primary" text :loading="loadingUpdate" @click="save()">
        <v-icon left>mdi-content-save</v-icon>{{ $t('common.save') }}
      </v-btn>
    </v-toolbar>

    <v-card-text>
      <v-text-field
        v-model="modsSearch"
        append-icon="mdi-toy-brick-search"
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
  </div>
</template>

<script>
export default {
  props: ['serverParams'],

  data() {
    return {
      loading: false,
      loadingUpdate: false,
      mods: [],
      modsSearch: '',
      modsHeaders: [
        { text: 'Nom', value: 'name' },
        { text: '-mod', value: 'activated' },
        { text: '-serverMod', value: 'server_mod' }
      ]
    }
  },

  async mounted() {
    this.loading = true

    let activatedMods = []
    if (this.serverParams.mods) {
      activatedMods = this.serverParams.mods.split(';')
    }

    let activatedServerMods = []
    if (this.serverParams.server_mod) {
      activatedServerMods = this.serverParams.server_mod.split(';')
    }

    this.mods = await this.$axios.$get('server/mod')

    this.mods.forEach(element => {
      if (activatedMods.includes(element.name)) {
        element.activated = true
      } else if (activatedServerMods.includes(element.name)) {
        element.server_mod = true
      }
    })

    this.loading = false
  },

  methods: {
    async save() {
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

      await this.$axios.$put(`server/params/${this.serverParams.id}`, {
        mods,
        server_mod: serverMods
      })

      this.$toast.global.appSuccess(this.$t('serverMod.updated'))

      this.loadingUpdate = false
      this.$emit('loading', false)
    }
  }
}
</script>
