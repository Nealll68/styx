'use strict'

const { spawn } = require('child_process')
const path = require('path')
const symlinkDir = require('symlink-dir')

const Helpers = use('Helpers')
const fs = Helpers.promisify(require('fs'))
const rimraf = Helpers.promisify(require('rimraf'))

const Ws = use('Ws')

const Config = use('App/Models/Config')
const Mod = use('App/Models/A3Server/Mod')

const A3Server = use('App/Services/A3Server')

const A3FolderPathUndefined = use('App/Exceptions/A3FolderPathUndefinedException')
const SteamCMDPathUndefined = use('App/Exceptions/SteamCMDPathUndefinedException')
const UnableToAccess = use('App/Exceptions/UnableToAccessException')
const SteamAccountRequired = use('App/Exceptions/SteamAccountRequiredException')
const SteamGuardRequired = use('App/Exceptions/SteamGuardRequiredException')

class A3SteamCMD {
    constructor () {
        this.steamcmd = null
        this.type = null
        this.logs = []
    }

    async updateServer (steamGuard = null) {
        const config = await Config.first()

        try {
            if (!config.steamcmd_path) {
                throw new SteamCMDPathUndefined()
            } else if (!config.a3server_path) {
                throw new A3FolderPathUndefined()
            } else if (!config.steam_account) {
                throw new SteamAccountRequired()
            } else if (config.steam_guard && !steamGuard) {
                throw new SteamGuardRequired()
            }

            A3Server.stop()

            this.steamcmd = spawn(path.join(config.steamcmd_path, 'steamcmd.exe'), [
                steamGuard ? `+login ${config.steam_account} ${config.steam_password} ${steamGuard}` : `+login ${config.steam_account} ${config.steam_password}`,
                `+force_install_dir ${config.a3server_path}`,
                '+app_update "233780 -beta" validate',
                '+quit'
            ])

            this.type = 'updateServer'
            this.sendWS('start', {
                type: this.type
            })

            this.steamcmd.on('close', code => {
                this.type = null
                this.logs = []
                this.sendWS('stop', code)
            })

            this.steamcmd.stdout.on('data', data => {
                this.logs.push(data.toString())
                this.sendWS('logs', data.toString())
            })
        } catch (ex) {
            throw ex
        }
    }

    async downloadWorkshop ({ workshopItemID, workshopItemName, workshopItemSize, steamGuard }) {
        try {
            const config = await Config.first()      

            if (!config.steamcmd_path) {
                throw new SteamCMDPathUndefined()
            } else if (!config.a3server_path) {
                throw new A3FolderPathUndefined()
            } else if (!config.steam_account) {
                throw new SteamAccountRequired()
            } else if (config.steam_guard && !steamGuard) {
                throw new SteamGuardRequired()
            }            

            this.steamcmd = spawn(path.join(config.steamcmd_path, 'steamcmd.exe'), [
                steamGuard ? `+login ${config.steam_account} ${config.steam_password} ${steamGuard}` : `+login ${config.steam_account} ${config.steam_password}`,
                `+workshop_download_item 107410 ${workshopItemID} validate`,
                '+quit'
            ])

            this.type = 'downloadMod'
            this.sendWS('start', {
                type: this.type,
                modName: workshopItemName
            })

            this.steamcmd.on('close', async code => {
                // Create symlink                    
                const formatItemName = `@${workshopItemName.replace(/[^a-zA-Z0-9 ]/g, '').split(' ').join('_')}`
                await symlinkDir(path.join(config.steamcmd_path, 'steamapps', 'workshop', 'content', '107410', `${workshopItemID}`), path.join(config.a3server_path, formatItemName))
                
                const mod = await Mod.findBy('workshop_id', workshopItemID)               

                if (mod) {
                    mod.merge({ 
                        name: formatItemName,
                        size: workshopItemSize,
                        server_updated_at: Date.now()
                    })

                    await mod.save()
                } else {
                    await Mod.create({
                        name: formatItemName,
                        size: workshopItemSize,
                        workshop_id: workshopItemID,
                        server_updated_at: Date.now()
                    })
                }

                this.type = null
                this.logs = []
                this.sendWS('stop', code)
            })

            this.steamcmd.stdout.on('data', data => {
                const stringData = data.toString()
                this.logs.push(stringData)
                this.sendWS('logs', stringData)
            })
        } catch (ex) {
            throw ex
        }
    }

    cancel () {
        this.steamcmd.kill()
        this.type = null
        this.logs = []
        this.sendWS('stop', null)
    }

    async deleteMod (workshopItemID, workshopItemName) {
        try {
            const config = await Config.first()      

            if (!config.steamcmd_path) {
                throw new SteamCMDPathUndefined()
            } else if (!config.a3server_path) {
                throw new A3FolderPathUndefined()
            }            

            if (await fs.access(path.join(config.a3server_path, workshopItemName), fs.constants.R_OK | fs.constants.W_OK)) throw new UnableToAccess()
            
            await fs.unlink(path.join(config.a3server_path, workshopItemName))

            if (await fs.access(path.join(config.steamcmd_path, 'steamapps', 'workshop', 'content', '107410', `${workshopItemID}`), fs.constants.R_OK | fs.constants.W_OK)) throw new UnableToAccess()

            await rimraf(path.join(config.steamcmd_path, 'steamapps', 'workshop', 'content', '107410', `${workshopItemID}`))
        } catch (ex) {
            throw ex
        }
    }

    async deleteLocalMod (name) {
        try {
            const config = await Config.first()      

            if (!config.a3server_path) {
                throw new A3FolderPathUndefined()
            }

            if (await fs.access(path.join(config.a3server_path, name), fs.constants.R_OK | fs.constants.W_OK)) throw new UnableToAccess()

            await rimraf(path.join(config.a3server_path, name))
        } catch (ex) {
            throw ex
        }
    }

    sendWS (event, data) {
        const downloadWS = Ws.getChannel('download-info').topic('download-info')
        if (downloadWS) {
            downloadWS.broadcast(event, data)
        }
    }

    get downloadInfo () {
        return {
            type: this.type,
            logs: this.logs
        }
    }       
}

module.exports = new A3SteamCMD()