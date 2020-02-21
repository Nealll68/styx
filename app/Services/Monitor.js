'use strict'

const si = require('systeminformation')
const Ws = use('Ws')

class Monitor {
    constructor () {
        this.measures = [] 
        
        setInterval(async () => {
            const measure = await this.takeMeasures()
      
            const monitorWS = Ws.getChannel('monitor').topic('monitor')

            if (monitorWS) {
                monitorWS.broadcast('last', measure)
            }
        }, 5000)
    }

    async takeMeasures () {
        const dynamicData = await si.getDynamicData()
      
        const cpuUsage = dynamicData.currentLoad.currentload.toFixed(0)
        const memUsed = (dynamicData.mem.used / dynamicData.mem.total * 100).toFixed(0)

        const measure = {
            take_at: Date.now(),
            cpu_usage: cpuUsage,
            mem_used: memUsed
        }

        if (this.measures.length === 20) {
            this.measures.splice(0, 1)
        }

        this.measures.push(measure)
        
        return measure
    }

    getMeasures () {
        return this.measures
    }

    getLastMeasures () {
        return this.measures[this.measures.length - 1]
    }
}

module.exports = new Monitor()