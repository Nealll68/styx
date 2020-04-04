'use strict'

const A3ServerParam = use('App/Models/A3Server/Param')

class ParamController {

    async update ({ params, request }) {
        const data = request.all()

        const serverParams = await A3ServerParam.find(params.id)

        serverParams.merge(data)
        await serverParams.save()

        return serverParams
    }

    async reset ({ params }) {
        const serverParams = await A3ServerParam.find(params.id)

        await serverParams.delete()

        await A3ServerParam.create({ profile_id: serverParams.profile_id })
        const newServerParams = await A3ServerParam.findBy('profile_id', serverParams.profile_id)

        return newServerParams
    }
}

module.exports = ParamController
