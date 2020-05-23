'use strict'

const FileManager = use('App/Services/FileManager')

class BasicController {

    async show ({ params, response }) {
        const basic = await FileManager.getFileContent('basic', params.name)
        return response.ok(basic)
    }

    async update ({ params, request, response }) {
        const { content } = request.all()

        await FileManager.write('basic', params.name, content)
        return response.ok()
    }


    async reset ({ params, response }) {
        await FileManager.write('basic', params.name)
        const basic = await FileManager.getFileContent('basic', params.name)
        
        return response.ok(config)       
    }

}

module.exports = BasicController
