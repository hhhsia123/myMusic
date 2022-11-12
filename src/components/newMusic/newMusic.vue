<template>
    <el-scrollbar height="465px" ref="scollTop" @scroll="scroll">
        <div class="newMusicContainer">

            <div class='switchContianer'>
                <div class="border">
                    <div class="active" :style="{ transform: `translateX(${swtichindex * -140}px)` }"></div>
                    <div class='newSong' @click="clickSwicth(0)" :style="{ color: (isWhite ? 'white' : 'black') }">新歌速递
                    </div>
                    <div class="newDisc" @click="clickSwicth(-1)" :style="{ color: (!isWhite ? 'white' : 'black') }">
                        新碟上架</div>
                </div>
            </div>
            <!-- 导航栏 -->
            <div class="tapNav">
                <div class="areaContainer">
                    <div class="area" :class="{ 'active': (!isWhite ? i === indexArea : i === indexTopExpress) }"
                        @click="clickarea(i, item.area, item.areaNum)" v-for="(item, i) in areaMousic" :key="i">
                        {{ item.uname }}</div>
                </div>
                <div class="typeContainer" v-if="!isWhite">
                    <div class="all " :class="{ 'typeActive': isShow }" @click="clickSwitch">全部</div>
                    <div class="recommend" :class="{ 'typeActive': !isShow }" @click="clickSwitch">推荐</div>
                </div>
            </div>
            <div v-loading="loading" custom-class="load" element-loading-text="Loading..."></div>
            <!-- 新碟上架 -->
            <div class="newDiscContainer" v-if="finished && !isWhite">

                <div class="Affix" ref="target"
                    :style="{ position: (fixeds === true ? 'fixed' : 'absolute'), top: (fixeds === true ? '200' + 'px' : '') }">
                    <img class="pic" src="../../assets/imagges/本周新碟.png" alt="">
                </div>

                <albumBox :AlbumData="weekData"></albumBox>
            </div>
            <!-- 新歌速递 -->
            <div class="newSongExpressContainer" v-show="NewSongfinished && isWhite">
                <el-table :data="ExpressArr" stripe style="width: 100%" highlight-current-row @row-dblclick="dbClick"
                    :cell-class-name="tableRowClassName">
                    <el-table-column type="index" prop="songIndex" :index="indexMethod" width="60">
                        <template #default="scope">
                            <div class="image" v-if="scope.row.songIndex === $store.state.showOrHide.songDetail.rowsIndex &&
                            scope.row.name === $store.state.showOrHide.songData[scope.row.songIndex].name">
                                <i class=" iconfont  icon-shengyinkai"></i>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="album.blurPicUrl" width="100">
                        <template #default="scope">
                            <div class="image">
                                <img class="picUrl " :src="scope.row?.album.blurPicUrl + '?param=100y100'" alt="">

                                <div class="masks"></div>

                                <i class=" playButtom iconfont  icon-bofang-copy"></i>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="album" width="260">
                        <template #default="scope">
                            <div class="11">
                                <span>{{ scope.row.album.name }}</span>
                                <span v-if="scope.row.album.alias.length">{{ '(' + scope.row.album.alias[0] + ')'
                                }}</span>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="artists[0].name" width="130" />
                    <el-table-column prop="album.name" width="230" />
                    <el-table-column prop="duration" width="130" />
                </el-table>
            </div>
            <div v-loading="NewSongloading" custom-class="load" element-loading-text="Loading..."></div>
        </div>
    </el-scrollbar>

</template>
<script>
import moment from 'moment'
import { $MsgErr } from '../../utils/Message'
import albumBox from '../../smallComponts/AlbumBox.vue'
import { areaMousic } from '../../api/constant'
import { topAlbum, topExpress } from '../../api/newMusic'
import { onMounted, ref, reactive } from 'vue'
import { useStore } from 'vuex'
export default {
    name: 'newMusic',
    components: {
        albumBox
    },
    setup() {
        const NewSongfinished = ref(true)
        const NewSongloading = ref(false)
        let temp = ref(false)
        let songDetailObj = reactive({})
        const loading = ref(false)
        const finished = ref(true)
        const fixeds = ref(false)
        const scollTop = ref(null)
        const target = ref(null)
        const weekData = ref([])
        const isShow = ref(true)
        const isWhite = ref(false)
        const swtichindex = ref(-1)
        const index = ref('')
        const indexArea = ref(0)
        const area = ref('')
        const ExpressArr = ref([])
        const store = useStore()
        const indexTopExpress = ref(0)
        const AreaNum = ref(0)
        // 吸顶
        const scroll = ({ scrollTop }) => {
            // console.log([target], [scollTop])
            if (scrollTop >= 140) {
                fixeds.value = true
            } else {
                fixeds.value = false
            }
        }
        const handleEdit = (scope) => {
            console.log(scope)
        }
        // 点击切换类型
        const clickSwitch = () => {
            isShow.value = !isShow.value
            if (isShow.value) {
                getTopAlbum(area.value, 'hot')
            } else {
                getTopAlbum(area.value)
            }
        }
        // 点击切换地区
        const clickSwicth = (i) => {
            if (i === swtichindex.value) {
                return false
            }
            if (i === 0) {
                loading.value = false
                getTopExpress(AreaNum.value)
            } else {
                getTopAlbum(area.value)
            }
            swtichindex.value = i
            isWhite.value = !isWhite.value
        }
        // 获取新碟上架接口
        const getTopAlbum = (area, type = 'new') => {
            finished.value = false
            loading.value = true

            topAlbum(area, type).then(res => {
                if (res.data.code !== 200) {
                    $MsgErr(res.data.code)
                }
                console.log(res.data.weekData)
                // 先固定写死50条数据
                if (area === 'All' || area === '') {
                    weekData.value = res.data.weekData.slice(0, 100)
                } else {
                    weekData.value = res.data.monthData.slice(0, 100)
                }

                finished.value = true
                loading.value = false
            })
        }

        const getTopExpress = (areaNum) => {
            NewSongfinished.value = false
            NewSongloading.value = true

            topExpress(areaNum).then(res => {
                if (res.data.code !== 200) {
                    $MsgErr(res.data.code)
                }
                console.log(res.data.data)
                res.data.data.forEach((item, i) => {
                    item.duration = moment(item.duration).format('mm:ss')
                    item.songIndex = i
                })
                ExpressArr.value = res.data.data
                NewSongfinished.value = true
                NewSongloading.value = false
            })
            console.log('111')
        }
        // 点击切换页面
        const clickarea = (i, Area, areaNum) => {
            // 点击切换区域
            // 用swtichindex来判断到底是以谁请求数据
            if (swtichindex.value === -1) {
                indexArea.value = i
                area.value = Area
                getTopAlbum(area.value)
            } else {
                indexTopExpress.value = i
                AreaNum.value = areaNum
                getTopExpress(AreaNum.value)
            }
        }
        // 添加类名给字标红
        const tableRowClassName = (row) => {
            if (row.columnIndex === 2 && row.rowIndex === store.state.showOrHide.songDetail.rowsIndex) {
                // 给第2个td里面添加goodsInfo的类名
                // if(store.state.showOrHide.songData.)
                // 判断标红的内容与vuex的内容是否相等
                if (store.state.showOrHide.songData.length) {
                    if (ExpressArr.value[0].name === store.state.showOrHide.songData[0].name) {
                        return 'goodsInfo'
                    }
                }
            }
        }
        // 获取表格的索引
        const dbClick = (rows) => {
            // 当我们点击列表以后获取的是当前列表无论怎么切换页面都不会有获取到其他的页面播放列表以及颜色标红
            // 1.把点击的接口数据保存到vuex中
            store.commit('showOrHide/songlist', ExpressArr.value)
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
        onMounted(() => {
            getTopAlbum('All')
        })
        return { NewSongloading, NewSongfinished, finished, index, indexTopExpress, swtichindex, dbClick, tableRowClassName, ExpressArr, handleEdit, loading, clickSwicth, isWhite, areaMousic, indexArea, clickarea, isShow, clickSwitch, weekData, target, scollTop, scroll, fixeds }
    }

}
</script>
<style lang="less" scoped>
.center() {
    width: 60px;
    height: 30px;
    line-height: 30px;
    color: #676767;
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

/deep/.el-loading-parent--relative {
    top: 100px;
    --el-color-primary: #ff1414;
}

.newSongExpressContainer {
    .image {
        position: relative;

        &:hover {
            .masks {
                opacity: 1;
            }

            .playButtom {
                opacity: 1;
            }
        }

        .picUrl {
            max-width: 70px;
            max-height: 70px;
            border-radius: 10px;
        }

        .playButtom {
            color: @priceColor;
            position: absolute;
            top: 46%;
            right: 30%;
            transform: translateX(20%);
            transform: translateY(-25%);
            opacity: 0;
            font-size: 35px;
            transition: all 2s;
            z-index: 9999;
        }

        .masks {
            display: block;
            position: absolute;
            top: 0px;
            left: 0px;
            width: 70px !important;
            height: 70px;
            background-color: rgba(0, 0, 0, 0.5);
            border-radius: 10px;
            opacity: 0;
            transition: all 1s;
        }
    }
}

.newMusicContainer {
    width: 900px;
    height: 500px;
    margin: 0 auto;
    position: relative;

    .newDiscContainer {
        display: flex;

        .pic {
            max-width: 60px;
            max-height: 60px;
        }

        .Affix {
            position: absolute;
            cursor: pointer;

            &:hover {
                color: @priceColor ;
            }
        }
    }

    .tapNav {
        display: flex;
        justify-content: space-between;
        margin-top: 25px;
        align-items: center;

        .areaContainer {
            display: flex;
            align-items: center;
            height: 30px;

            .area {
                margin-right: 20px;
                color: #676767;
                cursor: pointer;

                &:hover {
                    color: @priceColor ;
                }

                &.active {
                    font-weight: 700;
                    color: #373737;
                    font-size: 17px;
                }
            }
        }

        .typeContainer {
            display: flex;
            text-align: center;

            .all {
                margin-right: 15px;
                .center();
                cursor: pointer;

                &:hover {
                    color: @priceColor ;
                }
            }

            .recommend {
                .center();
                cursor: pointer;

                &:hover {
                    color: @priceColor ;
                }
            }

            .typeActive {
                .center();
                color: @priceColor ;
                background-color: #FEF5F5;
                border-radius: 30px;
            }
        }
    }

    .switchContianer {
        width: 900px;
        height: 50px;
        display: flex;
        justify-content: center;

        .border {
            margin-top: 10px;
            width: 280px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-radius: 30px;
            border: 2px solid #eee;
            text-align: center;
            position: relative;

            .newSong {
                text-align: center;
                width: 140px;
                height: 100%;
                line-height: 35px;
                position: absolute;
            }

            .active {
                background-color: @priceColor ;
                color: #fff;
                border-radius: 30px;
                transition: all 1s;
                width: 140px;
                height: 100%;
            }

            .newDisc {
                position: absolute;
                left: 50%;
                width: 140px;
                height: 100%;
                line-height: 35px;
            }
        }
    }
}
</style>