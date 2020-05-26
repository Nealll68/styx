const { resolve } = require('path')

module.exports = {
  mode: 'universal',
  dev: process.env.NODE_ENV === 'development',
  srcDir: resolve(__dirname, '..', 'resources'),
  /*
   ** Headers of the page
   */
  head: {
    titleTemplate: '%s - Styx',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { name: 'author', content: 'Nealll' }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
  },
  /*
   ** Customize the progress-bar color
   */
  loading: {
    color: '#1EB980'
  },
  /*
   ** Global CSS
   */
  css: ['~/assets/main.css'],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    '~/plugins/i18n',    
    { src: '~/plugins/adonisWS.client', ssr: false },
    { src: '~/plugins/vueApexCharts.client', ssr: false },
    { src: '~/plugins/steamGuard.client', ssr: false },
    { src: '~/plugins/confirm.client', ssr: false },
    '~/plugins/snackbar',
    '~/plugins/formatBytesFilter',
    '~/plugins/vuetifyIcons'
  ],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: ['@nuxtjs/dotenv', '@nuxtjs/vuetify', '@nuxtjs/moment'],
  /*
   ** Nuxt.js modules
   */
  modules: ['@nuxtjs/axios', '@nuxtjs/auth', 'cookie-universal-nuxt'],

  dotenv: {
    path: resolve(__dirname, '..')
  },
  /*
   ** Auth module configuration
   */
  auth: {
    strategies: {
      local: {
        endpoints: {
          login: { url: 'auth', method: 'post', propertyName: 'data.token' },
          user: { url: 'auth', method: 'get', propertyName: 'data' },
          logout: false
        }
      }
    }
  },
  /*
   ** Router configuration
   */
  router: {
    middleware: ['auth', 'i18n']
  },
  /*
   ** Moment module configuration
   */
  moment: {
    locales: ['fr'],
    defaultLocale: 'en'
  },
  /*
   ** vuetify module configuration
   ** https://github.com/nuxt-community/vuetify-module
   */
  vuetify: {
    theme: {
      dark: true,
      themes: {
        dark: {
          primary: '#1EB980',
          secondary: '#045D56',
          tertiary: '#FF6859',
          quaternary: '#FFCF44',
          quinary: '#B15DFF',
          senary: '#72DEFF'
        }
      }
    },

    defaultAssets: {
      icons: false
    }
  },
  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {},

    transpile: ['@adonisjs/websocket-client/index']
  }
}
