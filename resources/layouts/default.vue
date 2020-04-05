<template>
  <v-app dark>
    <v-content>
      <v-slide-y-transition mode="out-in">
        <nuxt />
      </v-slide-y-transition>
    </v-content>
  </v-app>
</template>

<script>
export default {
  head () {
    return {
      title: 'Accueil'
    }
  },
}
</script>
