<template>
    <div class="iconBtn">
        <div>
            <el-button color="#EC4141" size="large" :icon="Search" round>
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
        <div class="total">找到 {{ songSheetObj.total }} 首单曲</div>
    </div>
    <!-- 歌单列表 -->

    <el-table :data="songSheetObj.songs" stripe @row-dblclick="dbClick" highlight-current-row
        :cell-class-name="tableRowClassName" show-overflow-tooltip>
        <el-table-column type="index" prop="songIndex" :index="indexMethod" width="60">
            <template #default="scope">
                <div class="image"
                    v-if="scope.row.songIndex === $store.state.showOrHide.songDetail.rowsIndex && scope.row.name === $store.state.showOrHide.songData[scope.row.songIndex].name">
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
        <el-table-column prop="name" label="歌曲标题" />
        <el-table-column prop="ar[0].name" label="歌手" width="180" />
        <el-table-column prop="al.name" label="专辑" width="180" />
        <el-table-column prop="dt" label="时间" width="180" />
    </el-table>
    <!-- 分页 -->
    <div class="example-pagination-block">

        <el-pagination @click="clickButtom" small background layout="prev, pager, next" :total="songSheetObj.total"
            @size-change="handleSizeChange" @current-change="handleCurrentChange" class="mt-4"
            v-model:currentPage="songSheetObj.currentPage" v-model:page-size="songSheetObj.limit" />
    </div>

</template>
<script>
import { useStore } from 'vuex'
import { CaretRight, Share, Plus } from '@element-plus/icons-vue'
import { watch, reactive, ref } from 'vue'
export default {
    name: 'searchSongSheet',
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
        const songSheetObj = reactive({
            songs: [],
            offset: 0,
            total: null,
            currentPage: 1
        })
        let temp = ref(false)
        const index = ref('')
        const store = useStore()
        let songDetailObj = reactive({})
        const handleCurrentChange = (newValue) => {
            console.log(newValue)
            if (newValue === 1) {
                songSheetObj.offset = (newValue * 0)
                songSheetObj.currentPage = newValue
                emit('change', songSheetObj.offset)
            } else {
                songSheetObj.offset = ((newValue - 1) * 10)
                songSheetObj.currentPage = newValue
                emit('change', songSheetObj.offset)
                if (songSheetObj.offset >= songSheetObj.total) {
                    songSheetObj.offset = songSheetObj.total
                }
            }
        }
        // 添加类名给字标红
        const tableRowClassName = (row) => {
            if (row.columnIndex === 2 && row.rowIndex === store.state.showOrHide.songDetail.rowsIndex) {
                // 给第2个td里面添加goodsInfo的类名
                // if(store.state.showOrHide.songData.)
                // 判断标红的内容与vuex的内容是否相等
                if (store.state.showOrHide.songData.length) {
                    if (songSheetObj.songs[0].name === store.state.showOrHide.songData[0].name) {
                        return 'goodsInfo'
                    }
                }
            }
        }
        // 获取表格的索引
        const dbClick = (rows) => {
            // 当我们点击列表以后获取的是当前列表无论怎么切换页面都不会有获取到其他的页面播放列表以及颜色标红
            // 1.把点击的接口数据保存到vuex中
            if (songSheetObj.songs.length) {
                store.commit('showOrHide/songlist', songSheetObj.songs)
            } else {
                store.commit('showOrHide/songlist', songSheetObj.songs)
            }
            // 获取歌曲id 和 index
            index.value = rows.songIndex
            console.log(rows, rows.songIndex)
            songDetailObj.picUrl = rows.al.picUrl
            songDetailObj.title = rows.ar[0].name
            songDetailObj.name = rows.name
            songDetailObj.id = rows.id
            songDetailObj.uid = rows.ar[0].id
            songDetailObj.rowsIndex = rows.songIndex
            store.commit('showOrHide/picUrl', songDetailObj)
            // audio.value.play()
            temp.value = true
            store.commit('showOrHide/discisShow', temp.value)
        }
        watch(() => props.songSheet, (newVal) => {
            songSheetObj.songs = newVal.songs
            songSheetObj.offset = newVal.offset
            songSheetObj.total = newVal.songCount
        }, { immediate: true, deep: true })
        return { songSheetObj, handleCurrentChange, dbClick, index, tableRowClassName }
    }
}
</script>
<style lang="less" scoped>
.iconBtn {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 10px 0 15px 0;

    .el-button {
        .buttom()
    }
}

.example-pagination-block {
    margin-left: 54%;
    height: 50px;
    transform: translateX(-50%);
    margin-top: 30px;

    .el-pagination {
        margin-top: 15px;
    }

    /deep/.el-pager li {
        outline: none;
    }

    /deep/ .el-pagination.is-background .el-pager li:not(.is-disabled).is-active {
        background-color: @priceColor;
    }

    /deep/.el-pagination.is-background .el-pager li:not(.is-disabled):hover {
        color: @priceColor ;
    }
}

.icon-shengyinkai {
    font-weight: 700;
    color: #bc3a3a;
    font-size: 20px;
}

/deep/.goodsInfo .cell {
    color: rgb(188, 58, 58);
    font-weight: 700;
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