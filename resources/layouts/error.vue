<template>
  <v-app dark>
    <v-container class="app-container">
      <h1>{{ $t('errors.errorPageTitle') }}</h1>
        
      <p class="display-4 font-weight-light mb-0 mt-5">{{ statusCode }}</p>        
      <p class="font-italic">{{ message }}</p>

      <h2>{{ $t('errors.errorPageDetails') }}</h2>
      {{ errorMessage }}
    </v-container>
  </v-app>
</template>

<script>
export default {
  layout: 'empty',

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
