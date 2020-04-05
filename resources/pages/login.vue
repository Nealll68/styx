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
					<v-card-text class="pb-0">
						<v-form 
              v-model="formIsValid" 
              ref="form"
            >
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
						</v-form>
					</v-card-text>
					<v-card-actions class="pt-0">
						<v-btn 
              color="primary"
              block
              text
              @click="login()"
              :loading="loading"
            >{{ $t('login.signIn') }}</v-btn>
					</v-card-actions>
				</v-card>
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
export default {
  auth: 'guest',

  data () {
    return {
      formIsValid: false,
      showPassword: false,
      loading: false,
      username: '',
      password: '',
      requiredRule: [
        v => !!v || this.$t('rules.required')
      ]
    }
  },

  methods: {
    async login () {
      this.loading = true

      if (this.$refs.form.validate()) {
        try {
          await this.$auth.loginWith('local', {
            data: {
              username: this.username,
              password: this.password
            }
          })

          this.$router.push('/demeter')
        } catch (ex) {
          if (ex.response.data === 'E_PASSWORD_MISMATCH' || ex.response.data === 'E_USER_NOT_FOUND') {
            this.$toast.global.appError(this.$t('wrongCredentials'))
          }
        }
      }

      this.loading = false      
    }
  }
}
</script>