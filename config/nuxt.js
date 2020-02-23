const { resolve } = require('path')

module.exports = {
  mode: 'universal',
  dev: process.env.NODE_ENV === 'development',
  srcDir: resolve(__dirname, '..', 'resources'),
  /*
   ** Headers of the page
   */
  head: {
    titleTemplate: '%s - ' + process.env.npm_package_name,
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || ''
      }
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
    { src: '~/plugins/vuetifyConfirm.client', ssr: false },
    { src: '~/plugins/adonisWS.client', ssr: false },
    { src: '~/plugins/vueApexCharts.client', ssr: false },
    { src: '~/plugins/steamGuard.client', ssr: false },
    '~/plugins/axios'
  ],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module',
    '@nuxtjs/vuetify',
    '@nuxtjs/moment'
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    // Doc: https://github.com/nuxt-community/dotenv-module
    '@nuxtjs/dotenv',
    '@nuxtjs/auth',
    '@nuxtjs/toast'
  ],
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {
    baseURL: `${process.env.HOST}:${process.env.PORT}/api`
  },
  /*
  ** Auth module configuration
  */  
  auth: {
    strategies: {
      local: {
        endpoints: {
          login: { url: 'auth', method: 'post', propertyName: 'data' },
          logout: { url: 'auth/logout', method: 'post' }
        },
        tokenRequired: false,
        tokenType: false
      }
    }
  },
  /*
  ** Router configuration
  */
  router: {
    middleware: ['auth']
  },
  /*
  ** Moment module configuration
  */
  moment: {
    locales: ['fr'],
    defaultLocale: 'fr'
  },
  /*
  ** Toast module configuration
  */
  toast: {
    position: 'top-right',
    duration: 6000,
    keepOnHover: true,
    iconPack: 'mdi',
    action: {
      text: 'Fermer',
      onClick: (e, toastObject) => {
        toastObject.goAway(0)
      }
    },

    register: [
      {
        name: 'appError',
        message: (payload) => {          
          if (!payload) {
            return 'Une erreur s\'est produite'
          }
          return payload
        },
        options: {
          icon: 'alert',
          containerClass: ['app-toast', 'app-error-toast']
        }
      },
      {
        name: 'appSuccess',
        message: payload => payload,
        options: {
          icon: 'check-circle',
          containerClass: ['app-toast', 'app-success-toast']
        }
      },
      {
        name: 'appInfo',
        message: payload => payload,
        options: {
          icon: 'information',
          containerClass: ['app-toast', 'app-info-toast']
        }
      },
      {
        name: 'appWarning',
        message: payload => payload,
        options: {
          icon: 'exclamation',
          containerClass: ['app-toast', 'app-warning-toast']
        }
      }
    ]
  },
  /*
  ** vuetify module configuration
  ** https://github.com/nuxt-community/vuetify-module
  */
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: true,
      themes: {
        dark: {
          primary: '#1EB980',
          secondary: '#045D56',
          tertiary: '#FF6859',
          quaternary: '#FFCF44',
          quinary: '#B15DFF',
          senary: '#72DEFF',
        },
      },
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

    transpile: [
      '@adonisjs/websocket-client/index'
    ]
  }
}
