export const state = () => ({
    a3ServerPath: null,
    steamCmdPath: null
})

export const mutations = {
    set (state, value) {
        state.a3ServerPath = value.a3server_path
        state.steamCmdPath = value.steamcmd_path
    }
}