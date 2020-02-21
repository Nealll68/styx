'use strict'

class UpdateUser {
  async fails (errorMessages) {
    return this.ctx.response.badRequest(errorMessages[0].message)
  }

  get rules () {
    return {
      username: 'required|unique:users,username',
      password: 'required'
    }
  }

  get messages () {
    return {
      'username.required': 'Pseudo requis',
      'username.unique': 'Pseudo déjà utilisé',
      'password.required': 'Mot de passe requis'
    }
  }
}

module.exports = UpdateUser
