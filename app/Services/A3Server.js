'use strict'

const { spawn } = require('child_process')
const path = require('path')

const Ws = use('Ws')

const Config = use('App/Models/Config')
const A3ServerProfile = use('App/Models/A3Server/Profile')

const FileManager = use('App/Services/FileManager')

class A3Server {

    constructor () {
        this.a3server = null
        this.lastStartAt = null
        this.a3Executables = {
            "win32": {
                "arma3server": "arma3server.exe",
                "arma3server_x64": "arma3server_x64.exe"
            },
            "linux": {
                "arma3server": "arma3server",
                "arma3server_x64": "arma3server"
            }
        }
    }

    async start () {
        try {
            if (this.a3server === null) {
                const config = await Config.first()
                const profile = await A3ServerProfile.findBy('isDefault', true)

                if (!profile) {
                    this.sendWS('stop', 'noProfile')
                    return
                }                
                                
                const executable = this.a3Executables[process.platform][config.x64 ? 'arma3server_x64' : 'arma3server']
                this.a3server = spawn(path.join(config.a3server_path, executable), this.buildParams(config, profile.name, await profile.serverParam().fetch()))               
                
                await new Promise(resolve => { setTimeout(resolve, 2000) })

                this.a3server.on('close', code => {
                    this.a3server = null
                    this.sendWS('stop', code)
                })

                this.sendWS('start')
            }
        } catch (ex) {
            throw ex
        }
    }
    
    async restart () {        
        try {
            this.stop()
            await new Promise(resolve => { setTimeout(resolve, 3000) })
            await this.start()
        } catch (ex) {
            throw ex
        }
    }

    stop () {
        if (this.a3server) {
            this.a3server.kill()
            this.a3server = null
        }
    }

    buildParams (config, profileName, params) {
        const profileFolder = path.join(config.a3server_path, 'styx', profileName)

        let paramsArray = [
            `-port=${config.port}`,
            `-profiles="${profileFolder}"`,
            `-name=${profileName}`,
            `-config="${path.join(profileFolder, 'server.cfg')}"`
        ]

        if (params.mods) paramsArray.push(`-mod="${params.mods}"`)
        if (params.server_mod) paramsArray.push(`-serverMod="${params.server_mod}"`)
        if (params.auto_init) paramsArray.push('-autoInit')
        if (params.load_mission_to_memory) paramsArray.push('-loadMissionToMemory')
        if (params.no_logs) paramsArray.push('-noLogs')
        if (params.enable_ht) paramsArray.push('-enableHT') 
        if (params.huge_pages) paramsArray.push('-hugepages')
        if (params.file_patching) paramsArray.push('-filePatching')

        return paramsArray
    }

    sendWS (event, data) {
        const a3serverWS = Ws.getChannel('a3-server').topic('a3-server')
        if (a3serverWS) {
            a3serverWS.broadcast(event, data)
        }
    }    

    isStarted () {
        if (this.a3server !== null) {
            this.sendWS('start', null)
        }
    }
}

module.exports = new A3Server()