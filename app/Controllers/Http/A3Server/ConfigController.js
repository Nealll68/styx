'use strict'

const FileManager = use('App/Services/FileManager')

class ConfigController {

    async show ({ params, response }) {
        const config = await FileManager.getFileContent('config', params.name)
        return response.ok({
            data: config
        })
    }

    async update ({ params, request, response }) {
        const { config } = request.all()

        await FileManager.write('config', params.name, config)
        return response.ok()
    }


    async reset ({ params, response }) {
        await FileManager.write('config', params.name, null, true)
        const config = await FileManager.getFileContent('config', params.name)
        
        return response.ok({
            data: config
        })       
    }
}

module.exports = ConfigController
