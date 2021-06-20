import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

//构造一个缓存，用于存放变量值
const store = new Vuex.Store({
    state: {
        HOST: 'http://127.0.0.1:8888',          //后台地址
        /**
         *  音乐播放器组件的相关变量
         */
        isPlay: false,  // 播放歌曲的播放状态
        url: '',        // 播放歌曲实际存储地址
        id: '',         // 播放歌曲id
    },

    // 取值
    getters: {
        isPlay: state => state.isPlay,
        url: state => state.url,
        id: state => state.id,
    },

    //设置值
    mutations: {
        setIsPlay: (state, isPlay) => {state.isPlay = isPlay},
        setUrl: (state, url) => {state.url = url},
        setId: (state, id) => {state.id = id},
    },
})

export default store
