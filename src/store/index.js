import { createStore } from 'vuex'

export default createStore({
    state() {
        return {
            pdfFile: null,
            receiverEmail: null,
            placeMark: null
        }
    },
    mutations: {
        SET_PDF: (state, file) => {
            state.pdfFile = file
        },
        SET_EMAIL: (state, arr) => {
            state.receiverEmail = arr
        },
    },
    actions: {
        setPdf({ commit }, amount) {
            // alert(amount)
            // commit('SET_PDF')
        },
    },
    modules: {

    }
})
