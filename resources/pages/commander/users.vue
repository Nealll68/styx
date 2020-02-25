<template>
  <v-container fluid>   
    <v-alert
      type="error"
      border="left"
      text
      v-if="users.find(element => element.username === 'admin')"
    >
      Il est vivement déconseillé de laisser le compte par défaut (admin) activé
    </v-alert>

    <v-row justify="center">
      <v-col cols="md-12">
        <v-btn 
          v-if="$auth.user.privilege === 2"
          text
          color="primary" 
          class="float-right" 
          @click="dialog = !dialog"
        >
          <v-icon left>mdi-account-plus</v-icon>
          Créer un utilisateur
        </v-btn>
      </v-col>

      <v-col cols="md-12">
        <v-card>    
          <v-card-title class="headline">
            <h3>Utilisateurs</h3>

            <v-spacer></v-spacer>
            
            <v-text-field
              v-model="usersTableSearch"
              append-icon="mdi-account-search"
              label="Rechercher un utilisateur"
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
                no-data-text="Aucun utilisateur créé"
                no-results-text="Aucun résultat"
                :search="usersTableSearch"
                :loading="usersTableLoading"
              >
                <template v-slot:item.privilege="{ item }">
                  {{ privileges[item.privilege] }}
                </template>

                <template v-slot:item.created_at="{ item }">
                  {{ $moment(item.created_at).format('DD MMM YYYY') }}
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
                label="Nom d'utilisateur"
                name="username"
                prepend-inner-icon="mdi-account"
                filled
              ></v-text-field>

              <v-text-field
                v-model="formData.password"
                :rules="formRules.passwordRules"
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
            
              <v-select 
                v-model="formData.privilege" 
                label="Privilège" 
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
            >Annuler</v-btn>

            <v-btn
              color="primary"
              text @click="saveUser()"
              :disabled="!formIsValid"
            >Valider</v-btn>
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
          v => !!v || 'Pseudo requis'
        ],
        passwordRules: [
          v => !!v || 'Mot de passe requis',
          v => (v || '').length >= 8 || 'Minimum 8 caractères requis',
          v => /^(?=.*[a-z])/.test(v) || 'Doit contenir au moins 1 caractère minuscule',
          v => /^(?=.*[A-Z])/.test(v) || 'Doit contenir au moins 1 caractère majuscule',
          v => /^(?=.*[0-9])/.test(v) || 'Doit contenir au moins 1 caractère numérique',
          v => /(?=.*?[#?!@$%^&*-])/.test(v) || 'Doit contenir au moins 1 caractère spécial'
        ],
        privilegeRules: [
          v => !!v || 'Un niveau de privilège est requis'
        ]
      },
      usersTableLoading: false,
      usersTableSearch: '',
      usersTableHeaders: [
        { text: 'Pseudo', value: 'username' },
        { text: 'Privilège', value: 'privilege' },
        { text: 'Date de création', value: 'created_at' },
        { text: 'Actions', value: 'action', sortable: false }
      ],
      privileges: ['Normal', 'Administrateur', 'Super Administrateur']
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

          this.$toast.global.appSuccess('Utilisateur mis à jour')
        } else {
          const newUser = await this.$axios.$post('user', {
            username: this.formData.username,
            password: this.formData.password,
            privilege: this.privileges.indexOf(this.formData.privilege)
          })
          
          this.users.push(newUser)        
          
          this.$toast.global.appSuccess('Utilisateur créé')
        }

        this.$refs.form.reset()
        this.dialog = false
      }

      this.dialogLoading = false
    },

    async deleteUser (user) {
      const confirm = await this.$confirm('Etes-vous sûr de vouloir définitivement supprimer cette utilisateur ?', { 
        title: 'Suppression', 
        buttonTrueText: 'Continuer', 
        buttonFalseText: 'Annuler', 
        color: 'error',
        persistent: true
      })

      if (confirm) {
        this.usersTableLoading = true

        try {
          await this.$axios.$delete(`user/${user.id}`)
          
          this.users.splice(this.users.indexOf(user), 1)
          this.$toast.global.appSuccess('Utilisateur supprimé')
        } catch (ex) {
          if (ex.response.data === 'E_SUPER_ADMIN_REQUIRED') {
            this.$toast.global.appError('Suppresion impossible : il doit toujours y avoir un compte super admin d\'actif')
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