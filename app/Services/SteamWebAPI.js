'use strict'

const axios = require('axios')
const qs = require('querystring')

class SteamWebAPI {
    static async getFileDetails (workshopID) {
        try {
            const response = await axios.post('https://api.steampowered.com/ISteamRemoteStorage/GetPublishedFileDetails/v1', qs.stringify({
                'itemcount': 1,
                'publishedfileids[0]': workshopID
            }), 
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            })
            
            return response.data.response.publishedfiledetails[0]
        } catch (ex) {
            throw ex
        }
    }

    static async getCollectionDetails (collectionID) {
        try {
            const collectionDetails = await axios.post('https://api.steampowered.com/ISteamRemoteStorage/GetCollectionDetails/v1', qs.stringify({
                'collectioncount': 1,
                'publishedfileids[0]': collectionID
            }), 
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            })

            const collectionFilesIds = collectionDetails.data.response.collectiondetails[0].children.map(element => element.publishedfileid)
            
            let fileDetails = []
            for (const fileId of collectionFilesIds) {                
                const details = await this.getFileDetails(fileId)

                fileDetails.push({
                    publishedfileid: details.publishedfileid,
                    title: details.title,
                    preview_url: details.preview_url,
                    time_created: details.time_created,
                    time_updated: details.time_updated,
                    file_size: details.file_size
                })
            }

            return fileDetails
        } catch (ex) {
            throw ex
        }
    }
}

module.exports = SteamWebAPI