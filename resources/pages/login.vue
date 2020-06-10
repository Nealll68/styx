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
                :prepend-inner-icon="icons.mdiAccount"
                filled
              ></v-text-field>

              <v-text-field 
                v-model="password"
                :rules="requiredRule"
                :label="$t('common.password')"
                name="password"
                :prepend-inner-icon="icons.mdiLock"
                :type="showPassword ? 'text' : 'password'"
                :append-icon="showPassword ? icons.mdiEye : icons.mdiEyeOff"
                @click:append="showPassword = !showPassword" 
                filled
              ></v-text-field>
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
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
import {
  mdiAccount,
  mdiLock,
  mdiEye,
  mdiEyeOff
} from '@mdi/js'
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
      requiredRule: [
        v => !!v || this.$t('rules.required')
      ],
      icons: {
        mdiAccount,
        mdiLock,
        mdiEye,
        mdiEyeOff
      }
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
              password: this.password
            }
          })

          this.$router.push('/')
        } catch (ex) {
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