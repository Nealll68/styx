<template>
  <v-app dark>
    <light-app-bar />

    <v-content>
      <v-slide-y-transition mode="out-in">
        <nuxt />
      </v-slide-y-transition>
    </v-content>
  </v-app>
</template>

<script>
const LightAppBar = () => import('@/components/LightAppBar')

export default {
  components: {
    LightAppBar
  }
}
</script>
