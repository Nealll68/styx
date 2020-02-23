'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */

const User = use('App/Models/User')

/**
 * Resourceful controller for interacting with users
 */
class UserController {
	/**
	 * Show a list of all users.
	 * GET users
	 *
	 * @param {object} ctx
	 */
	async index () {
    	return await User.all()
	}

	/**
	 * Create/save a new user.
	 * POST users
	 *
	 * @param {object} ctx
	 * @param {Request} ctx.request
	 */
	async store ({ request }) {
		const userData = request.all()
			
		const user = await User.create(userData)
        return user
	}

	/**
	 * Display a single user.
	 * GET users/:id
	 *
	 * @param {object} ctx
	 * @param {Params} ctx.params
	 */
	async show ({ params }) {
		return await User.find(params.id)
	}

	/**
	 * Update user details.
	 * PUT or PATCH users/:id
	 *
	 * @param {object} ctx
	 * @param {Params} ctx.params
	 * @param {Request} ctx.request
	 */
	async update ({ params, request }) {
		const { username, password, privilege } = request.all()

		const user = await User.find(params.id)

		user.merge({ username, privilege })
		
		if (password) {
			user.merge({ password })
		}

		await user.save()
		return user
	}

	/**
	 * Delete a user with id.
	 * DELETE users/:id
	 *
	 * @param {object} ctx
	 * @param {Params} ctx.params
	 * @param {Response} ctx.response
	 */
	async destroy ({ params, response }) {
		const user = await User.find(params.id)

		if (user.privilege === 2) {
			if (await User.query().where('privilege', 2).getCount() === 1) {
				return response.forbidden('E_SUPER_ADMIN_ACCOUNT_REQUIRED')
			}
		}
				
		await user.delete()
		return response.ok()
	}

	/**
	 * Login a user with credentials.
	 * POST auth
	 *
	 * @param {object} ctx
	 * @param {Request} ctx.request
	 * @param {Response} ctx.response
	 * @param {Auth} ctx.auth
	 */
	async login ({ request, response, auth }) {
		const { username, password, remember } = request.all()

		try {
			await auth
				.remember(remember)
				.attempt(username, password)

			return response.ok({
				data: auth.user
			})
		} catch (ex) {
			return response
				.status(ex.status)
				.send(ex.code)
		}
	}

	/**
	 * Logout a user.
	 * POST auth/logout
	 *
	 * @param {object} ctx
	 * @param {Response} ctx.response
	 * @param {Auth} ctx.auth
	 */
	async logout ({ response, auth }) {
		await auth.logout()
		return response.ok()
	}
}

module.exports = UserController
