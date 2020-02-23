<template>
  <v-container class="app-container">
    <v-row justify="center">
      <v-col cols="md-6">
        <v-card>
          <v-card-title>
            <span class="heandline">Modifier mes informations</span>            
          </v-card-title>

          <v-divider></v-divider>

          <v-card-text>
            <v-form v-model="formIsValid" ref="form">
              <v-text-field 
                v-model="formData.username" 
                :rules="formRules.usernameRules" 
                label="Pseudo" 
                name="username" 
                prepend-inner-icon="mdi-account" 
                filled
              ></v-text-field>

              <v-text-field 
                v-model="formData.password" 
                :rules="formData.password !== '' ? formRules.passwordRules : []" 
                label="Mot de passe" 
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
                    Le mot de passe doit avoir au minimum 8 caractères et contenir :                    
                    <br/>- Au moins 1 lettre minuscule
                    <br/>- Au moins 1 lettre majuscule
                    <br/>- Au moins 1 chiffre
                    <br/>- Au moins 1 caractère spécial
                  </v-tooltip>
                </template>
              </v-text-field>
            </v-form> 
          </v-card-text>

          <v-card-actions class="pt-0">
            <v-btn 
              color="primary" 
              text 
              block 
              @click="save()" 
              :loading="loading"
            >Valider</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  layout: 'commander',

  data () {
    return {
      loading: false,
      formIsValid: false,
      showPassword: false,
      formData: {
        username: this.$auth.user.username,
        password: ''
      },
      formRules: {
        usernameRules: [
          v => !!v || 'Pseudo requis'
        ],
        passwordRules: [
          v => (v || '').length >= 8 || 'Minimum 8 caractères requis',
          v => /^(?=.*[a-z])/.test(v) || 'Doit contenir au moins 1 caractère minuscule',
          v => /^(?=.*[A-Z])/.test(v) || 'Doit contenir au moins 1 caractère majuscule',
          v => /^(?=.*[0-9])/.test(v) || 'Doit contenir au moins 1 caractère numérique',
          v => /(?=.*?[#?!@$%^&*-])/.test(v) || 'Doit contenir au moins 1 caractère spécial'
        ]
      }
    }
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

        this.$toast.global.appSuccess('Modification enregistré')
      }

      this.loading = false
    }
  }
}
</script>

<style>

</style>