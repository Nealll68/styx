'use strict'

const SteamWebAPI = use('App/Services/SteamWebAPI')

class WorkshopController {

    async getFileDetails ({ params }) {
        return await SteamWebAPI.getFileDetails(params.id)
    }

    async getCollectionDetails ({ params }) {
        return await SteamWebAPI.getCollectionDetails(params.id)
    }

}

module.exports = WorkshopController
