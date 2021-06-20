<template>
    <div class="table">
        <div class="crumbs">
            <i class="el-icon-tickets">歌曲信息</i>
        </div>
        <!-- 添加按钮 -->
        <div class="container">
            <div class="handle-box">
                <el-input v-model="select_word" size="mini" placeholder="输入歌曲名进行搜索" class="handle-input"></el-input>
                <el-button type="primary" size="mini" @click="centerDialogVisible = true">添加歌曲</el-button>
                <el-button type="danger" size="mini" @click="delAll">批量删除</el-button>
            </div>
        </div>
        <!-- 歌手展示页面,同步数据由tableData改为data -->
        <!-- <el-table size="mini" border width="100%" height="500px" :data="tableData">-->
        <el-table size="mini" border width="100%" height="560px" :data="data" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="40px"></el-table-column>
            <el-table-column label="歌曲图片" width="110px" align="center">
                <template slot-scope="scope">
                    <div class="song-img">
                        <!--为了让可以向后端访问到这个getUrl(scope.row.pic)图片地址，后端需要加上静态资源访问映射-->
                        <img :src="getUrl(scope.row.pic)" style="width: 100%"/>
                    </div>
                    <div class="play" @click="setSongStoreInfo(scope.row.url, scope.row.id)">
                        <!---->
                        <template v-if="scope.row.id==playingSongId && playState">
                            <svg class="icon">
                                <use xlink:href="#icon-zanting"></use>
                            </svg>
                        </template>
                        <template v-else>
                            <svg class="icon">
                                <use xlink:href="#icon-bofanganniu"></use>
                            </svg>
                        </template>
                    </div>
                </template>
            </el-table-column>

            <el-table-column prop="name" label="歌手-歌名" width="120px" align="center"></el-table-column>
            <el-table-column prop="introduction" label="专辑" width="150px" align="center"></el-table-column>
            <el-table-column label="歌词" align="center">
                <template slot-scope="scope">
                    <!--歌词处理 v-for循环显示-->
                    <ul style="height: 100px; overflow-y: scroll">
                        <li v-for="(item, index) in parseLyric(scope.row.lyric)" :key="index">{{ item }}</li>
                    </ul>
                </template>
            </el-table-column>

            <el-table-column label="资源更新" width="170px" align="center">
                <template slot-scope="scope">
                    <!--在歌曲图片更新: 按钮-->
                    <el-upload :action="uploadUrl(scope.row.id)"
                               :before-upload="beforAvatorUpload"
                               :on-success="handleAvatorSuccess">
                        <el-button size="mini" round type="success" plain style="margin-bottom: 8px">更新图片</el-button>
                    </el-upload>

                    <!--歌曲文件更新: 按钮-->
                    <el-upload :action="uploadSongUrl(scope.row.id)"
                               :before-upload="beforSongUpload"
                               :on-success="handleSongSuccess">
                        <el-button size="mini" round type="success" plain>更新歌曲</el-button>
                    </el-upload>
                </template>
            </el-table-column>

            <el-table-column label="操作" width="170px" align="center">
                <template slot-scope="scope">
                    <el-button size="mini" type="primary" icon="el-icon-edit" circle plain
                               @click="handleEdit(scope.row)">编辑
                    </el-button>
                    <el-button size="mini" type="danger" icon="el-icon-delete" circle plain
                               @click="handleDelete(scope.row.id)">删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>

        <!--分页符-->
        <div class="paginaton">
            <el-pagination background layout="total,prev,pager,next"
                           :current-page="currentPage" :page-size="pageSize" :total="tableData.length"
                           @current-change="handleCurrentChange">
            </el-pagination>
        </div>


        <!-- 添加歌手提示框 -->
        <el-dialog title="添加歌曲" :visible.sync="centerDialogVisible" width="400px" center>
            <!-- 里面的内容需要提交，所以设计一个form表单 -->
            <el-form :model="registerForm" ref="registerForm" label-width="80px" action="" id="tf">
                <div>
                    <label>歌名</label>
                    <el-input type="text" name="name"></el-input>
                </div>
                <div>
                    <label>专辑</label>
                    <el-input type="text" name="introduction"></el-input>
                </div>
                <div>
                    <label>歌词</label>
                    <el-input type="textarea" name="lyric"></el-input>
                </div>
                <div>
                    <label>歌曲上传</label>
                    <el-input type="file" name="file"></el-input>
                </div>

            </el-form>
            <!-- 提示框底部放两个按钮-->
            <span slot="footer">
                <el-button size="mini" @click="centerDialogVisible = false">取消</el-button>
                <el-button size="mini" @click="addSong">确定</el-button>
            </span>
        </el-dialog>

        <!-- 修改歌手提示框 -->
        <el-dialog title="修改歌曲" :visible.sync="editDialogVisible" width="400px" center>
            <!-- 里面的内容需要提交，所以设计一个form表单 -->
            <el-form :model="form" ref="form" label-width="80px">
                <el-form-item prop="name" label="歌手-歌名" size="mini">
                    <el-input v-model="form.name" placeholder="歌手-歌名"></el-input>
                </el-form-item>

                <el-form-item prop="introduction" label="专辑" size="mini">
                    <el-input v-model="form.introduction" placeholder="专辑"></el-input>
                </el-form-item>

                <el-form-item prop="introduction" label="歌词" size="mini">
                    <el-input v-model="form.lyric" placeholder="歌词" type="textarea"></el-input>
                </el-form-item>
            </el-form>
            <!-- 提示框底部放两个按钮-->
            <span slot="footer">
                <el-button size="mini" @click="editSave">确定</el-button>
                <el-button size="mini" @click="editDialogVisible = false">取消</el-button>
            </span>
        </el-dialog>

        <!-- 删除歌手提示框 -->
        <el-dialog title="删除歌曲" :visible.sync="delDialogVisible" width="300px" center>
            <div align="center">删除不可恢复，是否确定删除呢？</div>
            <!-- 提示框底部放两个按钮-->
            <span slot="footer">
                <el-button size="mini" @click="deleteRow">确定</el-button>
                <el-button size="mini" @click="delDialogVisible = false">取消</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import {mixin} from '../mixins'            //引入notify(), getUrl()
import {mapGetters} from 'vuex'
import '@/assets/js/iconfont.js'
import {songOfSingerId, updateSong, delSong} from '../api/index'     //引入歌曲操作相关的方法

export default {
    name: 'SongPage',
    mixins: [mixin],
    data () {
        return {
            singerId: '',       //歌手页面传递过来的
            singerName: '',       //歌手页面传递过来的
            centerDialogVisible: false,     //添加弹窗
            editDialogVisible: false,       //编辑弹窗
            delDialogVisible: false,        //删除弹窗
            //添加框
            registerForm: {
                name: '',
                singerName: '',
                introduction: '',
                lyric: '',
            },
            //编辑框
            form: {
                id: '',
                name: '',
                introduction: '',
                lyric: '',
            },
            tableData: [],
            tempData: [],       // 模糊查询后的歌手
            select_word: '',     // 模糊查询的搜索字
            pageSize: 4,       //分页：每页的大小
            currentPage: 1,      // 当前页序号
            select_index: -1,       //当前选择项，为了便于删除选中项
            multipleSelection: [],   //批量删除歌手的选中项

            playState: this.$store.getters.isPlay,      //播放键图标显示状态
            playingSongId: '',  //记录正在播放的音乐的id

        }
    },
    /**
     * 页面加载完毕之后执行以下函数
     * 为了实现分页效果，tableData是全部数据，不在合适。这里用data代替，list.slice。并加上翻页功能
     * */
    computed: {
        data () {
            return this.tableData.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize)
        },
        //计算属性...mapGetters: 从公共缓存里拿到播放器的播放状态
        ...mapGetters(['id', 'url', 'isPlay']),     //获取到store.getters里面定义的键（函数）所返回的值

    },
    /**
     * 监控当前页面所能看见的所有元素,当元素发生改变，执行对应函数
     */
    watch: {
        //监控搜索框字段，如果列表内容发生变化，执行函数
        select_word: function () {
            if (this.select_word == '') {
                this.tableData = this.tempData
            } else {
                this.tableData = []
                for (let item of this.tempData) {
                    if (item.name.includes(this.select_word)) {
                        this.tableData.push(item)
                    }
                }
            }
        },

        //监控公共缓存里面的id，方便及时同步
        id: function () {
            this.playingSongId = this.$store.getters.id
        },
        //监控公共缓存里面的isPlay，方便及时同步
        isPlay: function () {
            this.playState = this.$store.getters.isPlay
        },
    },
    //页面创建时自动执行
    created () {
        //获取歌手页面传递过来的值
        this.singerId = this.$route.query.id
        this.singerName = this.$route.query.name
        this.getData()

        //同步与播放器的播放状态
        this.playState = this.$store.getters.isPlay
    },

    methods: {
        //查询所有歌曲，查询结果放到一个变量tableData
        getData () {
            this.tableData = []
            this.tempData = []
            //调用方法,返回值为res,对res做进一步处理,then是后台正常执行，catch是通信异常处理
            songOfSingerId(this.singerId).then(res => {
                this.tableData = res
                this.tempData = res
                this.currentPage = 1
            }).catch(error => {
                console.log(error)
            })
        },
        //添加歌曲
        addSong () {
            let _this = this
            var form = new FormData(document.getElementById('tf')) //获取到表单
            form.append('singerId', this.singerId)
            form.set('name', this.singerName + '-' + form.get('name'))     //歌名改为：歌手-歌名
            if (!form.get('lyric')) {
                form.set('lyric', '[00:00:00]暂无歌词')
            }
            var req = new XMLHttpRequest()
            req.onreadystatechange = function () {
                // req.readyState == 4: 获取到返回的完成数据
                // req.status == 200: 和后台正常交互完成
                if (req.readyState == 4 && req.status == 200) {
                    let res = JSON.parse(req.response)
                    if (res.code == 1) {
                        _this.getData()    //成功则重新查询
                        _this.registerForm = []    //清空当前的新增页面
                        _this.notify(res.msg, 'success')
                    } else {
                        _this.notify(res.msg, 'error')
                    }
                }
            }
            /**
             * 提交请求, async:异步，这里表示发同步请求
             * 发送数据
             */
            req.open('post', `${_this.$store.state.HOST}/song/add`, false)
            req.send(form)
            //操作的最后需要关闭这个对话框
            _this.centerDialogVisible = false
        },

        //更新图片
        uploadUrl (id) {
            //其实就是向后端发送url请求啦,不要忘了带上参数
            return `${this.$store.state.HOST}/song/updateSongPic?id=${id}`
        },

        //获取分页的当前页
        handleCurrentChange (val) {
            this.currentPage = val
        },

        //弹出编辑页面进行歌手编辑
        handleEdit (row) {
            this.editDialogVisible = true
            this.form = {
                id: row.id,
                name: row.name,
                introduction: row.introduction,
                lyric: row.lyric,
            }
        },

        //保存编辑页面的歌手数据
        editSave () {

            let params = new URLSearchParams()
            params.append('id', this.form.id)
            params.append('name', this.form.name)
            params.append('introduction', this.form.introduction)
            params.append('lyric', this.form.lyric)
            //调用方法,返回值为res,对res做进一步处理,then是后台正常执行，catch是通信异常处理
            updateSong(params)
                .then(res => {
                    if (res.code == 1) {
                        this.getData()     //修改成功需要刷新页面
                        this.notify(res.msg, 'success')
                    } else {
                        this.notify(res.msg, 'error')
                    }
                })
                .catch(err => {
                    console.log(err)
                })
            //操作的最后需要关闭这个对话框
            this.editDialogVisible = false
        },

        //删除一名歌手,返回结果res是一个boolean值
        deleteRow () {
            delSong(this.select_index)
                .then(res => {
                    if (res) {
                        this.getData()     //修改成功需要刷新页面
                        this.notify('删除单个歌曲成功', 'success')
                    } else {
                        this.notify('删除单个歌曲失败', 'error')
                    }
                })
                .catch(err => {
                    console.log(err)
                })
            //操作的最后需要关闭这个对话框
            this.delDialogVisible = false

        },

        //解析歌词
        parseLyric (text) {
            let lines = text.split('\n')
            let pattern = /\[\d{2}:\d{2}.(\d{3}|\d{2})\]/g
            let result = []
            for (let item of lines) {
                let value = item.replace(pattern, '')         //所有符合这种模式的字段改为‘’
                result.push(value)
            }
            return result
        },

        // 上传歌曲之前需要做的一些校验
        beforSongUpload (file) {
            //先取文件扩展名
            let testMsg = (String)(file.name).substr((String)(file.name).lastIndexOf('.') + 1, (String)(file.name).length)
            const extension = (testMsg == 'mp3')
            if (!extension) {
                this.$message({
                    message: '上传文件格式只能是mp3',
                    type: 'error'
                })
                return false
            }

            return true
        },

        // 上传歌曲成功之后要做的校验
        handleSongSuccess (res) {
            let _this = this     //this表示操作的当前页面
            if (res.code == 1) {
                // 成功则刷新一下页面，即重新查询一下
                _this.getData()
                _this.$notify({
                    title: '图片上传成功',
                    type: 'success'
                })
            } else {
                _this.$notify({
                    title: '图片上传失败',
                    type: 'error'
                })
            }
        },

        //更新歌曲
        uploadSongUrl (id) {
            //其实就是向后端发送url请求啦,不要忘了带上参数
            return `${this.$store.state.HOST}/song/updateSongUrl?id=${id}`
        },

        //切换播放音乐歌曲: url是文件相对地址
        setSongStoreInfo (url, id) {
            /**
             * 这里需要判断一下是同一首歌的状态切换呢？还是直接切歌?
             */
            if (id == this.playingSongId) {
                //同一首歌
                this.$store.commit('setIsPlay', !this.playState)
            } else {
                //切歌
                this.playingSongId = id
                this.$store.commit('setId', id)
                this.$store.commit('setIsPlay', true)

                //从参数拿到相对url，但是如果我们的目的是拿到真实的音乐文件地址,拿到地址后对公共缓存里的url赋值即可
                this.$store.commit('setUrl', this.$store.state.HOST + url)
            }
        },

    }

}
</script>

<style scoped>

.crumbs {
    margin-bottom: 20px;
}

.container {
    padding: 20px;
    background: #fff;
    border: 1px solid #ddd;
    border-radius: 5px;
}

.table {
    min-width: 800px;
}

.handle-input {
    width: 300px;
    display: inline-block;
}

.handle-box {
    margin-bottom: 20px;
}

.song-img {
    width: 100%;
    height: 80px;
    border-radius: 5px;
    margin-bottom: 5px;
    overflow: hidden;
}


.paginaton {
    display: flex; /*灵活布局*/
    justify-content: center; /*里面的内容居中*/
}

.play {
    position: absolute;
    z-index: 100;
    width: 80px;
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    top: 18px;
    left: 15px;
}

.icon {
    width: 2em;
    width: 2em;
    color: darkgreen;
    fill: currentColor;
    overflow: hidden;
}
</style>
