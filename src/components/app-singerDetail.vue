<template>

    <nav class="topDetail" v-if="singerdetail" ref="target" @scroll="scrollTop">
        <img class="filter " :src="singerdetail.cover + '?param=200y200'" alt="">
        <img class="coverImgUrl" :src="singerdetail.cover + '?param=200y200'" alt="">
        <div class="rightContainer">
            <div class="title">
                <h2>{{ singerdetail.name }}</h2>
                <div>{{ singerdetail.transNames[0] }}</div>
            </div>
            <el-row>
                <el-button color="#EC4141" v-if="iscollect" size="large" :icon="FolderAdd" round @click="collect">
                    <el-icon style="margin-right:5px ; font-size: 20px;">
                        <FolderAdd />
                    </el-icon>收藏
                </el-button>
                <el-button color="#EC4141" v-else size="large" :icon="FolderAdd" round @click="collect">
                    <el-icon style="margin-right:5px ; font-size: 20px;">
                        <FolderAdd />
                    </el-icon>已收藏
                </el-button>

                <el-button size="large" :icon="Search" round>vip下载</el-button>
            </el-row>
            <div class="text">
                <p> <span>单曲数:</span> <span>{{ singerdetail.musicSize }}</span> <span>专辑数:</span>
                    <span>{{ singerdetail.albumSize }}</span><span>MV数:</span>
                    <span>{{ singerdetail.mvSize }}</span>
                </p>
                <p><span>简介: </span> <span class="desc">{{ singerdetail.briefDesc }}</span></p>
            </div>

        </div>
        <!-- tap 切换栏 -->
        <el-tabs v-model="activeName" class="demo-tabs clearfix" @tab-click="handleClick">

            <el-tab-pane label="专辑" name="first">
                <!-- 歌单列表 -->
                <singerAlbum></singerAlbum>

            </el-tab-pane>
            <!-- MV -->
            <el-tab-pane label="MV" name="second">
                <artistMv :id="id"></artistMv>
            </el-tab-pane>
            <!-- 相似歌手 -->
            <el-tab-pane label="相似歌手" name="third">
                <similarSinger :id="id"></similarSinger>
            </el-tab-pane>
            <!-- 歌手详情 -->
            <el-tab-pane label="歌手详情" name="four">
                <singerText :id="id"></singerText>
            </el-tab-pane>

        </el-tabs>
        <!-- 显示返回顶部 -->
        <!-- <div :class="{'showBackTop':showTop,'close':!showTop}" @click="clickTop(true)">
            <i class="icon icon iconfont  icon-top"></i>
        </div> -->
    </nav>

</template>

<script >
import artistMv from '../components/singer/singerMv.vue'
import similarSinger from '../components/singer/similarSinger.vue'
import singerText from '../components/singer/singerText.vue'
import { FolderAdd } from '@element-plus/icons-vue'
import { useStore } from 'vuex'
import colleCtion from './app-Collection.vue'
// import appComment from './app-Comment.vue'
import { $MsgErr, $MsgSucc, $MsgWarn } from '../utils/Message'
import { watch, ref, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { singerDetail, collectArtist } from '../api/singerDetail'
import singerAlbum from './singer/singerAlbum.vue'
// import moment from 'moment'
export default {
    name: 'singerDetail',
    components: {
        // appComment,
        // colleCtion
        FolderAdd,
        singerAlbum,
        singerText,
        similarSinger,
        artistMv
    },
    setup(props) {
        const store = useStore()
        const iscollect = ref(true)
        const activeName = ref('first')
        const route = useRoute()
        const singerdetail = ref('')
        // const songData = ref([])
        const id = ref(null)
        const isShowMask = ref(false)
        // 获取高度回到顶部
        const scrollTop = () => {
            // 保持是否滚到底部
            // scrollBt.value = target.value.scrollTop
            // console.dir(target.value)
            // if (target.value.scrollTop >= 300) {
            // console.dir(target.value.scrollTop)
            //         showTop.value = true
            //     } else {
            //         showTop.value = false
            //     }
        }
        onUnmounted(() => {
            console.log('销毁了')
        })

        // 监听获取到歌单详情数据发接口
        watch(() => route.params.id, (newValue) => {
            console.log(newValue)
            if (newValue && `/singerDetail/${newValue}` === route.path) {
                // console.log(newValue)
                id.value = newValue
                singerDetail(newValue).then(res => {
                    if (res.data.code !== 200) {
                        $MsgErr(res.data.code)
                    }
                    singerdetail.value = res.data.data.artist
                    console.log(singerdetail.value)
                })
                // getsonglist(songListObj)
            }
        }, { immediate: true })
        // 收藏歌手
        const collect = () => {
            if (store.state.user.profile.cookie) {
                if (iscollect.value) {
                    collectArtist(1, id.value).then(res => {
                        if (res.data.code === 200) {
                            iscollect.value = !iscollect.value
                            $MsgSucc('歌手收藏成功')
                        } else {
                            $MsgErr('收藏失败')
                        }
                    })
                } else {
                    collectArtist(0, id.value).then(res => {
                        if (res.data.code === 200) {
                            iscollect.value = !iscollect.value
                            $MsgSucc('歌手取消成功')
                        }
                    })
                }
            } else { $MsgWarn('亲 需要登录才可以访问哦~') }
        }
        // 添加类名给字标红
        const tableRowClassName = (row) => {
            // if (row.columnIndex === 2 && row.rowIndex === store.state.showOrHide.songDetail.rowsIndex) {
            //     // 给第2个td里面添加goodsInfo的类名
            //     // if(store.state.showOrHide.songData.)
            //     // 判断标红的内容与vuex的内容是否相等
            //     if (songData.value[0].name === store.state.showOrHide.songData[0].name) {
            //         return 'goodsInfo'
            //     }
            // }
        }
        // 获取表格的索引
        const dbClick = (rows) => {
            // 当我们点击列表以后获取的是当前列表无论怎么切换页面都不会有获取到其他的页面播放列表以及颜色标红
            // 1.把点击的接口数据保存到vuex中
            // store.commit('showOrHide/songlist', songData.value)
            // 获取歌曲id 和 index
            // index.value = rows.songIndex
            // console.log(rows, rows.songIndex)
            // songDetailObj.picUrl = rows.al.picUrl
            // songDetailObj.title = rows.al.name
            // songDetailObj.name = rows.name
            // songDetailObj.id = rows.id
            // songDetailObj.rowsIndex = rows.songIndex
            // store.commit('showOrHide/picUrl', songDetailObj)
            // audio.value.play()
            // temp.value = true
            // store.commit('showOrHide/discisShow', temp.value)
        }
        return { scrollTop, isShowMask, colleCtion, iscollect, collect, dbClick, tableRowClassName, singerdetail, activeName, id }
    }
}

</script>

<style lang="less" scoped>
/deep/.goodsInfo .cell {
    color: rgb(188, 58, 58);
    font-weight: 700;
}

/deep/.boxContain {
    .box {
        margin: 10px 0 10px 0px;

    }
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
    background-color: transparent;
}

.topDetail::-webkit-scrollbar {
    width: 12px;
    background-color: transparent;
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
    height: 533px;

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
        top: 50%;
        margin-left: 3%;
        color: #303133;
        width: 96%;

        .el-tab-pane {
            .el-table {
                /deep/.cell {
                    white-space: nowrap !important
                }

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

        // 去掉下边框
        /deep/ .el-tabs__nav-wrap {
            &::after {
                background-color: transparent;
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

    .text {
        margin: 19px 0 10px -10px;

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
        right: 22%;
        top: 5%;

        .title {
            display: flex;
            width: 500px;
            justify-content: center;
            margin-bottom: 15px;
            flex-direction: column;

            .el-button {
                color: @priceColor ;
                border: 1px solid @priceColor;
                margin-right: 8px;
            }

            h2 {
                .ellipsis();
                margin-bottom: 10px;
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