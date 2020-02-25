'use strict'

const A3ServerDifficulty = use('App/Models/A3Server/Difficulty')

class DifficultyController {

    async update ({ params, request }) {
        const data = request.all()

        const serverDifficulty = await A3ServerDifficulty.find(params.id)
        serverDifficulty.merge(data)
        await serverDifficulty.save()            

        return serverDifficulty
    }

    async reset ({ params }) {
        const difficulty = await A3ServerDifficulty.find(params.id)

        await difficulty.delete()

        await A3ServerDifficulty.create({ profile_id: difficulty.profile_id })
        const newDifficulty = await A3ServerDifficulty.findBy('profile_id', difficulty.profile_id)

        return newDifficulty
    }

}

module.exports = DifficultyController
