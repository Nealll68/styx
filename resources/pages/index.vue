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

    <v-sheet height="100%">
      <v-img 
        src="/main_background.jpg" 
        height="100%"
      >

        <v-container fluid class="landing-container px-12">
          <v-row 
            align="center"
            style="height: 100%"
            class="pb-5"
            no-gutters
          >
            <v-card 
              color="rgba(33, 33, 33, 0.8)" 
              class="pa-2"
              raised
            >
              <v-row align="center" justify="center">
                <v-col sm="12" md="2" lg="3" :class="$vuetify.breakpoint.smAndDown ? 'd-flex justify-center' : ''">
                  <v-img src="/logo_cp17_300x300.png" max-width="300" max-height="300"></v-img>
                </v-col>

                <v-col sm="12" md="10" lg="9">
                  <span class="display-1 font-weight-light font-italic text-uppercase">Commando Parachutiste 17</span>
                  <br/>
                  <span class="subtitle-1">Petite unité semi-milsim opérant avec du matériel français ou ressemblant sur Arma 3</span>
                </v-col>
              </v-row>
            </v-card>
          </v-row>
        </v-container>  
      </v-img>
    </v-sheet>

    <v-card 
      max-width="95%" 
      class="mx-auto mt-n12 pt-3 mb-5" 
      raised
      light
    >
      <v-sheet max-width="1000px" class="mx-auto">
        <v-card-title class="font-weight-bold text-center display-2 justify-center">
          Nous rencontrer
        </v-card-title>

        <v-card-text>
          <v-container>
            <v-row justify="center">
              <v-col cols="md-6 sm-12" class="text-center">
                <v-icon size="100">mdi-steam</v-icon>
                <h2 class="title">Steam</h2>
                <p>Vous pouvez contacter l'administrateur ou un des modérateurs du groupe Steam</p>
                <a href="https://steamcommunity.com/groups/cp_17" target="_blank">Accéder au groupe steam</a>
              </v-col>
              <v-col cols="md-6 sm-12" class="text-center">
                <v-icon size="100">mdi-ear-hearing</v-icon>
                <h2 class="title">
                  Teamspeak 
                  <v-tooltip top>
                    <template v-slot:activator="{ on }">
                      <v-icon v-on="on">mdi-help</v-icon>
                    </template>
                    Adresse : cp17.nitrado.fr<br/>
                    Mot de passe : CP1723Decembre2017
                  </v-tooltip>
                </h2>
                <p>Vous pouvez passer sur notre serveur Teamspeak. Nous y sommes souvent en soirée.</p>
                <a href="ts3server://cp17.nitrado.fr?password=CP1723Decembre2017">Se connecter au serveur Teamspeak</a>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-title class="font-weight-bold text-center display-2 justify-center">
          Nous suivre
        </v-card-title>

        <v-card-text>
          <p class="text-center">Vous pouvez nous suivre sur les réseaux sociaux. Nous y postons souvent des photos et vidéos.</p>
          <v-sheet class="text-center">
            <v-btn x-large text icon color="#38A1F3" href="https://twitter.com/CP17_A3" width="100" height="100" target="_blank">
              <v-icon size="80">mdi-twitter</v-icon>
            </v-btn>

            <v-btn x-large text icon color="#4267b2" href="https://www.facebook.com/CP17.A3/" width="100" height="100" target="_blank">
              <v-icon size="80">mdi-facebook</v-icon>
            </v-btn>
          </v-sheet>
        </v-card-text>
      </v-sheet>
    </v-card>

    <v-footer max-width="95%" class="mx-auto" color="transparent" padless>
      <v-col
        class="text-center"
        cols="12"
      >
        {{ new Date().getFullYear() }} — Created by <a href="https://nealll.dev" target="_blank">Nealll</a>
      </v-col>
    </v-footer>
  </div>
</template>

<script>
export default {
  auth: false
}
</script>

<style>
.menu-link {
  color: #ffffff !important;
  text-decoration: none !important;
}
</style>