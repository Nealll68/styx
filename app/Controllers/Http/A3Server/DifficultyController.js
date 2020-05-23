'use strict'

const FileManager = use('App/Services/FileManager')

class DifficultyController {

    async show ({ params, response }) {        
        const difficulty = await FileManager.getFileContent('difficulty', params.name)
        return response.ok(difficulty)
    }

    async update ({ params, request, response }) {
        const { difficulty } = request.all()

        await FileManager.write('difficulty', params.name, difficulty)
        return response.ok()
    }

    async reset ({ params, response }) {
        await FileManager.write('difficulty', params.name)
        const difficulty = await FileManager.getFileContent('difficulty', params.name)
        
        return response.ok(difficulty)
    }

}

module.exports = DifficultyController
