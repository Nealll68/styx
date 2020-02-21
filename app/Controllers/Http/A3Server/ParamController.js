'use strict'

const A3ServerParam = use('App/Models/A3Server/Param')

class ParamController {

    async update ({ params, request, response }) {
        const data = request.all()

        const startupParams = await A3ServerParam.findOrFail(params.id)

        startupParams.merge(data)
        await startupParams.save()

        return startupParams
    }

    async reset ({ params, response }) {
        const profile = await A3ServerParam.find(params.id)

        await profile.delete()

        await A3ServerParam.create({ profile_id: profile.profile_id })
        const newProfile = await A3ServerParam.findBy('profile_id', profile.profile_id)

        return newProfile
    }
}

module.exports = ParamController
