export const actions = {
  async nuxtServerInit ({}, { $auth }) {
    try {
      await $auth.fetchUser()
    } catch (ex) {}
  }
}
