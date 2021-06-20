<template>
    <div class="song-audio">
        <audio id="player"
               :src="playing._src"
               controls="controls" preload="auto"
               @canplay="startPlay" @ended="ended"></audio>
    </div>
</template>

<script>
/***
 * 这是一个公共的音乐播放器，这个音乐播放器在播放音乐之前，需要从公共缓存里拿到
 * 音乐播放源url, 然后赋值给src,然后再播放
 */
import {mapGetters} from 'vuex'        //mapGetters可以监控store里面的值

export default {
    name: 'SongAudio',
    data () {
        return {
            //这个是正在播放的音乐相关信息
            playing: {
                _src: this.$store.getters.url,
                _state: false,
            },
        }
    },
    //监听属性设置值
    watch: {

        //当url发生变化，说明点击了新的歌曲
        url: function () {
            this.playing._state = false                //暂停正在放的歌曲
            this.playing._src = this.$store.getters.url    //更新歌曲播放源
            this.startPlay()       //开始播放新的歌曲
        },

        //监听isPlay这个属性，只要发生变化，就切换当前播放音乐的状态
        isPlay: function () {
            this.togglePlayState()
        },

    },

    // 获取属性设置值
    computed: {
        ...mapGetters(['id', 'url', 'isPlay']),     //获取到store.getters里面定义的键（函数）所返回的值
    },
    methods: {
        //获取链接后准备播放
        startPlay () {
            let player = document.querySelector('#player');
            //播放钱更改playing的状态
            this.playing._state = true
            player.play()  //开始播放
        },

        //播放完成之后触发
        ended () {
            this.playing._state = false;
        },

        //切换状态，然后开始或暂停播放
        togglePlayState () {
            let player = document.querySelector('#player');
            if (this.playing._state) {
                this.playing._state = !this.playing._state
                player.pause()     //暂停播放

            } else {
                this.playing._state = !this.playing._state
                player.play()      //继续播放
            }
        },

    }
}
</script>

<style scoped>
.song-audio {
    display: none;
}
</style>
