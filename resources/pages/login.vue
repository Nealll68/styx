<template>
	<v-container 
    class="fill-height" 
    fluid
  >
		<v-row 
      align="center" 
      justify="center"
    >
			<v-col 
        cols="12" 
        sm="8" 
        md="5"
      >
				<v-card>
          <v-card-title class="d-flex flex-column">
            <Logo width="150px" height="150px" />
            <div class="font-weight-thin display-1">STYX</div>
          </v-card-title>

          <v-form 
            v-model="formIsValid" 
            ref="form"
            @submit.prevent="login()"
          >
            <v-card-text>
              <v-text-field 
                v-model="username"
                :rules="requiredRule"
                :label="$t('common.username')"
                name="username"
                prepend-inner-icon="mdi-account"
                filled
              ></v-text-field>

              <v-text-field 
                v-model="password"
                :rules="requiredRule"
                :label="$t('common.password')"
                name="password"
                prepend-inner-icon="mdi-lock"
                :type="showPassword ? 'text' : 'password'"
                :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append="showPassword = !showPassword" 
                filled
              ></v-text-field>

              <v-checkbox
                v-model="remember"
                :label="$t('login.rememberMe')"
                color="primary"
                class="mt-0"
              ></v-checkbox>
            </v-card-text>

            <v-card-actions>
              <v-btn 
                type="submit"
                color="primary"
                block
                text
                @click="login()"
                :loading="loading"
              >{{ $t('login.signIn') }}</v-btn>
            </v-card-actions>
					</v-form>
				</v-card>

        <v-card class="mt-3">
          <v-card-text class="text-center">
            Created by <a href="https://www.github.com/Nealll68/styx" target="_blank" rel="noopener noreferrer">Nealll</a>
          </v-card-text>
        </v-card>
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
const Logo = () => import('@/components/Logo')

export default {
  auth: 'guest',

  head () {
    return {
      title: this.$t('login.signIn')
    }
  },

  data () {
    return {
      formIsValid: false,
      showPassword: false,
      loading: false,
      username: '',
      password: '',
      remember: false,
      requiredRule: [
        v => !!v || this.$t('rules.required')
      ]
    }
  },

  components: {
    Logo
  },

  methods: {
    async login () {
      this.loading = true

      if (this.$refs.form.validate()) {
        try {
          await this.$auth.loginWith('local', {
            data: {
              username: this.username,
              password: this.password,
              remember: this.remember
            }
          })

          this.$router.push('/')
        } catch (ex) {
          console.log(ex)
          if (ex.response.data === 'E_PASSWORD_MISMATCH' || ex.response.data === 'E_USER_NOT_FOUND') {
            this.$snackbar({
              type: 'error', 
              message:this.$t('login.wrongCredentials')
            })
          }
        }
      }

      this.loading = false      
    }
  }
}
</script>