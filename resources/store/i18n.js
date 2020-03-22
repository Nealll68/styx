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
    if (state.locales.find(el => el.code === locale)) {
      state.locale = locale
    }
  }
}
