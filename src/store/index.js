import { createStore } from 'vuex'

export default createStore({
    state() {
        return {
            pdfFile: null,
            word2pdfFile: null,
            receiverEmail: null,
            placeMark: null,//位置标记
            userArr: null
        }
    },
    mutations: {
        SET_PDF: (state, file) => {
            state.pdfFile = file
        },
        SET_WORD2PDF: (state, file) => {
            state.word2pdfFile = file
        },
        SET_EMAIL: (state, arr) => {
            state.receiverEmail = arr
        },
        SET_USERARR: (state, arr) => {
            state.userArr = arr
        },
        SET_MARK: (state, mark) => {
            state.placeMark = mark
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
