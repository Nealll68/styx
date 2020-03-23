export default function({ isHMR, app, store, req }) {
  if (isHMR) {
    return
  }

  const locale = app.$cookies.get('locale') || app.i18n.fallbackLocale
  
  store.commit("i18n/setLang", locale)
  app.i18n.locale = store.state.i18n.locale

  app.$cookies.set("locale", locale, {
    path: "/"
  })
}
