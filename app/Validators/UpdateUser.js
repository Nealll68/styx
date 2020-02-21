'use strict'

class EditUser {
  async fails (errorMessages) {
    return this.ctx.response.badRequest(errorMessages[0].message)
  }

  get rules () {
    const { id } = this.ctx.request.all()

    return {
      username: `required|unique:users,username,id,${id}`
    }
  }

  get messages () {
    return {
      'username.required': 'Pseudo requis',
      'username.unique': 'Pseudo déjà utilisé'
    }
  }
}

module.exports = EditUser
