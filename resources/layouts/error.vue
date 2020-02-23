<template>
  <v-app dark>
    <v-container class="app-container">
      <h1>Oups... une erreur est survenue</h1>
        
      <p class="display-4 font-weight-light mb-0 mt-5">{{ statusCode }}</p>        
      <p class="font-italic">{{ message }}</p>

      <h2>Détails :</h2>
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
  
  data () {
    return {
      pageNotFound: 'Page non trouvée',
      internalServerError: 'Erreur interne au serveur',
      unauthorized: 'Accès interdit',
      otherError: 'Une erreur s\'est produite'
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
          return this.pageNotFound
          break

        case 500: 
          return this.internalServerError
          break

        case 401: 
          return this.unauthorized
          break

        default: 
          return this.otherError
      }
    }
  }
}
</script>
