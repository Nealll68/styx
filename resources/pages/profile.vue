<template>
  <v-container class="app-container">
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
                <v-icon left>{{icons.mdiFolderCog}}</v-icon>
                {{ $route.params.name }}
                <v-icon right>{{icons.mdiMenuDown}}</v-icon>
              </v-btn>
            </template>

            <v-list nav>
              <v-subheader>{{ $tc('menu.profile', 1) }}</v-subheader>
              <v-list-item 
                v-for="profile in profiles" 
                :key="profile.id"
                nuxt
                :to="`/profile/${profile.name}`"
                color="primary"
              >
                <v-list-item-content>
                  <v-list-item-title>{{ profile.name }}</v-list-item-title>
                </v-list-item-content>

                <v-list-item-icon v-if="profile.isDefault">
                  <v-icon color="primary">{{icons.mdiStar}}</v-icon>
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
            <v-icon :left="$vuetify.breakpoint.smAndUp">{{icons.mdiStarOutline}}</v-icon>{{ $vuetify.breakpoint.xsOnly ? '' : $t('profiles.setAsDefault') }}
          </v-btn>

          <v-btn
            :icon="$vuetify.breakpoint.xsOnly"
            color="error"
            text
            :disabled="!$route.params.name || profiles.length === 1"
            @click="deleteProfile()"
          >
            <v-icon :left="$vuetify.breakpoint.smAndUp">{{icons.mdiDelete}}</v-icon>{{ $vuetify.breakpoint.xsOnly ? '' : $t('common.delete') }}
          </v-btn>

          <v-spacer></v-spacer>

          <v-menu
            v-model="menu"
            :close-on-content-click="false"
            :nudge-width="200"
            offset-x
          >
            <template v-slot:activator="{ on }">
               <v-btn
                  v-on="on"
                  icon
                  color="primary"
                >
                  <v-icon>{{icons.mdiPlus}}</v-icon>
                </v-btn>
            </template>

            <v-card>
              <v-card-text>
                <v-text-field
                  filled
                  dense
                  v-model="profileName"
                  :label="$t('common.name')"
                  hide-details
                  single-line
                ></v-text-field>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>

                <v-btn 
                  text 
                  @click="menu = false"
                >{{ $t('common.close') }}</v-btn>

                <v-btn 
                  color="primary" 
                  outlined 
                  @click="saveProfile"
                >{{ $t('common.save') }}</v-btn>
              </v-card-actions>
            </v-card>
          </v-menu>        

          <template v-slot:extension>
            <v-tabs 
              grow
              show-arrows
            >
              <v-tab
                exact
                nuxt
                :to="`/profile/${$route.params.name}`"
                :disabled="!$route.params.name"
              >{{ $t('profiles.tabTitles.mods') }}</v-tab>

              <v-tab
                exact
                nuxt
                :to="`/profile/${$route.params.name}/params`"
                :disabled="!$route.params.name"
              >{{ $t('profiles.tabTitles.parameters') }}</v-tab>

              <v-tab
                exact
                nuxt
                :to="`/profile/${$route.params.name}/config`"
                :disabled="!$route.params.name"
              >{{ $t('profiles.tabTitles.configuration') }}</v-tab>

              <v-tab
                exact
                nuxt
                :to="`/profile/${$route.params.name}/difficulty`"
                :disabled="!$route.params.name"
              >{{ $t('profiles.tabTitles.difficulty') }}</v-tab>

              <v-tab
                exact
                nuxt
                :to="`/profile/${$route.params.name}/performance`"
                :disabled="!$route.params.name"
              >{{ $t('profiles.tabTitles.performance') }}</v-tab>
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
import {
  mdiFolderCog,
  mdiMenuDown,
  mdiStar,
  mdiStarOutline,
  mdiDelete,
  mdiPlus
} from '@mdi/js'
const PathError = () => import('@/components/PathError')

export default {
  layout: 'interface',

  head () {
    return {
      title: this.$tc('menu.profile', 1)
    }
  },

  components: {
    PathError
  },

  data: () => ({
    loading: false,
    loadingPage: false,
    profileName: '',
    menu: false,
    icons: {
      mdiFolderCog,
      mdiMenuDown,
      mdiStar,
      mdiStarOutline,
      mdiDelete,
      mdiPlus
    }
  }),

  async validate ({ params, redirect, $axios }) {
    const profiles = await $axios.$get('server/profile')
  
    if (!params.name) {      
      const defaultProfile = profiles.find(e => e.isDefault)

      if (defaultProfile) {
        redirect(`/profile/${defaultProfile.name}`)
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
      this.menu = false

      if (this.profiles.some(e => e.name.toLowerCase() === this.profileName.toLowerCase())) {
        return this.$snackbar({
          type: 'error',
          message: this.$t('profiles.nameUsed')
        })
      }

      if (this.profileName) {
        const profile = await this.$axios.$post('server/profile', {
          name: this.profileName.split(' ').join('_')
        })

        this.profiles.push(profile)
        this.$snackbar({
          type: 'success',
          message: this.$t('profiles.created')
        })             

        this.profileName = null
      } else {
        this.$snackbar({
          type: 'error',
          message: this.$t('profiles.noNameError')
        })
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
      this.$snackbar({
        type: 'success',
        message: this.$t('profiles.updated')
      })

      this.loading = false
    },

    async deleteProfile () {
      const confirm = await this.$confirm({ 
        title: this.$t('common.deletion'),
        message: this.$t('profiles.confirmDeletion'),
        type: 'error'
      })

      if (confirm) {
        this.loading = true

        const profile = this.profiles.find(e => e.name === this.$route.params.name)
        
        await this.$axios.$delete(`server/profile/${profile.id}`) 
        this.profiles = await this.$axios.$get('server/profile')      
        this.$router.push('/profile')

        this.$snackbar({
          type: 'success',
          message: this.$t('profiles.deleted')
        })

        this.loading = false
      }
    }
  }
}
</script>

<style>

</style>