<template>
  <v-container class="app-container">   
    <v-alert
      type="warning"
      prominent
      text
      outlined
      v-if="users.find(element => element.username === 'admin')"
      :icon="icons.mdiExclamationThick"
    >{{ $t('users.adminUserAlert') }}</v-alert>

    <v-row justify="center">
      <v-col cols="md-12">
        <v-btn
          outlined
          color="primary" 
          class="float-right" 
          @click="dialog = !dialog"
        >
          <v-icon left>{{icons.mdiAccountPlus}}</v-icon>{{ $t('users.add') }}
        </v-btn>
      </v-col>

      <v-col cols="md-12">
        <v-card>    
          <v-card-title class="headline">
            <h3>{{ $t('menu.users') }}</h3>

            <v-spacer></v-spacer>
            
            <v-text-field
              v-model="usersTableSearch"
              :append-icon="icons.mdiAccountSearch"
              :label="$t('common.search')"
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
                :no-data-text="$t('common.noData')"
                :no-results-text="$t('common.noResult')"
                :search="usersTableSearch"
                :loading="usersTableLoading"
              >
                <template v-slot:item.privilege="{ item }">
                  <v-chip
                    small
                    outlined
                    :color="item.privilege === 1 ? 'tertiary' : 'quaternary'"
                  >{{ privileges[item.privilege] }}
                  </v-chip>
                </template>

                <template v-slot:item.created_at="{ item }">
                  {{ $moment(item.created_at).format('lll') }}
                </template>

                <template v-slot:item.action="{ item }">
                  <v-menu :close-on-content-click="false">
                    <template v-slot:activator="{ on }">
                      <v-btn
                        text 
                        icon
                        v-on="on"
                      >
                        <v-icon>{{icons.mdiShieldAccount}}</v-icon>  
                      </v-btn>
                    </template>

                    <v-card>
                      <v-card-text>
                        <v-radio-group v-model="item.privilege" mandatory>
                          <v-radio :label="privileges[0]" :value="0"></v-radio>
                          <v-radio :label="privileges[1]" :value="1"></v-radio>
                        </v-radio-group>
                        
                        <v-btn
                          block
                          depressed
                          color="primary"
                          @click="editPrivilege(item)"
                          :disabled="usersTableLoading"
                        >{{ $t('common.save') }}</v-btn>
                      </v-card-text>
                    </v-card>
                  </v-menu>
                  
                  <v-btn
                    text
                    icon
                    color="error"
                    @click="deleteUser(item)"
                  >
                    <v-icon>{{icons.mdiAccountRemove}}</v-icon>  
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
      :fullscreen="$vuetify.breakpoint.smAndDown"
    >      
      <v-card>
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
              :prepend-inner-icon="icons.mdiAccount"
              filled
            ></v-text-field>

            <v-text-field
              v-model="formData.password"
              :rules="formRules.passwordRules"
              :label="$t('common.password')"
              name="password"
              :prepend-inner-icon="icons.mdiLock"
              :type="showPassword ? 'text' : 'password'"
              :append-icon="showPassword ? icons.mdiEye : icons.mdiEyeOff" 
              @click:append="showPassword = !showPassword"
              filled
            >
              <template v-slot:append-outer>
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-icon v-on="on">{{icons.mdiHelp}}</v-icon>
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
            depressed
            color="primary"
            @click="saveUser()"
            :disabled="!formIsValid"
            :loading="dialogLoading"
          >{{ $t('common.save') }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import {
  mdiAccountPlus,
  mdiAccountSearch,
  mdiShieldAccount,
  mdiAccountRemove,
  mdiAccount,
  mdiLock,
  mdiEye,
  mdiEyeOff,
  mdiHelp,
  mdiExclamationThick
} from '@mdi/js'
export default {
  layout: 'interface',
  middleware: 'privilege_1',

  head () {
    return {
      title: this.$t('menu.users')
    }
  },

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
        { text: this.$t('common.createdAt'), value: 'created_at' },
        { text: '', value: 'action', sortable: false }
      ],
      privileges: [this.$t('privileges.sergeant'), this.$t('privileges.commander')],
      icons: {
        mdiAccountPlus,
        mdiAccountSearch,
        mdiShieldAccount,
        mdiAccountRemove,
        mdiAccount,
        mdiLock,
        mdiEye,
        mdiEyeOff,
        mdiHelp,
        mdiExclamationThick
      }
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
        const newUser = await this.$axios.$post('user', {
          username: this.formData.username,
          password: this.formData.password,
          privilege: this.privileges.indexOf(this.formData.privilege)
        })
        
        this.users.push(newUser)        
        
        this.$snackbar({
          type: 'success',
          message: this.$t('users.created')
        })

        this.$refs.form.reset()
        this.dialog = false
      }

      this.dialogLoading = false
    },

    async deleteUser (user) {
      const confirm = await this.$confirm({ 
        title: this.$t('common.deletion'),
        message: this.$t('users.confirmDeletion'),
        type: 'error'
      })

      if (confirm) {
        this.usersTableLoading = true

        try {
          await this.$axios.$delete(`user/${user.id}`)
          
          this.users.splice(this.users.indexOf(user), 1)
          this.$snackbar({
            type: 'success',
            message: this.$t('users.deleted')
          })
        } catch (ex) {
          if (ex.response.data === 'E_SUPER_ADMIN_REQUIRED') {
            this.$snackbar({
              type: 'error',
              message: this.$t('users.supAdminError')
            })
          }
        }

        this.usersTableLoading = false
      }
    },   

    async editPrivilege (user) {
      this.usersTableLoading = true
      
      await this.$axios.$put(`user/${user.id}`, user)
      this.$snackbar({
        type: 'success',
        message: this.$t('users.updated')
      })

      this.usersTableLoading = false
    }
  }
}
</script>