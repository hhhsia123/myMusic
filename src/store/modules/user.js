export default {
    namespaced: true,
    state() {
        return {
            profile: {
                avatarUrl: '',
                city: '',
                nickname: '',
                province: '',
                userId: '',
                token: '',
                cookie: '',
                eventCount: '',
                followeds: '',
                follows: ''
            }
        }
    },
    mutations: {
        setuser(state, payload) {
            state.profile = payload
        }
    }
}
