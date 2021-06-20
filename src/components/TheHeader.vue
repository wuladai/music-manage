<template>
    <div class="header">
        <!-- 折叠图片 -->
        <div class="collapse-btn" @click="collapseChange">
            <i class="el-icon-menu"></i>
        </div>
        <div class="logo">music后台管理</div>
        <div class="header-right">
            <div class="btn-fullscreen" @click="handleFullScreen">
                <el-tooltip :content="fullscreen?'取消全屏':'全屏'" placement="bottom">
                    <i class="el-icon-rank"></i>
                </el-tooltip>
            </div>
            <!-- 头像 -->
            <div class="user-avator"><img src="../assets/img/user2.png"></div>
            <!-- 下拉框 -- >
            <el-dropdown class="user-name" trigger="click" @command="handleCommand">
                <span class="el-dropdown-link">{{ userName }}<i class="el-icon-caret-bottom"></i></span>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="logout">退出登录</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </div>
    </div>
</template>

<script>
import bus from '../assets/js/bus'

export default {
    name: 'TheHeader',
    data () {
        return {
            collapse: false,
            fullscreen: false
        }
    },
    computed: {
        userName () {
            return localStorage.getItem('username')
        },
    },
    methods: {
        /**
         * 侧边栏折叠事件
         */
        collapseChange () {
            this.collapse = !this.collapse
            bus.$emit('collapse', this.collapse)   //组件之间的通信，发送给theAside
        },
        /**
         * 全屏消息提示事件
         */
        handleFullScreen () {
            if (this.fullscreen) {
                if (document.exitFullscreen) {
                    document.exitFullscreen()
                } else if (document.webkitCancelFullScreen) {    //safari Chrome
                    document.webkitCancelFullScreen()
                } else if (document.mozCancelFullScreen) {      //firefox
                    document.mozCancelFullScreen()
                } else if (document.msExitFullScreen) {     //ie
                    document.msExitFullScreen()
                }
            } else {
                let element = document.documentElement
                if (element.requestFullscreen()) {
                    element.requestFullscreen()
                } else if (element.webkitRequestFullScreen) {
                    element.webkitRequestFullScreen()
                } else if (element.mozRequestFullScreen) {
                    element.mozRequestFullScreen()
                } else if (document.msRequestFullScreen) {
                    document.msRequestFullScreen()
                }
            }
            this.fullscreen = !this.fullscreen
        },

        handleCommand (command) {
            if (command == 'logout') {
                localStorage.removeItem('username')
                this.$router.push('/')
            }
        },
    }

}
</script>

<style scoped>

.header {
    position: relative;
    background-color: #253041;
    box-sizing: border-box;
    width: 100%;
    height: 70px;
    font-size: 22px;
    color: white;
}

.collapse-btn {
    float: left;
    padding: 0 21px;
    cursor: pointer; /*鼠标移动过去变为手型*/
    line-height: 70px;
    color: skyblue;
}

.header .logo {
    float: left;
    height: 70px;
    line-height: 70px;
    color: skyblue;
}

.header-right {
    float: right;
    padding-right: 50px;
    display: flex; /*横着自由布局*/
    height: 70px;
    align-content: center; /*里面的内容居中*/
}

.btn-fullscreen {
    margin-right: 5px;
    font-size: 24px;
    line-height: 70px;
    transform: rotate(45deg); /*旋转45度*/
}

.user-avator {
    margin-left: 20px;
}

.user-avator img {
    display: block;
    width: 35px;
    height: 35px;
    border-radius: 50%;
    margin-top: 15px;
}

.user-name {
    margin-left: 10px;
}

.el-dropdown-link {
    color: white;
    cursor: pointer; /*鼠标覆盖变为手状*/
    line-height: 70px;
}
</style>
