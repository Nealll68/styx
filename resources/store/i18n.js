export const state = () => ({
  locales: [
    {
      code: 'en',
      name: 'EN'
    },
    {
      code: 'fr',
      name: 'FR'
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
