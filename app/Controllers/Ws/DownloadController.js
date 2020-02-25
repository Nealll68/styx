'use strict'

const SteamCMD = use('App/Services/SteamCMD')

class DownloadController {

  constructor ({ socket }) {
    this.socket = socket

    const downloadInfo = SteamCMD.downloadInfo

    if (downloadInfo.type) {
      this.socket.broadcastToAll('start', downloadInfo.type)
      this.socket.broadcastToAll('logs', downloadInfo.logs)
    }
  }

}

module.exports = DownloadController
