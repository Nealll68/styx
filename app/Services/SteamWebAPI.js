'use strict'

const Helpers = use('Helpers')
const Request = Helpers.promisify(require('request'))

class SteamWebAPI {
    async getFileDetails (workshopID) {
        try {
            const options = {
                'method': 'POST',
                'url': 'https://api.steampowered.com/ISteamRemoteStorage/GetPublishedFileDetails/v1',
                'headers': {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                form: {
                    'itemcount': '1',
                    'publishedfileids[0]': `${workshopID}`
                }
            }

            const details = await Request(options)

            return JSON.parse(details.body)
        } catch (ex) {
            throw ex
        }
    }

    async getCollectionDetails (collectionID) {
        try {
            const collectionOptions = {
                'method': 'POST',
                'url': 'https://api.steampowered.com/ISteamRemoteStorage/GetCollectionDetails/v1',
                'headers': {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                form: {
                    'collectioncount': '1',
                    'publishedfileids[0]': `${collectionID}`
                }
            }

            const steamResponse = await Request(collectionOptions)
            const collectionDetails = JSON.parse(steamResponse.body)
            const collectionFilesIds = collectionDetails.response.collectiondetails[0].children.map(element => element.publishedfileid)

            let fileDetails = []
            for (const fileId of collectionFilesIds) {                
                const details = await Request({
                    'method': 'POST',
                    'url': 'https://api.steampowered.com/ISteamRemoteStorage/GetPublishedFileDetails/v1',
                    'headers': {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    form: {
                        'itemcount': '1',
                        'publishedfileids[0]': `${fileId}`
                    }
                })

                const body = JSON.parse(details.body)
                fileDetails.push({
                    publishedfileid: body.response.publishedfiledetails[0].publishedfileid,
                    title: body.response.publishedfiledetails[0].title,
                    preview_url: body.response.publishedfiledetails[0].preview_url,
                    time_created: body.response.publishedfiledetails[0].time_created,
                    time_updated: body.response.publishedfiledetails[0].time_updated,
                    file_size: body.response.publishedfiledetails[0].file_size
                })
            }

            return fileDetails
        } catch (ex) {
            throw ex
        }
    }
}

module.exports = new SteamWebAPI()