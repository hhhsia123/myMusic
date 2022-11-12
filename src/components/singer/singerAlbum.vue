<template>

    <div class="topContainer">
        <div class="topList" v-if="albumTextArr">
            <img class="coverImgUrl" src="https://www.codeman.ink/img/topSongsLogo.3c321631.png" alt="">
            <div class="column" v-if="topTen">
                <el-table :data="topTen" stripe style="width: 650px" :cell-class-name="cellStyke" lazy
                    :header-cell-style="headerStyle" highlight-current-row @row-dblclick="dbClick">
                    <el-table-column type="index" prop="songIndex" label="热门50首" :index="indexMethod" width="60">
                        <template #default="scope">
                            <div class="image" v-if="scope.row.songIndex === $store.state.showOrHide.songDetail.rowsIndex
                            && scope.row.name === $store.state.showOrHide.songData[scope.row.songIndex].name">
                                <i class=" iconfont  icon-shengyinkai"></i>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="name" width="450" />
                    <el-table-column prop="dt" width="100" />
                </el-table>
                <div style="margin-top: 10px;" @click="clickMore" v-if="isshowmore"><a class="more"
                        href="javascript:;">查看更多</a>
                </div>
            </div>
        </div>
        <!-- 循环列表 -->
        <div class="topList" v-for="(item, i) in albumTextArr" :key="i">
            <img class="coverImgUrl" :src="item.album.blurPicUrl + '?param=200y200'" alt="">
            <div class="column" v-if="item.songs">
                <el-table :data="item.songs" stripe style="width: 650px" lazy :header-cell-style="headerStyle"
                    :highlight-current-row="true">
                    <el-table-column :label="item.songs[0].al.name" type="index" width="50" />
                    <el-table-column prop="name" width="450" />
                    <el-table-column prop="dt" width="100" />
                </el-table>
                <RouterLink :to="`/albumDetail/${item.songs[0].al.id}`">
                    <span class="more">查看更多</span>
                </RouterLink>
            </div>
        </div>
    </div>
</template>
<script>
import { $MsgErr } from '../../utils/Message'
import { artistTop, artistAlbum, albumText } from '../../api/singerDetail'
import { ref, watch, reactive } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import moment from 'moment'
export default {
    name: 'singerAlbum',
    components: {

    },
    setup() {
        const store = useStore()
        const albumTextArr = ref([])
        const ArtistAlbumArr = ref([])
        const isshowmore = ref(true)
        const artistNum = ref([])
        const id = ref(null)
        const route = useRoute()
        const arrToplist = ref([])
        const loading = ref(false)
        const topTen = ref([])
        let songDetailObj = reactive({})
        const index = ref(null)
        const temp = ref(false)
        // 获取表格的索引
        const dbClick = (rows) => {
            // 当我们点击列表以后获取的是当前列表无论怎么切换页面都不会有获取到其他的页面播放列表以及颜色标红
            // 1.把点击的接口数据保存到vuex中
            if (artistNum.value.length) {
                store.commit('showOrHide/songlist', artistNum.value)
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
        // 获取排行接口
        // 给前3个索引标红
        const cellStyke = (row) => {
            // console.log(row)
            if (row.columnIndex === 1 && row.rowIndex === store.state.showOrHide.songDetail.rowsIndex) {
                // 给第2个td里面添加goodsInfo的类名
                // if(store.state.showOrHide.songData.)
                // 判断标红的内容与vuex的内容是否相等
                if (store.state.showOrHide.songData.length && artistNum.value.length) {
                    if (artistNum.value[0].name === store.state.showOrHide.songData[0].name) {
                        return 'goodsInfo'
                    }
                }
            }
            if (row.columnIndex === 0) {
                return 'goodsIndex'
            }
        }
        // 合并表头
        const headerStyle = ({ row, rowIndex }) => {
            // console.log(row, rowIndex)
            if (rowIndex === 0) { // 把第1行的第2、3列变为占两行高度的表格
                row[0].colSpan = 2
                return {
                    color: 'black'
                }
            }
        }
        // 获取歌单详情
        const getartistTop = (id) => {
            artistTop(id).then(res => {
                if (res.data.code !== 200) {
                    $MsgErr(res.data.code)
                }
                res.data.songs.forEach((item, i) => {
                    item.dt = moment(item.dt).format('mm:ss')
                    item.songIndex = i
                })
                artistNum.value = res.data.songs
                // console.log(artistNum.value)
                // 截取前10首歌后面的都在展开表格里面显示
                topTen.value = artistNum.value.slice(0, 10)
                // console.log(artistNum.value)
            })
        }
        // 获取歌手专辑
        const getArtistAlbum = (id) => {
            albumTextArr.value = []
            artistAlbum(id).then(res => {
                if (res.data.code !== 200) {
                    $MsgErr(res.data.code)
                }
                ArtistAlbumArr.value = res.data.hotAlbums
                // console.log(ArtistAlbumArr.value)
                // 便利获取到数组的id进行发请求
                for (let i = 0; i < ArtistAlbumArr.value.length; i++) {
                    let id = ArtistAlbumArr.value[i].id
                    albumText(id).then(res => {
                        if (res.data.code !== 200) {
                            $MsgErr(res.data.code)
                        }
                        albumTextArr.value.push(res.data)
                        // console.log(albumTextArr.value)
                        res.data.songs.forEach((item, i) => {
                            item.dt = moment(item.dt).format('mm:ss')
                            item.songIndex = i
                        })
                    })
                }
            })
        }
        // 点击查看更多
        const clickMore = () => {
            topTen.value = artistNum.value
            isshowmore.value = false
        }
        // 获取id
        watch(() => route.params.id, (newValue) => {
            // console.log(newValue)
            if (newValue && `/singerDetail/${newValue}` === route.path) {
                // console.log(newValue)
                id.value = newValue
                getartistTop(id.value)
                getArtistAlbum(id.value)
            }
        }, { immediate: true })
        return { loading, cellStyke, arrToplist, artistNum, headerStyle, index, topTen, clickMore, isshowmore, albumTextArr, dbClick }
    }

}
</script>
<style lang="less" scoped>
.icon-shengyinkai {
    font-weight: 700;
    color: #bc3a3a;
    font-size: 20px;
}

.topContainer {
    width: 950px;
    margin: 40px auto;

    // 深度监视
    /deep/.boxContain {
        /deep/ .box {
            margin: 10px 0 10px 0px;

        }

    }

    /deep/.goodsInfo .cell {
        color: rgb(188, 58, 58);
        font-weight: 700;
    }

    .topList {
        display: flex;
        justify-content: space-between;
        margin-bottom: 30px;

        .column {
            display: flex;
            flex-direction: column;
            margin-right: 20px;

            .more {
                margin-top: 10px;
                display: flex;

                &:hover {
                    color: #BC3A3A;
                }
            }

            .el-table {
                thead {
                    display: none;
                }

                /deep/.goodsIndex .cell {
                    color: rgb(188, 58, 58);
                    font-weight: 700;
                }

                --el-table-current-row-bg-color: #f5e4e4b0;
            }

        }

        .coverImgUrl {
            width: 180px;
            height: 180px;
            border-radius: 10px;
        }
    }
}
</style>