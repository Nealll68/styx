export const state = () => ({
    measures: []
})

export const mutations = {
    init (state, value) {
        state.measures = value
    },

    add (state, value) {
        if (state.measures.length === 20) {
            state.measures.splice(0, 1)
        }
        state.measures.push(value)
    }
}