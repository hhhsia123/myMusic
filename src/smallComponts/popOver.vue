<template>
    <div style="display:  flex; align-items: center" ref="dcPopover" class="popover">
        <el-popover :visible="visible" placement="top" :width="400" trigger="click" :teleported="flase"
            :show-arrow="false" popper-class="elPopover">
            <template #reference>
                <i class=" iconfont  icon-24gl-playlistHeart2" @click="showClick"></i>
            </template>
            <div class="playContianer">
                <h2 style="color: #333333;">当前播放</h2>
                <div class="totalSong">
                    <span style="color: #CCCCCC; font-size: 13px;">总{{ $store.state.showOrHide.songData.length
                    }}首歌</span>
                    <span style="color: #507DAF; font-size: 15px;">清空列表</span>
                </div>
            </div>
            <!-- 歌单 -->
            <el-table :data="playData" stripe highlight-current-row v-if="playData[0] !== undefined"
                @row-dblclick="dbClick" :cell-class-name="tableRowClassName">
                <el-table-column type="index" prop="songIndex" :index="indexMethod" width="60">
                    <template #default="scope">
                        <div class="image" v-if="scope.row.songIndex === $store.state.showOrHide.songDetail.rowsIndex &&
                        scope.row.name === $store.state.showOrHide.songData[scope.row.songIndex].name">
                            <i class=" iconfont  icon-shengyinkai"></i>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column show-overflow-tooltip width="150" property="name" label="歌曲" />
                <el-table-column show-overflow-tooltip width="100" property="ar[0].name" label="歌手" />
                <el-table-column width="300" property="dt" label="时间" />
            </el-table>
            <!-- 专辑 歌手 -->
            <el-table :data="playData" stripe highlight-current-row v-else @row-dblclick="dbClick"
                :cell-class-name="tableRowClassName">
                <el-table-column type="index" prop="songIndex" :index="indexMethod" width="60">
                    <template #default="scope">
                        <div class="image" v-if="scope.row.songIndex === $store.state.showOrHide.songDetail.rowsIndex &&
                        scope.row.name === $store.state.showOrHide.songData[scope.row.songIndex].name">
                            <i class=" iconfont  icon-shengyinkai"></i>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column show-overflow-tooltip width="150" property="name" label="歌曲" />
                <el-table-column show-overflow-tooltip width="100" property="artists[0].name" label="歌手" />
                <el-table-column width="300" property="duration" label="时间" />
            </el-table>
        </el-popover>
    </div>
</template>
<script>
// import moment from 'moment'
import { $MsgWarn } from '@/utils/Message'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { ref, computed, reactive, watch } from 'vue'
export default {
    name: 'popOver',
    setup() {
        const visible = ref(false)
        const store = useStore()
        const dcPopover = ref(null)
        const data = ref([])
        const songDetailObj = reactive({})
        const index = ref('')
        const temp = ref(false)
        const route = useRoute()
        const showClick = () => {
            visible.value = !visible.value
            watch(() => route.params.id, () => {
                if (route.path === '/privacy/4') {
                    visible.value = false
                    $MsgWarn('暂时不支持一起听私人FM,正在解锁中')
                }
            }, { immediate: true })
        }

        let playData = computed(() => {
            let data = store.state.showOrHide.songData
            // data.forEach((item, i) => {
            //     item.dt = moment(item.dt).format('mm:ss')
            //     item.songIndex = i
            // })
            return data
        })
        data.value = playData
        console.log(playData.value)
        // 添加类名给字标红
        const tableRowClassName = (row) => {
            if (row.columnIndex === 1 && row.rowIndex === store.state.showOrHide.songDetail.rowsIndex) {
                // 给第2个td里面添加goodsInfo的类名
                // if(store.state.showOrHide.songData.)
                // 判断标红的内容与vuex的内容是否相等
                if (store.state.showOrHide.songData.length) {
                    if (playData.value[0].name === store.state.showOrHide.songData[0].name) {
                        return 'goodsInfo'
                    }
                }
            }
        }
        // 获取表格的索引
        const dbClick = (rows) => {
            // 当我们点击列表以后获取的是当前列表无论怎么切换页面都不会有获取到其他的页面播放列表以及颜色标红
            // 1.把点击的接口数据保存到vuex中
            if (playData.value[0].al !== undefined) {
                if (playData.value.length) {
                    store.commit('showOrHide/songlist', playData.value)
                } else {
                    store.commit('showOrHide/songlist', playData.value)
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
            } else {
                store.commit('showOrHide/songlist', playData.value)
                // 获取歌曲id 和 index
                index.value = rows.songIndex
                console.log(rows, rows.songIndex)
                songDetailObj.picUrl = rows.album.picUrl
                songDetailObj.title = rows.artists[0].name
                songDetailObj.name = rows.name
                songDetailObj.id = rows.id
                songDetailObj.uid = rows.artists[0].id
                songDetailObj.rowsIndex = rows.songIndex
                store.commit('showOrHide/picUrl', songDetailObj)
                // audio.value.play()
                temp.value = true
                store.commit('showOrHide/discisShow', temp.value)
            }
            // ========================================================================
            // 当我们点击列表以后获取的是当前列表无论怎么切换页面都不会有获取到其他的页面播放列表以及颜色标红
            // 1.把点击的接口数据保存到vuex中
        }
        return { dcPopover, showClick, playData, visible, dbClick, tableRowClassName }
    }
}

</script>
<style lang="less" scoped>
.iconfont {
    font-size: 23px;
    color: #333333;
    margin: 0 12px;
    border: none !important;

    &:hover {
        color: #EC4141;
        font-weight: 350;
    }
}

/deep/.goodsInfo .cell {
    color: rgb(188, 58, 58);
    font-weight: 700;
}

.icon-shengyinkai {
    font-weight: 700;
    color: #bc3a3a;
    font-size: 20px;
}

.el-table {
    height: 456px !important;
    --el-table-current-row-bg-color: #fcdfdf;
}

.playContianer {
    margin: 10px;

    .totalSong {
        margin-top: 10px;
        width: 100%;
        display: flex;
        justify-content: space-between;
    }
}

.popover {
    position: relative;

    .elPopover {
        position: absolute;
        top: 15px;
        left: 0;

    }
}
</style>