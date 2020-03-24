export default function({ store, redirect }) {
  if (!store.state.config.a3ServerPath) {
    redirect('/commander/path-error')
  }
}
