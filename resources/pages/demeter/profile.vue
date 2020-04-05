<template>
  <v-container fluid>
    <path-error v-if="!$store.state.config.a3ServerPath"></path-error>

    <section v-else>
      <v-card :loading="loadingPage">     
        <v-toolbar>
          <v-menu 
            bottom
            right
            transition="slide-y-transition"
          >
            <template v-slot:activator="{ on }">
              <v-btn
                text  
                v-on="on"          
              >
                <v-icon left>mdi-folder-cog</v-icon>
                {{ $route.params.name }}
                <v-icon right>mdi-menu-down</v-icon>
              </v-btn>
            </template>

            <v-list nav>
              <v-subheader>{{ $t('menu.profiles') }}</v-subheader>
              <v-list-item 
                v-for="profile in profiles" 
                :key="profile.id"
                nuxt
                :to="`/demeter/profile/${profile.name}`"
                color="primary"
              >
                <v-list-item-content>
                  <v-list-item-title>{{ profile.name }}</v-list-item-title>
                </v-list-item-content>

                <v-list-item-icon v-if="profile.isDefault">
                  <v-icon color="primary">mdi-star</v-icon>
                </v-list-item-icon>
              </v-list-item>
            </v-list>
          </v-menu>

          <v-btn
            :icon="$vuetify.breakpoint.xsOnly"
            color="primary"
            text
            :disabled="disableSetDefault"
            @click="switchToDefault()"
          >
            <v-icon :left="$vuetify.breakpoint.smAndUp">mdi-star-outline</v-icon>{{ $vuetify.breakpoint.xsOnly ? '' : $t('profiles.setAsDefault') }}
          </v-btn>

          <v-btn
            :icon="$vuetify.breakpoint.xsOnly"
            color="error"
            text
            :disabled="!$route.params.name || profiles.length === 1"
            @click="deleteProfile()"
          >
            <v-icon :left="$vuetify.breakpoint.smAndUp">mdi-delete</v-icon>{{ $vuetify.breakpoint.xsOnly ? '' : $t('profiles.delete') }}
          </v-btn>

          <v-spacer></v-spacer>

          <v-text-field
            v-model="profileName"
            filled
            dense
            :label="$t('common.name')"
            hide-details
            single-line
            append-outer-icon="mdi-folder-plus"
            @click:append-outer="saveProfile()"
          ></v-text-field>         

          <template v-slot:extension>
            <v-tabs 
              grow
              show-arrows
            >
              <v-tab
                exact
                nuxt
                :to="`/demeter/profile/${$route.params.name}`"
                :disabled="!$route.params.name"
              >{{ $t('profiles.tabTitles.mods') }}</v-tab>

              <v-tab
                exact
                nuxt
                :to="`/demeter/profile/${$route.params.name}/params`"
                :disabled="!$route.params.name"
              >{{ $t('profiles.tabTitles.parameters') }}</v-tab>

              <v-tab
                exact
                nuxt
                :to="`/demeter/profile/${$route.params.name}/config`"
                :disabled="!$route.params.name"
              >{{ $t('profiles.tabTitles.configuration') }}</v-tab>

              <v-tab
                exact
                nuxt
                :to="`/demeter/profile/${$route.params.name}/difficulty`"
                :disabled="!$route.params.name"
              >{{ $t('profiles.tabTitles.difficulty') }}</v-tab>
            </v-tabs>
          </template>
        </v-toolbar> 

        <v-alert
          v-if="!$route.params.name"
          text
          type="info"
          border="left"
          class="mt-4"
        >{{ $t('profiles.howToCreate') }}</v-alert>

        <nuxt-child @loading="loadingPage = $event" />
      </v-card>
    </section>      
  </v-container>
</template>

<script>
const PathError = () => import('@/components/PathError')

export default {
  layout: 'demeter',

  components: {
    PathError
  },

  data () {
    return {
      loading: false,
      loadingPage: false,
      profileName: ''
    }
  },

  async validate ({ params, redirect, $axios }) {
    const profiles = await $axios.$get('server/profile')
  
    if (!params.name) {      
      const defaultProfile = profiles.find(e => e.isDefault)

      if (defaultProfile) {
        redirect(`/demeter/profile/${defaultProfile.name}`)
      }
      return true
    }
    
    return profiles.some(e => e.name === params.name)
  },

  async asyncData ({ $axios }) {
    const profiles = await $axios.$get('server/profile')

    return {
      profiles
    }   
  },

  computed: {
    disableSetDefault () {
      if (this.$route.params.name) {
        const profile = this.profiles.find(e => e.name === this.$route.params.name)
        return profile.isDefault
      }

      return true
    }
  },

  methods: {
    async saveProfile () {
      this.loading = true

      if (this.profiles.some(e => e.name.toLowerCase() === this.profileName.toLowerCase())) {
        return this.$toast.global.appError(this.$t('profiles.nameUsed'))
      }

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

    async switchToDefault () {
      this.loading = true

      const profile = this.profiles.find(e => e.name === this.$route.params.name)

      await this.$axios.$put(`server/profile/${profile.id}`, {
        isDefault: true
      })

      this.profiles = await this.$axios.$get('server/profile')
      this.$toast.global.appSuccess(this.$t('profiles.updated'))

      this.loading = false
    },

    async deleteProfile () {
      const confirm = await this.$confirm(this.$t('profiles.confirmDeletion'), { 
        title: this.$t('common.deletion'),
        color: 'error'
      })

      if (confirm) {
        this.loading = true

        const profile = this.profiles.find(e => e.name === this.$route.params.name)
        
        await this.$axios.$delete(`server/profile/${profile.id}`) 
        this.profiles = await this.$axios.$get('server/profile')      
        this.$router.push('/demeter/profile')

        this.$toast.global.appSuccess(this.$t('profiles.deleted'))

        this.loading = false
      }
    }
  }
}
</script>

<style>

</style>