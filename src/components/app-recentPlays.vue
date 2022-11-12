<template>
    <!-- 歌单列表 -->
    <el-scrollbar ref="scrollbarRef" height="534px" always @scroll="scroll">
        <div class="iconBtn">
            <div class="recentPlay">
                <div class="title">
                    <h2>最近播放</h2>
                    <div class="total">共 {{ total }} 首歌</div>
                </div>
                <div style="margin: 25px 0 20px 0;">
                    <el-button color="#EC4141" size="large" :icon="Search" round @click="clickAll">
                        <el-icon :size="30">
                            <CaretRight />
                        </el-icon> 播放全部 <el-icon :size="23" style="margin-left: 10px;">
                            <Plus />
                        </el-icon>
                    </el-button>
                    <el-button size="large" :icon="Search" round>
                        <el-icon style="margin-right: 10px;">
                            <Share />
                        </el-icon>分享
                    </el-button>
                </div>
            </div>
            <!-- 表格 -->
            <el-table v-loading="loadingScoll" lazy element-loading-text="Loading..." :data="listArr" stripe
                @row-dblclick="dbClick" highlight-current-row :cell-class-name="tableRowClassName">
                <el-table-column type="index" :index="indexMethod" width="60">
                    <template #default="scope">
                        <div class="image" v-if="scope.row.data.songIndex === $store.state.showOrHide.songDetail.rowsIndex &&
                        scope.row.data.name === $store.state.showOrHide.songData[scope.row.data.songIndex].name">
                            <i class=" iconfont  icon-shengyinkai"></i>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column align="left" width="60">
                    <template #header>
                        操作
                    </template>
                    <template #default>
                        <i class=" iconfont  icon-shoucang"></i>
                    </template>
                </el-table-column>
                <el-table-column prop="data.name" label="歌曲标题" />
                <el-table-column prop="data.ar[0].name" label="歌手" width="180" />
                <el-table-column prop="data.al.name" label="专辑" width="180" />
                <el-table-column prop="data.dt" label="时间" width="180" />
            </el-table>
        </div>
    </el-scrollbar>

</template>
<script>
import { useStore } from 'vuex'
import moment from 'moment'
import { recentApi } from '../api/record'
import { CaretRight, Share, Plus } from '@element-plus/icons-vue'
import { reactive, onMounted, ref } from 'vue'
export default {
    name: 'recentPlays',
    components: {
        CaretRight, Share, Plus
    },
    props: {
        songSheet: {
            type: Object,
            default: () => { }
        }
    },
    setup(props, { emit }) {
        const temp = ref(false)
        const loadingScoll = ref(false)
        const listArr = ref([])
        const total = ref(null)
        const store = useStore()
        let songDetailObj = reactive({})
        const index = ref('')
        const songSheetObj = reactive({
            songs: [],
            offset: 0,
            total: null,
            currentPage: 1
        })
        const getRecentApi = () => {
            loadingScoll.value = true
            recentApi().then(res => {
                console.log(res.data)
                res.data.data.list.forEach((item, i) => {
                    item.data.dt = moment(item.data.dt).format('mm:ss')
                    item.data.songIndex = i
                })
                listArr.value = res.data.data.list
                total.value = res.data.data.total
                loadingScoll.value = false
            })
        }
        // 添加类名给字标红
        const tableRowClassName = (row) => {
            if (row.columnIndex === 2 && row.rowIndex === store.state.showOrHide.songDetail.rowsIndex) {
                // 给第2个td里面添加goodsInfo的类名
                // if(store.state.showOrHide.songData.)
                // 判断标红的内容与vuex的内容是否相等
                if (store.state.showOrHide.songData.length) {
                    if (listArr.value[0].data.name === store.state.showOrHide.songData[0].name) {
                        return 'goodsInfo'
                    }
                }
            }
        }
        //   点击全部我们就播放列表第一首歌
        const clickAll = () => {
            listArr.value.forEach(item => {
                arrSongData.push(item.data)
            })
            if (listArr.value.length) {
                store.commit('showOrHide/songlist', arrSongData)
            } else {
                store.commit('showOrHide/songlist', arrSongData)
            }
            // 获取歌曲id 和 index
            index.value = listArr.value[0].data.songIndex
            songDetailObj.picUrl = listArr.value[0].data.al.picUrl
            songDetailObj.title = listArr.value[0].data.ar[0].name
            songDetailObj.name = listArr.value[0].data.name
            songDetailObj.id = listArr.value[0].data.id
            songDetailObj.uid = listArr.value[0].data.ar[0].id
            songDetailObj.rowsIndex = listArr.value[0].data.songIndex
            store.commit('showOrHide/picUrl', songDetailObj)
            // audio.value.play()
            temp.value = true
            store.commit('showOrHide/discisShow', temp.value)
        }
        let arrSongData = []
        // 获取表格的索引
        const dbClick = (rows) => {
            // 当我们点击列表以后获取的是当前列表无论怎么切换页面都不会有获取到其他的页面播放列表以及颜色标红
            // 1.把点击的接口数据保存到vuex中
            listArr.value.forEach(item => {
                arrSongData.push(item.data)
            })
            if (listArr.value.length) {
                store.commit('showOrHide/songlist', arrSongData)
            } else {
                store.commit('showOrHide/songlist', arrSongData)
            }
            // 获取歌曲id 和 index
            index.value = rows.data.songIndex
            console.log(rows, rows.data.songIndex)
            songDetailObj.picUrl = rows.data.al.picUrl
            songDetailObj.title = rows.data.ar[0].name
            songDetailObj.name = rows.data.name
            songDetailObj.id = rows.data.id
            songDetailObj.uid = rows.data.ar[0].id
            songDetailObj.rowsIndex = rows.data.songIndex
            store.commit('showOrHide/picUrl', songDetailObj)
            // audio.value.play()
            temp.value = true
            store.commit('showOrHide/discisShow', temp.value)
        }
        onMounted(() => {
            getRecentApi()
            console.log('最近播放')
        })
        return { songSheetObj, listArr, total, loadingScoll, clickAll, dbClick, tableRowClassName }
    }
}
</script>
<style lang="less" scoped>
/deep/.goodsInfo .cell {
    color: rgb(188, 58, 58);
    font-weight: 700;
}

.icon-shengyinkai {
    font-weight: 700;
    color: #bc3a3a;
    font-size: 20px;
}

.iconBtn {

    margin: 10px 0 15px 0;
    width: 1000px;

    .recentPlay {
        margin-left: 30px;
        line-height: 30px;

        .title {
            display: flex;

            .total {
                margin-left: 10px;
                color: #9F9F9F;
            }
        }

        .el-button {
            .buttom()
        }
    }

}

.el-table {
    thead {
        display: none;
    }

    /deep/.cell {
        white-space: nowrap;
    }

    /deep/.goodsIndex .cell {
        color: rgb(188, 58, 58);
        font-weight: 700;

    }

    --el-table-current-row-bg-color: #f5e4e4b0;
}
</style>