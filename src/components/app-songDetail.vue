<template>

    <nav class="topDetail" infinite-scroll-delay="1000" v-infinite-scroll="load" infinite-scroll-distance="1"
        ref="target" @scroll="scrollTop">
        <img class="filter" :src="detail.coverImgUrl + '?param=220y220'" alt="" v-if="detail.coverImgUrl">
        <img class="filter" :src="albumObj.picUrl + '?param=220y220'" alt="" v-if="albumObj.picUrl">
        <img class="coverImgUrl" :src="detail.coverImgUrl + '?param=220y220'" alt="" v-if="detail.coverImgUrl">
        <img class="coverImgUrl" :src="albumObj.picUrl + '?param=220y220'" alt="" v-if="albumObj.picUrl">
        <div class="rightContainer" v-if="!(JSON.stringify(detail) === '{}')">
            <div class="title">
                <el-button plain size="small">歌单</el-button>
                <h2>{{ detail.name }}</h2>
            </div>
            <div class="creatTimer">
                <RouterLink :to="`/songDetail/userDetail/${detail.creator.userId}`">
                    <img class="avatar" :src="detail.creator.avatarUrl + '?param=220y220'" alt="">
                    <span class="nickNmae">{{ detail.creator.nickname }}</span>
                </RouterLink>
                <span>{{ detail.createTime }} 创建</span>
            </div>
            <el-row style="margin-top: 10px;">
                <el-button color="#EC4141" size="large" :icon="Search" round @click="clickAll(songData)">
                    <el-icon :size="30">
                        <CaretRight />
                    </el-icon> 播放全部 <el-icon :size="23" style="margin-left: 10px;">
                        <Plus />
                    </el-icon>
                </el-button>
                <el-button size="large" :icon="Search" round>
                    <el-icon style="margin-right: 10px;">
                        <Share />
                    </el-icon>分享({{ detail.shareCount }})
                </el-button>
                <el-button v-if="iscollect" size="large" :icon="FolderAdd" round @click="collect">
                    <el-icon style="margin-right:5px ; font-size: 20px;">
                        <FolderAdd />
                    </el-icon>收藏({{
                            detail.subscribedCount
                    }})
                </el-button>
                <el-button v-else size="large" :icon="FolderAdd" round @click="collect">
                    <el-icon style="margin-right:5px ; font-size: 20px;">
                        <FolderAdd />
                    </el-icon>已收藏({{
                            detail.subscribedCount
                    }})
                </el-button>
                <el-button size="large" :icon="Search" round>vip下载</el-button>
            </el-row>
            <div class="text">
                <p v-if="detail.tags"> <span>标签: </span> <span>{{ detail.tags }}</span></p>
                <p v-else> <span>标签: </span> <span>{{ detail.algTags }}</span></p>
                <p><span>歌曲: </span> <span>{{ detail.trackCount }}</span> <span>播放:</span>
                    <span>{{ detail.trackCount }}</span>
                </p>
                <p><span>简介: </span> <span class="desc">{{ detail.description }}</span></p>
            </div>

        </div>
        <!-- tap 切换栏 -->
        <el-tabs v-model="activeName" class="demo-tabs clearfix" @tab-click="handleClick">

            <el-tab-pane label="歌曲列表" name="first">
                <!-- 歌单列表 -->

                <el-table v-loading="loadingScoll" lazy element-loading-text="Loading..." :data="songData" stripe
                    @row-dblclick="dbClick" highlight-current-row :cell-class-name="tableRowClassName">
                    <el-table-column type="index" :index="indexMethod" width="60">
                        <template #default="scope">
                            <div class="image" v-if="scope.row.songIndex === $store.state.showOrHide.songDetail.rowsIndex &&
                            scope.row.name === $store.state.showOrHide.songData[scope.row.songIndex].name">
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
            </el-tab-pane>
            <!-- 评论组件 -->
            <el-tab-pane empty="加载中"
                :label="`歌曲评论(${detail.commentCount === undefined ? '加载中...' : detail.commentCount})`" name="second">
                <appComment :id="id" @clickTop="clickTop(true)"></appComment>
            </el-tab-pane>
            <!-- 收藏组件 -->
            <el-tab-pane label="收藏者" name="third">
                <colleCtion :id="id" ref="colleCtion"></colleCtion>
            </el-tab-pane>

        </el-tabs>

        <!-- 显示返回顶部 -->
        <div :class="{ 'showBackTop': showTop, 'close': !showTop }" @click="clickTop(true)">
            <i class="icon icon iconfont  icon-top"></i>
        </div>
    </nav>
</template>

<script >
import { clickAll } from '../utils/mixins'
import { CaretRight, Share, Plus, FolderAdd } from '@element-plus/icons-vue'
import { useStore } from 'vuex'
import colleCtion from './app-Collection.vue'
import appComment from './app-Comment.vue'
import { $MsgErr, $MsgSucc, $MsgWarn } from '../utils/Message'
import { watch, ref, reactive, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { songDetail, song, collectSongSheetApi } from '@/api/songDetail'
import moment from 'moment'
export default {
    mixins: [clickAll],
    name: 'songDefault',
    components: {
        appComment,
        colleCtion,
        CaretRight,
        Share,
        Plus,
        FolderAdd
    },
    setup(props) {
        const iscollect = ref(true)
        const loadingScoll = ref(false)
        const isAlbumComment = ref(false)
        const albumObj = ref({})
        const songsArr = ref([])
        const store = useStore()
        const activeName = ref('first')
        const route = useRoute()
        const detail = ref({})
        const songData = ref([])
        const id = ref(null)
        const target = ref(null)
        const showTop = ref(false)
        let timer = ref(null)
        const colleCtion = ref(null)
        const delay = ref(true)
        const index = ref(null)
        let temp = ref(false)
        let scrollBt = ref(null)
        let scrollBted = ref(null)
        let songDetailObj = reactive({})
        let songListObj = reactive({
            offset: 0,
            limit: 0,
            id: 0
        })
        const herfPath = ref('')
        // 是否显示遮罩层
        const isShowMask = ref(false)
        // 获取高度回到顶部
        const scrollTop = () => {
            // 保持是否滚到底部
            scrollBt.value = target.value.scrollTop
            // console.dir(target.value)
            if (target.value.scrollTop >= 300) {
                // console.dir(target.value.scrollTop)
                showTop.value = true
            } else {
                showTop.value = false
            }
        }
        onUnmounted(() => {
            console.log('销毁了')
        })

        // 无线滚动节流
        const load = () => {
            if (delay.value && activeName.value !== 'second' && activeName.value !== 'first') {
                delay.value = false
                isShowMask.value = true
                if (!isAlbumComment.value) {
                    setTimeout(() => {
                        target.value.scrollTop = target.value.scrollTop - 500
                        colleCtion.value.getCollection()

                        delay.value = true
                        isShowMask.value = false
                    }, 1200)
                }
            }
        }
        // 封装向上动画
        function animate() {
            clearInterval(timer.value)
            timer.value = setInterval(() => {
                if (target.value.scrollTop === 0) {
                    // console.log('111')
                    isShowMask.value = false
                    clearInterval(timer.value)
                    loadingScoll.value = false
                }
                target.value.scrollTop = target.value.scrollTop - 400
            }, 30)
        }
        // 收藏
        const collect = () => {
            if (store.state.user.profile.cookie) {
                if (iscollect.value) {
                    collectSongSheetApi(1, id.value).then(res => {
                        if (res.data.code === 200) {
                            $MsgSucc('歌单收藏成功')
                            iscollect.value = !iscollect.value
                        } else {
                            $MsgErr('收藏失败')
                        }
                    })
                } else {
                    collectSongSheetApi(0, id.value).then(res => {
                        if (res.data.code === 200) {
                            $MsgSucc('歌单取消成功')
                            iscollect.value = !iscollect.value
                        }
                    })
                }
            } else {
                $MsgWarn('亲 需要登录才可以访问哦~')
            }
        }
        // 向下的动画
        // function animateButtom() {
        //     clearInterval(timer.value)
        //     timer.value = setInterval(() => {
        //         if (target.value.scrollTop >= scrollBted.value) {
        //             // console.log('111')
        //             isShowMask.value = false
        //             clearInterval(timer.value)
        //         }
        //         target.value.scrollTop = target.value.scrollTop + 100
        //     }, 30)
        // }
        // 点击回到顶部做缓动画面
        const clickTop = (boolen) => {
            scrollBted.value = scrollBt.value
            isShowMask.value = boolen
            loadingScoll.value = true
            animate()
        }
        // 回到底部
        // const clickButtom = (boolen) => {
        //     isShowMask.value = boolen
        //     animateButtom()
        // }
        // 获取专辑内容
        const getsonglist = (songListObj) => {
            song(songListObj).then(res => {
                if (res.data.code !== 200) {
                    $MsgErr(res.data.code)
                    // console.log(res.data.code)
                }
                res.data.songs.forEach((item, i) => {
                    item.dt = moment(item.dt).format('mm:ss')
                    item.songIndex = i
                })
                // console.log(res.data.songs)
                songData.value = res.data.songs
                loadingScoll.value = false
            })
        }
        // 监听获取到歌单详情数据发接口
        watch(() => (route.params.id), (newValue) => {
            loadingScoll.value = true
            if (newValue && `/songDetail/${newValue}` === route.path) {
                // console.log(newValue)
                id.value = newValue
                songDetail(id.value).then(res => {
                    if (res.data.code !== 200) {
                        $MsgErr(res.data.code)
                    }
                    for (let k in res.data.playlist) {
                        if (k === 'createTime') {
                            res.data.playlist.createTime = moment(res.data.playlist[k]).format('yyyy年M月DD日')
                            console.log(res.data.playlist.createTime)
                        }
                    }
                    console.log(res.data.playlist.trackCount)
                    detail.value = res.data.playlist
                    songListObj.id = newValue
                    songListObj.limit = detail.value.trackCount
                    if (songListObj.limit >= 1000) {
                        songListObj.limit = 1000
                    }
                    getsonglist(songListObj)
                })
            }
        }, { immediate: true })
        // 添加类名给字标红
        const tableRowClassName = (row) => {
            if (row.columnIndex === 2 && row.rowIndex === store.state.showOrHide.songDetail.rowsIndex) {
                // 给第2个td里面添加goodsInfo的类名
                // if(store.state.showOrHide.songData.)
                // 判断标红的内容与vuex的内容是否相等
                if (store.state.showOrHide.songData.length) {
                    if (songData.value[0].name === store.state.showOrHide.songData[0].name) {
                        return 'goodsInfo'
                    }
                }
            }
        }
        // 获取表格的索引
        const dbClick = (rows) => {
            // 当我们点击列表以后获取的是当前列表无论怎么切换页面都不会有获取到其他的页面播放列表以及颜色标红
            // 1.把点击的接口数据保存到vuex中
            if (songData.value.length) {
                store.commit('showOrHide/songlist', songData.value)
            } else {
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
        return { detail, isAlbumComment, index, albumObj, collect, clickAll, iscollect, herfPath, songsArr, activeName, loadingScoll, songData, id, target, scrollTop, showTop, clickTop, isShowMask, colleCtion, load, dbClick, tableRowClassName }
    },
    beforeRouteEnter(to, from, next) {
        console.log(to, from)
        next((e) => {
            e.herfPath = from.href
            window.console.log(e.herfPath)
        })
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
    height: 535px;

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
        margin: 14px 0 10px 0px;
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
        right: 11%;
        top: 5%;
        width: 600px;
    }

    .title {
        display: flex;
        width: 500px;
        align-items: center;
        margin-bottom: 10px;

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
        .nickNmae {
            color: rgb(227, 226, 226);

            &:hover {
                color: #fff;
            }
        }

        .avatar {
            width: 30px;
            height: 30px;
            border-radius: 50%;
        }
    }

}
</style>