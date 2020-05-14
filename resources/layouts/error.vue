<template>
    <v-container class="app-container">
      <v-row justify="center">
        <v-card class="text-center">
          <v-card-title>
            <h1>😟 {{ $t('errors.errorPageTitle') }}</h1>
          </v-card-title>

          <v-card-text>
              <p class="display-4 font-weight-black mb-0 mt-5">{{ statusCode }}</p>        
              <p class="font-italic">{{ message }}</p>
              
              <h2>{{ $t('errors.errorPageDetails') }}</h2>
              {{ errorMessage }}
          </v-card-text>
        </v-card>          
      </v-row>
    </v-container>
</template>

<script>
export default {
  layout: 'interface',

  props: {
    error: {
      type: Object,
      default: null
    }
  },
  
  computed: {
    statusCode () {
      return (this.error && this.error.statusCode) || 500
    },

    errorMessage () {
      return this.error.message
    },

    message () {
      switch (this.statusCode) {
        case 404: 
          return this.$t('errors.pageNotFound')
          break

        case 500: 
          return this.$t('errors.internalServerError')
          break

        case 401: 
          return this.$t('errors.unauthorized')
          break

        default: 
          return this.$t('errors.other')
      }
    }
  }
}
</script>
