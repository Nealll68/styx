'use strict'

const A3SteamCMD = use('App/Services/A3SteamCMD')

class DownloadController {

  constructor ({ socket }) {
    this.socket = socket

    const downloadInfo = A3SteamCMD.downloadInfo

    if (downloadInfo.type) {
      this.socket.broadcastToAll('start', downloadInfo.type)
      this.socket.broadcastToAll('logs', downloadInfo.logs)
    }
  }

}

module.exports = DownloadController
