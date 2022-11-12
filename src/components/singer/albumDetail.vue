<template>

    <nav class="topDetail" ref="target" @scroll="scrollTop">
        <img class="filter" :src="detail.coverImgUrl + '?param=200y200'" alt="" v-if="detail.coverImgUrl">
        <img class="filter" :src="albumObj.picUrl + '?param=200y200'" alt="" v-if="albumObj.picUrl">
        <img class="coverImgUrl" :src="detail.coverImgUrl + '?param=200y200'" alt="" v-if="detail.coverImgUrl">
        <img class="coverImgUrl" :src="albumObj.picUrl + '?param=200y200'" alt="" v-if="albumObj.picUrl">
        <div v-if="!(JSON.stringify(albumObj) === '{}')" class="rightContainer">
            <div class="title" style="margin-bottom: 20px;">
                <el-button plain size="small">专辑</el-button>
                <h2>{{ albumObj.name }}</h2>
            </div>
            <el-row>
                <el-button color="#EC4141" size="large" :icon="Search" round @click="clickAll(songsArr)">
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
                <el-button v-if="iscollect" size="large" :icon="FolderAdd" round @click="collect">
                    <el-icon style="margin-right:5px ; font-size: 20px;">
                        <FolderAdd />
                    </el-icon>收藏
                </el-button>
                <el-button v-else size="large" :icon="FolderAdd" round @click="collect">
                    <el-icon style="margin-right:5px ; font-size: 20px;">
                        <FolderAdd />
                    </el-icon>已收藏
                </el-button>
            </el-row>
            <div class="text" style="margin-top: 20px;">
                <p> <span>歌手: </span> <span>{{ albumObj.artist.name }}</span></p>
                <p><span>创建: </span> <span class="desc">{{ albumObj.publishTime }}</span></p>
            </div>
        </div>
        <!-- tap 切换栏 -->

        <el-tabs v-model="activeName" class="demo-tabs clearfix" @tab-click="handleClick" v-if="songsArr.length">

            <el-tab-pane label="歌曲列表" name="first">
                <!-- 歌单列表 -->

                <el-table :data="songsArr" stripe @row-dblclick="dbClick" highlight-current-row
                    :cell-class-name="tableRowClassName">
                    <el-table-column type="index" prop="songIndex" :index="indexMethod" width="60">
                        <template #default="scope">
                            <div class="image"
                                v-if="scope.row.songIndex === $store.state.showOrHide.songDetail.rowsIndex && scope.row.name === $store.state.showOrHide.songData[scope.row.songIndex].name">
                                <i class=" iconfont icon-shengyinkai"></i>
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
            </el-tab-pane>
            <!-- 评论组件 -->
            <el-tab-pane
                :label="`歌曲评论(${albumObj.info.commentCount === undefined ? '加载中...' : albumObj.info.commentCount})`"
                name="second">
                <appComment :id="id" :isAlbumComment=isAlbumComment @clickTop="clickTop(true)"></appComment>
            </el-tab-pane>
            <!-- 收藏组件 -->
            <el-tab-pane label="专辑详情" name="third">
                <ablumDec :id="id"></ablumDec>
            </el-tab-pane>

        </el-tabs>
        <!-- 显示返回顶部 -->
        <div :class="{ 'showBackTop': showTop, 'close': !showTop }" @click="clickTop(true)">
            <i class="icon icon iconfont  icon-top"></i>
        </div>
    </nav>
</template>

<script >
import { clickAll } from '../../utils/mixins'
import { CaretRight, Share, Plus, FolderAdd } from '@element-plus/icons-vue'
import ablumDec from '../../components/singer/ablumDec.vue'
import { albumText, collectAlbum } from '../../api/singerDetail'
import { useStore } from 'vuex'
import appComment from '../app-Comment.vue'
import { $MsgErr, $MsgSucc, $MsgWarn } from '@/utils/Message'
import { watch, ref, reactive, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import moment from 'moment'
export default {
    mixins: [clickAll],
    name: 'albumDetail',
    components: {
        appComment,
        ablumDec,
        CaretRight,
        Share,
        Plus,
        FolderAdd
    },
    setup(props) {
        const iscollect = ref(true)
        const timer = ref(null)
        const isAlbumComment = ref(true)
        const albumObj = ref({})
        const songsArr = ref([])
        const store = useStore()
        const activeName = ref('first')
        const route = useRoute()
        const detail = ref({})
        const id = ref(null)
        const target = ref(null)
        const showTop = ref(false)

        const colleCtion = ref(null)

        const index = ref(null)
        let temp = ref(false)

        let songDetailObj = reactive({})
        const herfPath = ref('')
        // 是否显示遮罩层
        const isShowMask = ref(false)
        // 获取高度回到顶部
        const scrollTop = () => {
            console.dir(target.value)
            console.dir(target.value.scrollTop)
            if (target.value.scrollTop >= 300) {
                console.dir(target.value.scrollTop)
                showTop.value = true
            } else {
                showTop.value = false
            }
        }
        const collect = () => {
            if (store.state.user.profile.cookie) {
                if (iscollect.value) {
                    collectAlbum(1).then(res => {
                        if (res.data.code === 200) {
                            $MsgSucc('专辑收藏成功')
                            iscollect.value = !iscollect.value
                        } else {
                            $MsgErr('收藏失败')
                        }
                    })
                } else {
                    collectAlbum(0).then(res => {
                        if (res.data.code === 200) {
                            $MsgSucc('专辑取消成功')
                            iscollect.value = !iscollect.value
                        }
                    })
                }
            } else {
                $MsgWarn('亲 需要登录才可以访问哦~')
            }
        }
        onUnmounted(() => {
            console.log('销毁了')
        })
        // 获取专辑内容
        const getAlbumText = (id) => {
            albumText(id).then(res => {
                if (res.data.code !== 200) {
                    $MsgErr(res.data.message)
                }
                console.log(res.data.album)
                for (let k in res.data.album) {
                    if (k === 'publishTime') {
                        res.data.album.publishTime = moment(res.data.album[k]).format('yyyy年M月DD日')
                    }
                }
                albumObj.value = res.data.album
                res.data.songs.forEach((item, i) => {
                    item.dt = moment(item.dt).format('mm:ss')
                    item.songIndex = i
                })
                songsArr.value = res.data.songs
            })
        }
        // 获取上下一首歌
        // 监听获取到歌单详情数据发接口
        watch(() => (route.params.id), (newValue) => {
            if (newValue && `/albumDetail/${newValue}` === route.path) {
                // console.log(newValue)
                id.value = newValue
                getAlbumText(id.value)
            }
        }, { immediate: true })
        // 添加类名给字标红
        const tableRowClassName = (row) => {
            if (row.columnIndex === 2 && row.rowIndex === store.state.showOrHide.songDetail.rowsIndex) {
                // 给第2个td里面添加goodsInfo的类名
                // if(store.state.showOrHide.songData.)
                // 判断标红的内容与vuex的内容是否相等

                if (store.state.showOrHide.songData.length) {
                    if (songsArr.value[0].name === store.state.showOrHide.songData[0].name) {
                        return 'goodsInfo'
                    }
                }
            }
        }
        // 获取表格的索引
        const dbClick = (rows) => {
            // 当我们点击列表以后获取的是当前列表无论怎么切换页面都不会有获取到其他的页面播放列表以及颜色标红
            // 1.把点击的接口数据保存到vuex中
            if (songsArr.value.length) {
                store.commit('showOrHide/songlist', songsArr.value)
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
        // 封装向上动画
        function animate() {
            clearInterval(timer.value)
            timer.value = setInterval(() => {
                if (target.value.scrollTop === 0) {
                    // console.log('111')
                    isShowMask.value = false
                    clearInterval(timer.value)
                }
                target.value.scrollTop = target.value.scrollTop - 200
            }, 30)
        }
        const clickTop = (boolen) => {
            isShowMask.value = boolen
            animate()
        }
        return { detail, isAlbumComment, clickTop, index, iscollect, clickAll, collect, albumObj, herfPath, songsArr, activeName, id, target, scrollTop, showTop, isShowMask, colleCtion, dbClick, tableRowClassName }
    }
    // beforeRouteEnter(to, from, next) {
    //     console.log(to, from)
    //     next((e) => {
    //         e.herfPath = from.href
    //         window.console.log(e.herfPath)
    //     })
    // }
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

.ellipsis() {
    /* 多行文本溢出隐藏，省略号代替 */
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    /* 设置对齐模式 */
    -webkit-box-orient: vertical;
    /* 设置盒子的行数 */
    -webkit-line-clamp: 1;
    white-space: nowrap;
    overflow: hidden;
}

.topDetail::-webkit-scrollbar-track {
    border-radius: 60px;
    background-color: #fff;
}

.topDetail::-webkit-scrollbar {
    width: 12px;
    background-color: #fff;
}

.topDetail::-webkit-scrollbar-thumb {
    border-radius: 60px;
    width: 5px;
    box-shadow: inset 0 0 6px rgba(0, 0, 0, .1);
    background-color: #DEDFE1;
}

.loading {
    max-width: 80px;
    max-height: 80px;
    position: absolute;
    top: 70%;
    left: 50%;
    z-index: 99999999;
}

.topDetail {
    width: 100%;
    display: flex;
    position: relative;
    box-sizing: border-box;
    overflow: auto;
    height: 534px;

    .showBackTop {
        top: 70%;
        left: 80%;
        .isshowTop();
        animation: BackTop 2s linear alternate;

    }

    .close {
        top: 80%;
        left: 74%;
        transition: all 2s;
        .isshowTop();
        opacity: 0;
    }

    @keyframes BackTop {

        0% {
            top: 80%;
            opacity: 0;
        }

        40% {
            top: 67%;
        }

        70% {
            top: 73%;
            opacity: 1;
        }

        100% {
            top: 70%;

        }
    }

    .el-tabs {
        position: absolute;
        top: 55%;
        margin-left: 3%;
        color: #303133;
        width: 96%;

        .el-tab-pane {
            .el-table {
                /deep/.cell {
                    white-space: nowrap !important
                }

                --el-table-current-row-bg-color: #f5e4e4b0;

                // 去掉下边框

            }

        }

        /deep/.el-tabs__item.is-active {
            color: @priceColor !important;
            font-weight: 700;
            font-size: 20px;
        }

        /deep/.el-tabs__active-bar {
            background-color: @priceColor ;
        }

        /deep/ .el-tabs__nav-wrap {
            &::after {
                background-color: transparent !important;
            }
        }

        /deep/.el-tabs__item:hover {
            color: #303133;
        }

    }

    .filter {
        position: absolute;
        top: 0;
        right: 0;
        height: 250px;
        width: 100%;
        filter: blur(40px);
        object-fit: cover;
    }

    .coverImgUrl {
        max-height: 220px;
        max-width: 220px;
        border-radius: 10px;
        position: absolute;
        left: 3%;
        top: 5%;
    }

    .creatTimer {
        margin: 0 0 10px 0px;

        span {

            color: #fff;
            margin: 5px 10px 0;
            font-size: 10px;
        }
    }

    .text {
        margin: 30px 0 10px 0px;
        line-height: 24px;

        p {
            display: flex;
            margin: 10px 10px 0;

            span {
                color: #f1f1f1c9;
                margin-right: 5px;

            }

            .desc {
                display: inline;
                width: 400px;
                .ellipsis();
            }

        }
    }

    .rightContainer {

        position: absolute;
        right: 18%;
        top: 5%;
        width: 560px;

        .title {
            display: flex;
            width: 500px;
            align-items: center;
            margin-bottom: 15px;

            .el-button {
                color: @priceColor ;
                border: 1px solid @priceColor;
                margin-right: 8px;

                &:hover {
                    color: #fff;
                }
            }

            h2 {
                .ellipsis();
            }
        }

        .creatTimer {
            .avatar {
                width: 30px;
                height: 30px;
                border-radius: 50%;
            }
        }

    }

}

.el-button {
    .buttom()
}
</style>