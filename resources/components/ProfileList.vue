<template>
<v-card>
  <v-overlay 
    :value="loading"
    absolute
  >
    <v-progress-circular       
      indeterminate
      size="64"
      color="primary"
    ></v-progress-circular>
  </v-overlay>

  <v-card-text>
    <v-text-field
      v-model="profileName"
      filled
      dense
      label="Nom"
      hide-details
      append-icon="mdi-plus"
      @click:append="saveProfile()"
      loader-height="3"
    ></v-text-field>
  </v-card-text>

  <v-divider></v-divider> 

  <v-list>
    <v-subheader>{{ $t('profiles.title') }}</v-subheader>
    <v-list-item-group 
      v-model="selectedProfile" 
      mandatory
    >
      <v-list-item 
        v-for="profile in profiles" 
        :key="profile.id" 
        @click="$emit('show-profile', profile.id)"
      >
        <v-list-item-content>
          <v-list-item-title>{{ profile.name }}</v-list-item-title>
        </v-list-item-content>

        <v-list-item-action class="d-flex flex-row">
        <v-tooltip top v-if="profile.isDefault">
          <template v-slot:activator="{ on }">
            <v-btn
              text
              icon
              v-on="on" 
              color="primary"
              @click.stop=""
            >
              <v-icon>mdi-star</v-icon>
            </v-btn>
          </template>
          Profile par défaut
        </v-tooltip>

        <v-btn
          v-else
          text
          icon
          @click.stop="switchToDefault(profile)"
        >
          <v-icon>mdi-star-outline</v-icon>              
        </v-btn>

          <v-btn
            text
            icon
            color="error"
            @click.stop="deleteProfile(profile)"
          >
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </v-list-item-action>
      </v-list-item>
    </v-list-item-group>
  </v-list>
</v-card>
</template>

<script>
export default {
  props: ['profiles'],

  data () {
    return {
      loading: false,
      selectedProfile: 0,
      profileName: null
    }
  },

  methods: {
    async saveProfile () {
      this.loading = true

      if (this.profileName) {
        const profile = await this.$axios.$post('server/profile', {
          name: this.profileName.split(' ').join('_')
        })

        this.profiles.push(profile)
        this.$toast.global.appSuccess(this.$t('profiles.created'))             

        this.profileName = null
      } else {
        this.$toast.global.appError(this.$t('profiles.noNameError'))
      }

      this.loading = false
    },

    async switchToDefault (profile) {
      this.loading = true

      await this.$axios.$put(`server/profile/${profile.id}`, {
        isDefault: true
      })

      this.$emit('refresh')
      this.$toast.global.appSuccess(this.$t('profiles.updated'))

      this.loading = false
    },

    async deleteProfile (profile) {
      const confirm = await this.$confirm(this.$t('profile.confirmDeletion'), { 
        title: this.$t('common.deletion'), 
        buttonTrueText: this.$t('common.continue'), 
        buttonFalseText: this.$t('common.cancel'), 
        color: 'error',
        persistent: true
      })

      if (confirm) {
        this.loading = true
        
        const response = await this.$axios.$delete(`server/profile/${profile.id}`)
        this.profiles.splice(this.profiles.indexOf(profile), 1)
        
        if (response) {
          const index = this.profiles.findIndex(element => element.id === response.id)
          this.profiles[index] = response
        }

        this.$toast.global.appSuccess(this.$t('profiles.deleted'))

        this.loading = false
      }
    }
  }
}
</script>