<template>
  <v-container fluid>   
    <v-alert
      type="error"
      border="left"
      text
      v-if="users.find(element => element.username === 'admin')"
    >{{ $t('users.adminUserAlert') }}</v-alert>

    <v-row justify="center">
      <v-col cols="md-12">
        <v-btn 
          v-if="$auth.user.privilege === 2"
          text
          color="primary" 
          class="float-right" 
          @click="dialog = !dialog"
        >
          <v-icon left>mdi-account-plus</v-icon>{{ $t('users.add') }}
        </v-btn>
      </v-col>

      <v-col cols="md-12">
        <v-card>    
          <v-card-title class="headline">
            <h3>{{ $t('menu.users') }}</h3>

            <v-spacer></v-spacer>
            
            <v-text-field
              v-model="usersTableSearch"
              append-icon="mdi-account-search"
              :label="$t('users.search')"
              single-line
              hide-details
              filled
              dense
            ></v-text-field>
          </v-card-title>

          <v-divider></v-divider>

          <v-card-text>
              <v-data-table 
                :items="users" 
                :headers="usersTableHeaders"
                disable-pagination 
                hide-default-footer
                :no-data-text="$t('users.noUser')"
                :no-results-text="$t('common.noResult')"
                :search="usersTableSearch"
                :loading="usersTableLoading"
              >
                <template v-slot:item.privilege="{ item }">
                  {{ privileges[item.privilege] }}
                </template>

                <template v-slot:item.created_at="{ item }">
                  {{ $moment(item.created_at).format('lll') }}
                </template>

                <template v-slot:item.action="{ item }">
                  <v-btn
                    v-if="$auth.user.privilege > item.privilege || $auth.user.privilege === 2" 
                    text 
                    icon
                  >
                    <v-icon @click="editUser(item)">mdi-account-edit</v-icon>  
                  </v-btn>
                  
                  <v-btn
                    v-if="$auth.user.privilege > item.privilege || $auth.user.privilege === 2"
                    text
                    icon
                    color="error"
                    @click="deleteUser(item)"
                  >
                    <v-icon>mdi-account-remove</v-icon>  
                  </v-btn>                  
                </template>                
              </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-dialog 
      v-model="dialog"
      persistent
      max-width="600px"
    >      
      <v-card>
          <v-overlay 
            :value="dialogLoading"
            absolute
          >
            <v-progress-circular indeterminate></v-progress-circular>
          </v-overlay>

          <v-card-text class="pt-5 pb-0">
            <v-form 
              v-model="formIsValid" 
              ref="form"
            >
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
                :rules="formRules.passwordRules"
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
                v-model="formData.privilege" 
                :label="$t('common.privilege')" 
                :items="privileges"
                :rules="formRules.privilegeRules"
                filled
              ></v-select>
            </v-form>          
          </v-card-text>

          <v-card-actions class="pt-0">
            <v-spacer></v-spacer>
            <v-btn 
              text
              @click="dialog = false; $refs.form.reset()"
            >{{ $t('common.cancel') }}</v-btn>

            <v-btn
              color="primary"
              text @click="saveUser()"
              :disabled="!formIsValid"
            >{{ $t('common.save') }}</v-btn>
          </v-card-actions>
        </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
export default {
  layout: 'commander',
  middleware: 'privilege_1',

  data () {
    return {
      dialog: false,
      dialogLoading: false,
      formIsValid: false,
      showPassword: false,
      formData: {
        username: '',
        privilege: 0,
        password: ''
      },
      editFormDataIndex: -1,
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
        ],
        privilegeRules: [
          v => !!v || this.$t('rules.privilegeRequired')
        ]
      },
      usersTableLoading: false,
      usersTableSearch: '',
      usersTableHeaders: [
        { text: this.$t('common.username'), value: 'username' },
        { text: this.$t('common.privilege'), value: 'privilege' },
        { text: this.$t('users.createdAt'), value: 'created_at' },
        { text: '', value: 'action', sortable: false }
      ],
      privileges: [this.$t('privileges.normal'), this.$t('privileges.admin'), this.$t('privileges.supAdmin')]
    }
  },

  async asyncData ({ $axios }) {
    const response = await $axios.$get('user')
    return { users: response }
  },

  methods: {
    async saveUser () {
      this.dialogLoading = true

      if (this.$refs.form.validate()) {
        if (this.editFormDataIndex > -1) {
          const editedUser = await this.$axios.$put(`user/${this.formData.id}`, this.formData)

          Object.assign(this.users[this.editFormDataIndex], editedUser)

          this.editFormDataIndex = -1

          this.$toast.global.appSuccess(this.$t('users.updated'))
        } else {
          const newUser = await this.$axios.$post('user', {
            username: this.formData.username,
            password: this.formData.password,
            privilege: this.privileges.indexOf(this.formData.privilege)
          })
          
          this.users.push(newUser)        
          
          this.$toast.global.appSuccess(this.$t('users.created'))
        }

        this.$refs.form.reset()
        this.dialog = false
      }

      this.dialogLoading = false
    },

    async deleteUser (user) {
      const confirm = await this.$confirm(this.$t('users.confirmDeletion'), { 
        title: this.$t('common.deletion'), 
        buttonTrueText: this.$t('common.continue'), 
        buttonFalseText: this.$t('common.cancel'), 
        color: 'error',
        persistent: true
      })

      if (confirm) {
        this.usersTableLoading = true

        try {
          await this.$axios.$delete(`user/${user.id}`)
          
          this.users.splice(this.users.indexOf(user), 1)
          this.$toast.global.appSuccess(this.$t('users.deleted'))
        } catch (ex) {
          if (ex.response.data === 'E_SUPER_ADMIN_REQUIRED') {
            this.$toast.global.appError(this.$t('users.supAdminError'))
          }
        }

        this.usersTableLoading = false
      }
    },   

    editUser (user) {
      this.editFormDataIndex = this.users.indexOf(user)
      this.formData = {
        username: user.username,
        privilege: this.privileges[user.privilege]
      }
      this.dialog = true
    }
  }
}
</script>