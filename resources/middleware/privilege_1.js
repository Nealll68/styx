export default function ({ app, redirect }) {
    if (app.$auth.user.privilege < 1) {
        redirect('/demeter')
    }
}