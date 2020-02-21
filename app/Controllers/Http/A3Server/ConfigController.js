'use strict'

const A3ServerConfig = use('App/Models/A3Server/Config')

class ConfigController {

    async update ({ params, request, response }) {
        const data = request.all()

        const config = await A3ServerConfig.findOrFail(params.id)
        config.merge(data)
        await config.save()

        return config
    }


    async reset ({ params, response }) {
        const config = await A3ServerConfig.find(params.id)

        await config.delete()

        await A3ServerConfig.create({ profile_id: config.profile_id })
        const newConfig = await A3ServerConfig.findBy('profile_id', config.profile_id)

        return newConfig
    }
}

module.exports = ConfigController
