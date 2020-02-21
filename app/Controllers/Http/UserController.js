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
	 * @param {Request} ctx.params
	 */
	async show ({ params }) {
		return await User.find(params.id)
	}

	/**
	 * Update user details.
	 * PUT or PATCH users/:id
	 *
	 * @param {object} ctx
	 * @param {Request} ctx.params
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
	 * @param {Response} ctx.params
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
}

module.exports = UserController
