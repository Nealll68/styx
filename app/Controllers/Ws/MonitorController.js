'use strict'

const Monitor = use('App/Services/Monitor')

class MonitorController {
    constructor ({ socket }) {
        socket.broadcastToAll('data', Monitor.getMeasures())
    }
}

module.exports = MonitorController
