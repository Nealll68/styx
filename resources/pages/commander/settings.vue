<template>
<v-container class="app-container">
  <v-card>
    <v-card-title>
      <v-icon left>mdi-cogs</v-icon>Configuration de Commander
      <v-spacer></v-spacer>
      <v-btn
        text
        color="primary"
        :loading="loading"
        :disabled="$store.state.downloadInfo.type === 'updateServer' || !valid"
        @click="save()"
      >
        <v-icon left>mdi-content-save</v-icon>Enregistrer
      </v-btn>
    </v-card-title>

    <v-divider></v-divider>

    <v-card-text>
      <v-form v-model="valid" ref="form">
        <v-text-field
          v-model="config.steamcmd_path"
          filled
          label="Chemin SteamCMD"
          hint="Chemin absolu vers le dossier ou est installé SteamCMD"
          persistent-hint
          clearable
          :rules="requiredRule"
        ></v-text-field>

        <v-text-field
          v-model="config.a3server_path"
          filled
          label="Chemin Arma 3 serveur"
          hint="Chemin absolu vers le dossier ou est installé Arma 3"
          persistent-hint
          clearable
          class="mt-2"
          :rules="requiredRule"
        ></v-text-field>

        <v-text-field
          v-model="config.port"
          filled
          label="Port"
          type="number"
          clearable
          class="mt-2"
          :rules="requiredRule"
        ></v-text-field>
      </v-form>

      <v-switch
        v-model="config.x64"
        color="primary"
        inset
        label="Version 64bit"
      ></v-switch>

      <v-divider></v-divider>
      
      <v-subheader>Vous pouvez préciser un compte steam qui va gérer le téléchargement du jeu et des mods. Il faudra alors simplement préciser le code Steam Guard</v-subheader>      

      <v-text-field
        v-model="config.steam_account"
        filled
        label="Nom d'utilisateur"
        clearable
      ></v-text-field>

      <v-text-field
        v-model="config.steam_password"
        filled
        label="Mot de passe"
        clearable
        type="password"
        hint="Le mot de passe n'est jamais affiché. Pour le modifier précisez-le à nouveau"
        persistent-hint
      ></v-text-field>

      <v-switch
        v-model="config.steam_guard"
        color="primary"
        inset
        label="Protégé par Steam Guard"
        hint="Si oui, le code Steam Guard vous sera demandé avant chaque téléchargement"
        persistent-hint
      ></v-switch>
    </v-card-text>
  </v-card>
</v-container>
</template>

<script>
export default {
  layout: 'commander',

  data () {
    return {
      loading: false,
      config: {
        steamcmd_path: '',
        a3server_path: '',
        port: null,
        x64: true,
        steam_account: '',
        steam_password: ''
      },
      valid: false,
      requiredRule: [
        v => !!v || 'Champs requis'
      ]
    }
  },

  async mounted () {
    this.loading = true

    const config = await this.$axios.$get('config')
    this.config = config

    this.loading = false
  },

  methods: {
    async save () {
      this.loading = true

      if (this.$refs.form.validate()) {
        const config = await this.$axios.$post('config', this.config)
        this.config.steam_password = ''
        this.config = config
        this.$store.commit('config/set', config)
      }

      this.loading = false
    }
  }
}
</script>