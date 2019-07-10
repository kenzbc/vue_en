export const MEMBER = 'member'

export const state = {
    member: {
        info: null,
        bank: {
            avatar: '/en/static/image/avatar.jpg',
            diamond: 0,
            guozi1: 0,
            ticket: 0,
            nickname: ''
        },
        member_id: null,
        token: null,
        dialogShow: false
    },
    scrollTop: 0,
    category:'',
}

export const actions = {
    category(context,payload) {  //同上注释
        console.log("TTTTTT",payload)
        context.commit('category',payload);
    },

}

export const getters = {
    category:state=>state.category
}

export const mutations = {
    setMemberItem(state, {key,val}) {
        state.member[key] = val
    },
    scrollTop (state, scrollTop) {
        state.scrollTop = scrollTop
    },
    logout(state) {
        state.member = {}
        localStorage.removeItem(MEMBER)
    },
    category(state,payload)
    {
    console.log("xxxx",payload)
    state.category=payload
    }
}
