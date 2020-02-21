'use strict'

const Helpers = use('Helpers')

const { spawn } = require('child_process')
const path = require('path')
const _ = require('lodash')
const fs = Helpers.promisify(require('fs'))
const Tail = require('tail').Tail

const Ws = use('Ws')
const Drive = use('Drive')

const Config = use('App/Models/Config')
const A3ServerProfile = use('App/Models/A3Server/Profile')

const A3FileManager = use('App/Services/A3FileManager')

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

                const serverConfig = await profile.serverConfig().fetch()
                const serverDifficulty = await profile.serverDifficulty().fetch()

                if (this.lastStartAt) {
                    if (new Date(serverConfig.updated_at) >= this.lastStartAt) {
                        await A3FileManager.write('config', profile, serverConfig.toJSON())
                    }

                    if (new Date(serverDifficulty.updated_at) >= this.lastStartAt) {
                        await A3FileManager.write('difficulty', profile, serverDifficulty.toJSON())
                    }
                } else {
                    await A3FileManager.write('config', profile, serverConfig.toJSON())
                    await A3FileManager.write('difficulty', profile, serverDifficulty.toJSON())
                }                

                const params = await profile.serverParam().fetch()

                const profileFolder = path.join(config.a3server_path, 'commander', profile.name)

                this.lastStartAt = Date.now()
                                
                const executable = this.a3Executables[process.platform][config.x64 ? 'arma3server_x64' : 'arma3server']
                
                this.a3server = spawn(path.join(config.a3server_path, executable), [                    
                    `-port=${config.port}`,
                    `-profiles="${profileFolder}"`,
                    `-config="${path.join(profileFolder, 'server.cfg')}"`,
                    `-mod="${profile.mods}"`,
                    `serverMod="${profile.server_mod}"`,
                    params.auto_init ? '-autoInit' : '',
                    params.load_mission_to_memory ? '-loadMissionToMemory' : '',
                    params.no_logs ? '-noLogs' : '',
                    params.enable_ht ? '-enableHT' : '',
                    params.huge_pages ? '-hugepages' : ''
                ])               
                
                await new Promise(resolve => { setTimeout(resolve, 2000) })

                const logFiles = await this.logFiles()
                const profileLogFiles = logFiles.find(e => e.profile_name === profile.name)
                const lastLogFile = _.maxBy(profileLogFiles.files, file => {
                    return fs.statSync(path.join(profileFolder, file)).ctime
                })

                const tail = new Tail(path.join(profileFolder, lastLogFile))

                tail.on('line', data => {
                    this.sendWS('logs', data)
                })

                this.a3server.on('close', code => {
                    this.a3server = null
                    tail.unwatch()
                    this.sendWS('stop', code)
                })

                this.sendWS('start')
            }
        } catch (ex) {
            throw ex
        }
    }

    stop () {
        if (this.a3server) {
            this.a3server.kill()
        }
    }

    async restart () {        
        try {
            this.stop()
            await new Promise(resolve => { setTimeout(resolve, 4000) })
            await this.start()
        } catch (ex) {
            throw ex
        }
    }

    async logFiles () {
        const config = await Config.first()
        const profiles = await A3ServerProfile.all()

        let returnData = []
        for (const profile of profiles.toJSON()) {
            const files = await fs.readdir(path.join(config.a3server_path, 'commander', profile.name))
            returnData.push({
                profile_name: profile.name,
                files: files.filter(file => file.endsWith('.rpt')).reverse()
            })
        }

        return returnData
    }

    async getLogs (profileName, filename) {
        const config = await Config.first()

        return await Drive.get(path.join(config.a3server_path, 'commander', profileName, filename), 'UTF-8')
    }

    async deleteLogs (profileName, filename) {
        const config = await Config.first()      

        await Drive.delete(path.join(config.a3server_path, 'commander', profileName, filename))
    }

    sendWS (event, data) {
        const a3serverWS = Ws.getChannel('a3-server').topic('a3-server')
        if (a3serverWS) {
            a3serverWS.broadcast(event, data)
        }
    }    

    get isStarted () {
        if (this.a3server) {
            return true
        } else {
            return false
        }
    }
}

module.exports = new A3Server()