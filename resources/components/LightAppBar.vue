<template>
  <div>
    <v-app-bar 
      app
      elevate-on-scroll 
      color="rgba(33, 33, 33, 0.8)" 
      fixed
    >
      <v-container>
        <v-row align="center">
          <v-col md="4" class="hidden-sm-and-down">
            <nuxt-link to="/" class="headline text-uppercase font-weight-light menu-link">CP17</nuxt-link>
          </v-col>
          <v-col md="4" class="d-flex justify-center">
            <v-img src="/logo_cp17_light_150x150.png" max-height="50" max-width="50" class="hidden-sm-and-down"></v-img>
          </v-col>
          <v-col md="4" class="d-flex justify-end">
            <v-btn text small nuxt to="/demeter">Accéder à <span class="font-italic">Demeter</span></v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-app-bar>
  </div>
</template>

<script>
export default {

}
</script>

<style>
.menu-link {
  color: #ffffff !important;
  text-decoration: none !important;
}
</style>