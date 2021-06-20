<template>
    <div class="table">
        <!-- 添加按钮 -->
        <div class="container">
            <div class="handle-box">
                <el-input v-model="select_word" size="mini" placeholder="筛选关键字" class="handle-input"></el-input>
                <el-button type="primary" size="mini" @click="centerDialogVisible = true">添加歌单</el-button>
                <el-button type="danger" size="mini" @click="delAll">批量删除</el-button>
            </div>
        </div>
        <!-- 歌单展示页面,同步数据由tableData改为data -->
        <!-- <el-table size="mini" border width="100%" height="500px" :data="tableData">-->
        <el-table size="mini" border width="100%" height="560px" :data="data" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="40px"></el-table-column>
            <el-table-column label="歌单图片" width="110px" align="center">
                <!--这里需要对图片进行处理-->
                <template slot-scope="scope">
                    <div class="songList-img">
                        <!--为了让可以向后端访问到这个getUrl(scope.row.pic)图片地址，后端需要加上静态资源访问映射-->
                        <img :src="getUrl(scope.row.pic)" style="width: 100%"/>
                    </div>
                    <!--在图片下面添加图片上传功能: 按钮-->
                    <el-upload :action="uploadUrl(scope.row.id)"
                               :before-upload="beforAvatorUpload"
                               :on-success="handleAvatorSuccess">
                        <el-button size="mini">更新图片</el-button>
                    </el-upload>
                </template>
            </el-table-column>

            <el-table-column prop="title" label="标题" width="120px" align="center"></el-table-column>
            <el-table-column prop="style" label="风格" width="120px" align="center"></el-table-column>

            <el-table-column prop="introduction" label="简介" align="center">
                <template slot-scope="scope">
                    <p style="overflow-y: scroll">{{ scope.row.introduction }}</p>
                </template>
            </el-table-column>

            <el-table-column label="歌曲管理" align="center" width="110px">
                <template slot-scope="scope">
                    <el-button type="success" plain @click="songEdit(scope.row.id)">>></el-button>
                </template>
            </el-table-column>

            <el-table-column label="操作" width="170px" align="center">
                <template slot-scope="scope">
                    <el-button size="mini" type="primary" icon="el-icon-edit" circle plain @click="handleEdit(scope.row)">编辑</el-button>
                    <el-button size="mini" type="danger" icon="el-icon-delete" circle plain @click="handleDelete(scope.row.id)">删除</el-button>
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



        <!-- 添加歌单提示框 -->
        <el-dialog title="添加歌单" :visible.sync="centerDialogVisible" width="400px" center>
            <!-- 里面的内容需要提交，所以设计一个form表单 -->
            <el-form :model="registerForm" ref="registerForm" label-width="80px">
                <el-form-item prop="title" label="标题" size="mini">
                    <el-input v-model="registerForm.title" placeholder="标题"></el-input>
                </el-form-item>

                <el-form-item prop="introduction" label="简介" size="mini">
                    <el-input v-model="registerForm.introduction" placeholder="简介" type="textarea"></el-input>
                </el-form-item>

                <el-form-item prop="style" label="风格" size="mini">
                    <el-input v-model="registerForm.style" placeholder="风格"></el-input>
                </el-form-item>
            </el-form>
            <!-- 提示框底部放两个按钮-->
            <span slot="footer">
                <el-button size="mini" @click="centerDialogVisible = false">取消</el-button>
                <el-button size="mini" @click="addSongList">确定</el-button>
            </span>
        </el-dialog>

        <!-- 修改歌单提示框 -->
        <el-dialog title="修改歌单" :visible.sync="editDialogVisible" width="400px" center>
            <!-- 里面的内容需要提交，所以设计一个form表单 -->
            <el-form :model="form" ref="form" label-width="80px">
                <el-form-item prop="title" label="标题" size="mini">
                    <el-input v-model="form.title" placeholder="标题"></el-input>
                </el-form-item>

                <el-form-item prop="introduction" label="简介" size="mini">
                    <el-input v-model="form.introduction" placeholder="简介" type="textarea"></el-input>
                </el-form-item>

                <el-form-item prop="style" label="风格" size="mini">
                    <el-input v-model="form.style" placeholder="风格"></el-input>
                </el-form-item>
            </el-form>
            <!-- 提示框底部放两个按钮-->
            <span slot="footer">
                <el-button size="mini" @click="editDialogVisible = false">取消</el-button>
                <el-button size="mini" @click="editSave">确定</el-button>
            </span>
        </el-dialog>

        <!-- 删除歌单提示框 -->
        <el-dialog title="删除歌单" :visible.sync="delDialogVisible" width="300px" center>
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
import {setSongList, getAllSongList, updateSongList, delSongList} from '../api/index'     //引入歌单操作相关的方法
import {mixin} from '../mixins'            //引入notify(), getUrl()

export default {
    name: 'SongList',
    mixins: [mixin],
    data () {
        return {
            centerDialogVisible: false,     //添加弹窗
            editDialogVisible: false,       //编辑弹窗
            delDialogVisible: false,        //删除弹窗
            //添加框
            registerForm: {
                title: '',
                style: '',
                introduction: ''
            },
            //编辑框
            form: {
                id: '',
                title: '',
                style: '',
                introduction: ''
            },
            tableData: [],
            tempData: [],       // 模糊查询后的歌单
            select_word: '',     // 模糊查询的搜索字
            pageSize: 4,       //分页：每页的大小
            currentPage: 1,      // 当前页序号
            select_index: -1,       //当前选择项，为了便于删除选中项
            multipleSelection: [],   //批量删除歌单的选中项

        }
    },
    /**
     * 页面加载完毕之后执行以下函数
     * 为了实现分页效果，tableData是全部数据，不在合适。这里用data代替，list.slice。并加上翻页功能
     * */
    computed: {
        data () {
            return this.tableData.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize)
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
                    if (item.title.includes(this.select_word)) {
                        this.tableData.push(item)
                    }
                }
            }
        },
    },
    //页面创建时自动执行
    created () {
        this.getData()
    },

    methods: {
        //查询所有歌单，查询结果放到一个变量tableData
        getData () {
            this.tableData = []
            this.tempData = []
            //调用方法,返回值为res,对res做进一步处理,then是后台正常执行，catch是通信异常处理
            getAllSongList().then(res => {
                this.tableData = res
                this.tempData = res
                this.currentPage = 1;
            }).catch(error => {
                console.log(error)
            })
        },
        //添加歌单
        addSongList () {

            let params = new URLSearchParams();
            params.append('title', this.registerForm.title);
            params.append('pic', '/img/songListPic/123.jpg');
            params.append('introduction', this.registerForm.introduction);
            params.append('style', this.registerForm.style);
            //调用方法,返回值为res,对res做进一步处理,then是后台正常执行，catch是通信异常处理
            setSongList(params)
                .then(res => {
                    if (res.code == 1) {
                        this.getData();     //添加成功需要刷新页面
                        this.notify(res.msg, 'success');
                    } else {
                        this.notify(res.msg, 'error');
                    }
                })
                .catch(err => {
                    console.log(err);
                })
            //操作的最后需要关闭这个对话框
            this.centerDialogVisible = false;
        },

        //更新图片
        uploadUrl (id) {
            //其实就是向后端发送url请求啦,不要忘了带上参数
            return `${this.$store.state.HOST}/songList/updateSongListPic?id=${id}`
        },

        //获取分页的当前页
        handleCurrentChange(val){
            this.currentPage = val;
        },

        //弹出编辑页面进行歌单编辑
        handleEdit(row){
            this.editDialogVisible = true;
            this.form = {
                id: row.id,
                title: row.title,
                introduction: row.introduction,
                style: row.style,
            };
        },

        //保存编辑页面的歌单数据
        editSave(){

            let params = new URLSearchParams();
            params.append('id', this.form.id);
            params.append('title', this.form.title);
            // params.append('pic', '/img/songListPic/123.jpg'); //更新时不会传头像
            params.append('introduction', this.form.introduction);
            params.append('style', this.form.style);
            //调用方法,返回值为res,对res做进一步处理,then是后台正常执行，catch是通信异常处理
            updateSongList(params)
                .then(res => {
                    if (res.code == 1) {
                        this.getData();     //修改成功需要刷新页面
                        this.notify(res.msg, 'success');
                    } else {
                        this.notify(res.msg, 'error');
                    }
                })
                .catch(err => {
                    console.log(err);
                });
            //操作的最后需要关闭这个对话框
            this.editDialogVisible = false;
        },

        //删除一名歌单,返回结果res是一个boolean值
        deleteRow(){
            delSongList(this.select_index)
             .then(res => {
                    if (res) {
                        this.getData();     //修改成功需要刷新页面
                        this.notify("删除单个歌单成功", 'success');
                    } else {
                        this.notify("删除单个歌单失败", 'error');
                    }
                })
                .catch(err => {
                    console.log(err);
                });

            //操作的最后需要关闭这个对话框
            this.delDialogVisible = false;

        },
        //转向歌曲管理页面
        songEdit(id){
            this.$router.push({path: `/ListSong`, query:{id, name}})
        },
    }

}
</script>

<style scoped>

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

.songList-img {
    width: 100%;
    height: 80px;
    border-radius: 5px;
    margin-bottom: 5px;
    overflow: hidden;
}
.paginaton{
    display: flex; /*灵活布局*/
    justify-content: center;    /*里面的内容居中*/
}


</style>
