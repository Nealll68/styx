'use strict'

const A3Server = use('App/Services/A3Server')

class A3ServerController {
    constructor ({ socket }) {
        this.socket = socket
        
        if (A3Server.isStarted) {
            this.socket.emit('start')
        }
    }

    async onStart () {
        await A3Server.start()
    }

    async onRestart () {
        await A3Server.restart()
    }

    onStop () {
        A3Server.stop()
    }
}

module.exports = A3ServerController
