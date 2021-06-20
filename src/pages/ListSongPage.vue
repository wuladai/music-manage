<template>
    <div class="table">
        <div class="crumbs">
            <i class="el-icon-tickets">歌单歌曲信息</i>
        </div>
        <!-- 添加按钮 -->
        <div class="container">
            <div class="handle-box">
                <el-input v-model="select_word" size="mini" placeholder="输入歌曲名进行搜索" class="handle-input"></el-input>
                <el-button type="primary" size="mini" @click="centerDialogVisible = true">添加歌曲</el-button>
                <el-button type="danger" size="mini" @click="delAll">批量删除</el-button>
            </div>
        </div>

        <el-table size="mini" border width="100%" height="560px" :data="tableData"
                  @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="40px"></el-table-column>
            <el-table-column prop="name" label="歌手-歌名" align="center"></el-table-column>
            <el-table-column label="操作" width="170px" align="center">
                <template slot-scope="scope">
                    <el-button size="mini" type="danger" icon="el-icon-delete" circle plain
                               @click="handleDelete(scope.row.id)">删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- 添加歌曲提示框 -->
        <el-dialog title="添加歌曲" :visible.sync="centerDialogVisible" width="400px" center>
            <!-- 里面的内容需要提交，所以设计一个form表单 -->
            <el-form :model="registerForm" ref="registerForm" label-width="80px" action="" id="tf">
                <el-form-item prop="singerName" label="歌手名" size="mini">
                    <el-input v-model="registerForm.singerName" placeholder="歌手名"></el-input>
                </el-form-item>

                <el-form-item prop="songName" label="歌曲名" size="mini">
                    <el-input v-model="registerForm.songName" placeholder="歌曲名"></el-input>
                </el-form-item>
            </el-form>
            <!-- 提示框底部放两个按钮-->
            <span slot="footer">
                <el-button size="mini" @click="centerDialogVisible = false">取消</el-button>
                <el-button size="mini" @click="getSongId">确定</el-button>
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
import {mixin} from '../mixins'
import {delListSong, listSongAdd, listSongDetail, songOfSongId, songOfSongName} from '../api/index'

export default {
    name: 'ListSong',
    mixins: [mixin],
    data () {
        return {
            songListId: '',                 //歌单页面传递过来
            centerDialogVisible: false,     //添加弹窗
            delDialogVisible: false,        //删除弹窗
            //添加框
            registerForm: {
                singerName: '',
                songName: '',
            },

            tableData: [],
            tempData: [],       // 模糊查询后的歌手
            select_word: '',     // 模糊查询的搜索字
            select_index: -1,       //作为scope.row.id形式存在，这里表示listSong.id,
            multipleSelection: [],   //批量删除歌手的选中项

        }
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
    },
    //页面创建时自动执行
    created () {
        //获取歌单页面传递过来的值
        this.songListId = this.$route.query.id
        this.getData()
    },

    methods: {
        //查询所有歌曲，查询结果放到一个变量tableData
        getData () {
            this.tableData = []
            this.tempData = []
            //调用方法,返回值为res表示：list_song表里所有的歌曲（id, songId, songListId）
            listSongDetail(this.songListId).then(res => {
                for (let item of res) {
                    this.getSong(item.songId)   //将所有歌曲放入tempData、tableData
                }
            }).catch(error => {
                console.log(error)
            })
        },

        //根据songId找到对应的歌曲对象放到tableData和tempData里面
        getSong (songId) {
            songOfSongId(songId)
                .then(res => {      //res是一个song对象
                    this.tempData.push(res)
                    this.tableData.push(res)
                })
                .catch(error => {
                    console.log(error)
                })
        },

        //添加歌曲前的准备，先获取到歌曲Id,然后貂绒addSong(Id)
        getSongId () {
            let _this = this
            let songOfName = _this.registerForm.singerName + '-' + _this.registerForm.songName
            console.log('=======' + songOfName)
            songOfSongName(songOfName)
                .then(res => {  //res是一个songlist,后台执行根据歌名的精确查询，这里暂时先取第一条数据
                    _this.addSong(res[0].id)
                })
        },

        //添加歌单里面的歌曲
        addSong (id) {
            let _this = this
            let params = new URLSearchParams()
            params.append('songId', id)
            params.append('songListId', this.songListId)

            listSongAdd(params)
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
            _this.centerDialogVisible = false
        },

        //删除歌单里面的一条歌曲, this.select_index：表示songId
        deleteRow () {
            delListSong(this.select_index, this.songListId)
                .then(res => {
                    if (res) {
                        this.getData()     //修改成功需要刷新页面
                        this.notify('删除歌单歌曲成功', 'success')
                    } else {
                        this.notify('删除歌单歌曲失败', 'error')
                    }
                })
                .catch(err => {
                    console.log(err)
                })
            //操作的最后需要关闭这个对话框
            this.delDialogVisible = false
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

</style>
