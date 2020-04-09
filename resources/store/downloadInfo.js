export const state = () => ({
  type: null,
  title: null,
  logs: []
})

export const mutations = {
  init(state, value) {
    state.logs = []
    state.type = value.type

    switch (value.type) {
      case 'updateServer':
        state.title = this.$t('download.updateServer')
        break
      case 'downloadMod':
        state.title = this.$t('download.downloadMod', {
          modName: value.modName
        })
        break
      case 'downloadMission':
        state.title = this.$t('download.downloadMission', {
          missionName: value.missionName
        })
        break
    }
  },

  addLogs(state, value) {
    if (Array.isArray(value)) {
      state.logs = state.logs.concat(value)
    } else {
      state.logs.push(value)
    }
  },

  stop(state, code) {
    if (!code || code === 0) {
      switch (state.type) {
        case 'updateServer':
          this.$snackbar({
            type: 'success',
            message: this.$t('download.serverUpdated')
          })
          break
        case 'downloadMod':
          this.$snackbar({
            type: 'success',
            message: this.$t('download.modDownloaded')
          })
          break
        case 'downloadMission':
          this.$snackbar({
            type: 'success',
            message: this.$t('download.missonDownloaded')
          })
          break
      }
    } else if (code === 5) {
      this.$snackbar({
        type: 'error',
        message: this.$t('download.steamGuardCodeError')
      })
    } else if (code === 8) {
      this.$snackbar({
        type: 'error',
        message: this.$t('download.diskSpaceError')
      })
    }

    state.type = null
    state.title = null
  }
}
