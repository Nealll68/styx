<template>
  <v-container class="app-container">
    <v-row justify="center">
      <v-col cols="md-6">
        <v-card>
          <v-card-title>
            <span class="heandline">{{ $t('menu.myAccount') }}</span>            
          </v-card-title>

          <v-divider></v-divider>

          <v-card-text>
            <v-form v-model="formIsValid" ref="form">
              <v-text-field 
                v-model="formData.username" 
                :rules="formRules.usernameRules" 
                :label="$t('common.username')" 
                name="username" 
                prepend-inner-icon="mdi-account" 
                filled
              ></v-text-field>

              <v-text-field 
                v-model="formData.password" 
                :rules="formData.password !== '' ? formRules.passwordRules : []" 
                :label="$t('common.password')" 
                name="password" 
                prepend-inner-icon="mdi-lock" 
                :type="showPassword ? 'text' : 'password'" 
                :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'" 
                @click:append="showPassword = !showPassword" 
                filled
              >
                <template v-slot:append-outer>
                  <v-tooltip top>
                    <template v-slot:activator="{ on }">
                      <v-icon v-on="on">mdi-help</v-icon>
                    </template>
                    <ul>
                      <li>{{ $t('rules.password.minLength') }}</li>
                      <li>{{ $t('rules.password.lowercaseRequired') }}</li>
                      <li>{{ $t('rules.password.uppercaseRequired') }}</li>
                      <li>{{ $t('rules.password.numericRequired') }}</li>
                      <li>{{ $t('rules.password.specialRequired') }}</li>
                    </ul>
                  </v-tooltip>
                </template>
              </v-text-field>

              <v-select
                v-model="formData.locale"
                :items="$store.state.i18n.locales"
                item-text="name"
                item-value="code"
                filled
                prepend-inner-icon="mdi-translate"
              ></v-select>
            </v-form> 
          </v-card-text>

          <v-card-actions class="pt-0">
            <v-btn 
              color="primary" 
              text 
              block 
              @click="save()" 
              :loading="loading"
            >{{ $t('common.save') }}</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  layout: 'interface',

  head () {
    return {
      title: this.$t('menu.myAccount')
    }
  },

  data () {
    return {
      loading: false,
      formIsValid: false,
      showPassword: false,
      formData: {
        username: this.$auth.user.username,
        password: '',
        locale: ''
      },
      formRules: {
        usernameRules: [
          v => !!v || this.$t('rules.usernameRequired')
        ],
        passwordRules: [
          v => !!v || this.$t('rules.passwordRequired'),
          v => (v || '').length >= 8 || this.$t('rules.password.minLength'),
          v => /^(?=.*[a-z])/.test(v) || this.$t('rules.password.lowercaseRequired'),
          v => /^(?=.*[A-Z])/.test(v) || this.$t('rules.password.uppercaseRequired'),
          v => /^(?=.*[0-9])/.test(v) || this.$t('rules.password.numericRequired'),
          v => /(?=.*?[#?!@$%^&*-])/.test(v) || this.$t('rules.password.specialRequired')
        ]
      }
    }
  },

  mounted () {
    this.formData.locale = this.getCurrentLocaleCode()
  },

  methods: {
    async save () {
      this.loading = true

      if (this.$refs.form.validate()) {
        await this.$axios.$put(`/user/${this.$auth.user.id}`, {
          username: this.formData.username,
          password: this.formData.password
        })

        await this.$auth.fetchUser()

        this.$snackbar({
          type: 'success',
          message: this.$t('user.updated')
        })

        if (this.formData.locale !== this.getCurrentLocaleCode()) {
          this.switchLocale(this.formData.locale)
        }
      }

      this.loading = false
    },

    switchLocale (code) {
      this.$cookies.set("locale", code, {
        path: "/"
      })

      window.location.reload(true)
    },

    getCurrentLocaleCode () {
      const locale = this.$store.state.i18n.locales.find(el => el.code === this.$store.state.i18n.locale)
      return locale.code
    }
  }
}
</script>