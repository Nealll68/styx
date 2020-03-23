export const state = () => ({
  locales: [
    {
      code: 'en',
      name: 'English'
    },
    {
      code: 'fr',
      name: 'Français'
    }
  ],
  locale: 'en'
})

export const mutations = {
  setLang(state, locale) {
    state.locale = locale
  }
}
