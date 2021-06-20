<template>
    <div class="sidebar">
        <el-menu class="sidebar-el-menu"
                 :default-active="onRoutes"
                 :collapse="collapse"
                 background-color="#334256"
                 text-color="#ffffff"
                 active-text-color="#20a0ff"
                 router>
            <!--template的作用是模板占位符，可帮助我们包裹元素，但在循环过程当中，template不会被渲染到页面上-->
            <template v-for="item in items">
                <template>
                    <el-menu-item :index="item.index" :key="item.index">
                        <i :class="item.icon"></i>
                        {{ item.title }}
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
    </div>
</template>

<script>
import bus from '../assets/js/bus'

export default {
    name: 'TheAside',
    data () {
        return {
            collapse: false,
            items: [
                {
                    icon: 'el-icon-document',
                    index: 'Info',
                    title: '系统首页'
                },
                {
                    icon: 'el-icon-document',
                    index: 'Consumer',
                    title: '用户管理'
                },
                {
                    icon: 'el-icon-document',
                    index: 'Singer',
                    title: '歌手管理'
                },
                {
                    icon: 'el-icon-document',
                    index: 'SongList',
                    title: '歌单管理'
                }

            ]
        }
    },
    computed: {
        onRoutes () {
            console.log(this.$route.path)
            return this.$route.path.replace('/', '')
        }
    },
    created () {
        /*
          通过bus进行组件之间的通信，来折叠侧边栏
         */
        //接收到信息，然后处理
        bus.$on('collapse', msg => {
            this.collapse = msg
        })
    }
}
</script>

<style scoped>

.sidebar {
    display: block;
    position: absolute;
    left: 0;
    top: 70px;
    bottom: 0;
    background-color: #334256;
    overflow-y: scroll;
}

/**
  设置侧边栏的滑纹
 */
.sidebar::-webkit-scrollbar {
    width: 0;
}

.sidebar-el-menu:not(.el-menu--collapse) {
    width: 150px;
}

.sidebar > ul {
    height: 100%;
}
</style>
