<template>
  <v-app dark>
    <v-main>
      <v-slide-y-transition mode="out-in">
        <nuxt />
      </v-slide-y-transition>
    </v-main>
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
