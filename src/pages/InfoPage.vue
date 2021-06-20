<template>
    <div>
        <!--::gutter="20"表示每一行间距-->
        <el-row :gutter="20" class="mgb20">
            <el-col :span="6">
                <el-card>
                    <div class="grid-content">
                        <div class="grid-content-center">
                            <div class="grid-content-center-num">{{ consumerCount }}</div>
                            <div>用户总数</div>
                        </div>
                    </div>
                </el-card>
            </el-col>

            <el-col :span="6">
                <el-card>
                    <div class="grid-content">
                        <div class="grid-content-center">
                            <div class="grid-content-center-num">{{ songCount }}</div>
                            <div>歌曲总数</div>
                        </div>
                    </div>
                </el-card>
            </el-col>

            <el-col :span="6">
                <el-card>
                    <div class="grid-content">
                        <div class="grid-content-center">
                            <div class="grid-content-center-num">{{ singerCount }}</div>
                            <div>歌手总数</div>
                        </div>
                    </div>
                </el-card>
            </el-col>

            <el-col :span="6">
                <el-card>
                    <div class="grid-content">
                        <div class="grid-content-center">
                            <div class="grid-content-center-num">{{ songListCount }}</div>
                            <div>歌单总数</div>
                        </div>
                    </div>
                </el-card>
            </el-col>
        </el-row>

        <el-row :gutter="20" class="mgb20">
            <el-col :span="12">
                <h3 style="margin-bottom: 20px">用户性别比例</h3>
                <div style="background-color: white">
                    <ve-pie :data="consumerSex" :theme="optionsForConsumerSex"></ve-pie>
                </div>
            </el-col>

            <el-col :span="12">
                <h3 style="margin-bottom: 20px">歌单风格分布</h3>
                <div style="background-color: white">
                    <!--                    <ve-pie :data="songListStyle"></ve-pie>-->
                    <ve-histogram :data="songListStyle"></ve-histogram>
                </div>
            </el-col>

        </el-row>

        <el-row :gutter="20" class="mgb20">
            <el-col :span="12">
                <h3 style="margin-bottom: 20px">歌手性别比例</h3>
                <div style="background-color: white">
                    <ve-pie :data="singerSex"></ve-pie>
                </div>
            </el-col>

            <el-col :span="12">
                <h3 style="margin-bottom: 20px">歌单地区分布</h3>
                <div style="background-color: white">
                    <!--                    <ve-pie :data="songListStyle"></ve-pie>-->
                    <ve-histogram :data="region" :theme="optionsForRegion"></ve-histogram>
                </div>
            </el-col>

        </el-row>
    </div>
</template>

<script>
import {getAllConsumer, allSong, getAllSinger, getAllSongList} from '../api/index'

export default {
    name: 'InfoPage',

    data () {
        return {
            consumerCount: 0,   //用户总数
            songCount: 0,       //歌曲总数
            singerCount: 0,     //歌手总数
            songListCount: 0,   //歌单总数
            consumers: [],      //所有用户

            consumerSex: {      //按性别分类的用户数，饼图所需
                columns: ['sex', 'num'],
                rows: [
                    {'sex': '女', 'num': 0},
                    {'sex': '男', 'num': 0},
                ]
            },
            optionsForConsumerSex: {          //按性别分类的颜色，饼图所需
                color: ['#ffc0cb', '#87cefa'],
            },

            songListStyle: {      //按歌单风格分类，柱状图所需
                columns: ['style', 'num'],
                rows: [
                    {'style': '安静', 'num': 0},
                    {'style': '腊鸡', 'num': 0},
                    {'style': '华语', 'num': 0},
                    {'style': '粤语', 'num': 0},
                    {'style': '日韩', 'num': 0},
                    {'style': '欧美', 'num': 0},
                ]
            },

            singerSex: {      //按性别分类的歌手数，饼图所需
                columns: ['sex', 'num'],
                rows: [
                    {'sex': '女', 'num': 0},
                    {'sex': '男', 'num': 0},
                    {'sex': '组合', 'num': 0},
                    {'sex': '不明', 'num': 0},
                ]
            },

            region: {       //按歌手地区分类，柱状图所需
                columns: ['locationFrom', 'num'],
                rows: [
                    {'locationFrom': '神州大陆', 'num': 0},
                    {'locationFrom': '香港', 'num': 0},
                    {'locationFrom': '台湾', 'num': 0},
                    {'locationFrom': '新加坡', 'num': 0},
                    {'locationFrom': '美国', 'num': 0},

                ]
            },
            optionsForRegion: {          //按性别分类的颜色，饼图所需
                color: ['#006400FF'],
            },

        }
    },

    /**
     * mounted与created的区别：
     *      mounted： 页面所有元素加载完了之后再执行里面的方法
     *      created： 页面正在加载元素的时候就执行里面的方法
     */
    mounted () {
        this.getConsumers()
        this.getAllSong()
        this.getSingers()
        this.getSongLists()
    },

    methods: {
        //获取到所有用户
        getConsumers () {
            getAllConsumer().then(res => {
                // data属性赋值
                this.consumers = res
                this.consumerCount = res.length
                //饼图性别相关数据赋值
                this.consumerSex.rows[0]['num'] = this.getSexNum(0, this.consumers);
                this.consumerSex.rows[1]['num'] = this.getSexNum(1, this.consumers);
            })
        },

        //获取到所有歌曲
        getAllSong () {
            allSong().then(res => {
                this.songCount = res.length
            })
        },

        //获取到所有歌手
        getSingers () {
            getAllSinger().then(res => {
                // data属性赋值
                this.singerCount = res.length;
                //饼图性别相关数据赋值
                this.singerSex.rows[0]['num'] = this.getSexNum(0, res);     //女
                this.singerSex.rows[1]['num'] = this.getSexNum(1, res);     //男
                this.singerSex.rows[2]['num'] = this.getSexNum(2, res);     //组合
                this.singerSex.rows[3]['num'] = this.getSexNum(3, res);     //不明

                //柱状图歌手地区分布相关数据赋值
                for(let item of res){
                    this.setSingerRegionByLocation(item.location);
                }
            })
        },

        // 给data属性region赋值
        setSingerRegionByLocation(location){
            for (let item of this.region.rows) {
                if (location.includes(item['locationFrom'])) {
                    item['num']++;
                }
            }
        },

        //根据性别获取对应的人数
        getSexNum (sex, valList) {
            let count = 0
            for (let item of valList) {
                if (sex == item.sex) {
                    count++
                }
            }
            return count
        },

        //根据风格style为data属性songListStyle里面的num赋值
        setSongListStyleNum (style) {
            for (let item of this.songListStyle.rows) {
                if (style.includes(item['style'])) {
                    item['num']++
                }
            }
        },

        //获取到所有歌单,并给data属性和柱状图属性赋值
        getSongLists () {
            getAllSongList().then(res => {
                //data属性赋值
                this.songListCount = res.length
                //柱状图属性赋值
                for (let item of res) {
                    this.setSongListStyleNum(item.style)
                }
            })
        },

    },
}
</script>

<style scoped>

.mgb20 {
    margin-bottom: 20px;
}

.grid-content {
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 50px;
}

.grid-content-center {
    flex: 1;
    text-align: center;
    font-size: 14px;
    color: darkgray;

}

.grid-content-center-num {
    font-size: 30px;
    font-weight: bold;
}

</style>
