'use strict'

class AuthController {

    async index ({ auth, response }) {
        return response.ok({
            data: auth.user
        })
    }

    async login ({ request, response, auth }) {
        const { username, password } = request.all()

        try {
            const token = await auth.attempt(username, password)

            return response.ok({
                data: token
            })
        } catch (ex) {
            return response.status(ex.status).send(ex.code)
        }
    }

}

module.exports = AuthController
