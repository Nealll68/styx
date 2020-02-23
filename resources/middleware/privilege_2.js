export default function ({ app, redirect }) {
    if (app.$auth.user.privilege < 2) {
        redirect('/commander')
    }
}