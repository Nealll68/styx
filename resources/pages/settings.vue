<template>
  <v-container class="app-container">
    <v-card>
      <v-toolbar flat>
        <v-toolbar-title>
          <v-icon left>{{icons.mdiCogs}}</v-icon>{{ $t('settings.title') }}
        </v-toolbar-title>

        <v-spacer></v-spacer>

        <v-btn
          outlined
          color="primary"
          :loading="loading"
          :disabled="$store.state.downloadInfo.type === 'updateServer' || !valid "
          @click="save()"
        >
          <v-icon left>{{icons.mdiContentSave}}</v-icon>{{ $t('common.save') }}
        </v-btn>
      </v-toolbar>
      <v-tabs :vertical="$vuetify.breakpoint.smAndUp">
        <v-tab>
          <v-icon left>{{icons.mdiGamepadSquare}}</v-icon>Arma 3
        </v-tab>
        <v-tab>
          <v-icon left>{{icons.mdiSteam}}</v-icon>Steam
        </v-tab>

        <v-tab-item>
          <v-card flat>
            <v-card-text>
              <v-form v-model="valid" ref="form">
                <v-text-field
                  v-model="config.a3server_path"
                  filled
                  :label="$t('settings.armaPathLabel')"
                  :hint="$t('settings.armaPathHint')"
                  persistent-hint
                  clearable
                  class="mt-2"
                  :rules="requiredRule"
                ></v-text-field>

                <v-text-field
                  v-model="config.port"
                  filled
                  :label="$t('settings.port')"
                  type="number"
                  clearable
                  class="mt-2"
                  :rules="requiredRule"
                ></v-text-field>

                <v-checkbox
                  v-model="config.x64"
                  color="primary"
                  :label="$t('settings.64bit')"
                  :hint="$t('settings.64bitHint')"
                  persistent-hint
                ></v-checkbox>
              </v-form>
            </v-card-text>
          </v-card>
        </v-tab-item>
        <v-tab-item>
          <v-card flat>
            <v-card-text>
              <v-text-field
                v-model="config.steamcmd_path"
                filled
                :label="$t('settings.steamCMDLabel')"
                :hint="$t('settings.steamCMDHint')"
                persistent-hint
                clearable
              ></v-text-field>

              <v-subheader>{{ $t('settings.steamAccountMessage') }}</v-subheader>
              <v-alert 
                text
                dense
                type="warning"
                border="left"
              >{{ $t('settings.steamWorkshopInfo') }}</v-alert>

              <v-text-field
                v-model="config.steam_account"
                filled
                :label="$t('common.username')"
                clearable
              ></v-text-field>

              <v-text-field
                v-model="config.steam_password"
                filled
                :label="$t('common.password')"
                clearable
                type="password"
                :hint="$t('settings.passwordHint')"
                persistent-hint
              ></v-text-field>

              <v-switch
                v-model="config.steam_guard"
                color="primary"
                inset
                :label="$t('settings.steamGuardProtection')"
                :hint="$t('settings.steamGuardHint')"
                persistent-hint
              ></v-switch>
            </v-card-text>
          </v-card>
        </v-tab-item>
      </v-tabs>
    </v-card>
  </v-container>
</template>

<script>
import {
  mdiCogs,
  mdiContentSave,
  mdiGamepadSquare,
  mdiSteam
} from '@mdi/js'

export default {
  layout: 'interface',
  middleware: 'privilege_1',

  head () {
    return {
      title: this.$t('menu.settings')
    }
  },

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
      requiredRule: [v => !!v || this.$t('rules.required')],
      icons: {
        mdiCogs,
        mdiContentSave,
        mdiGamepadSquare,
        mdiSteam
      }
    }
  },

  async mounted() {
    this.loading = true

    const config = await this.$axios.$get('config')
    this.config = config

    this.loading = false
  },

  methods: {
    async save() {
      this.loading = true

      if (this.$refs.form.validate()) {
        const config = await this.$axios.$post('config', this.config)
        this.config.steam_password = ''
        this.config = config
        this.$store.commit('config/set', config)
        this.$snackbar({
          type: 'success',
          message: this.$t('params.updated')
        })
      }

      this.loading = false
    }
  }
}
</script>
