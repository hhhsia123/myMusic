<template>
    <!-- <video src=""></video> -->
    <el-scrollbar height="534px" style="width: 1000px;" v-loading="loading" ref="offsetTop" @scroll="scroll"
        v-if="!(JSON.stringify(videoDetailObj)==='{}')">
        <div class="videoDetailContainer" v-if="!(videoUrls[0] === undefined)">
            <div class="detailVideo">
                <div style="display: flex;align-items: flex-end;;">
                    <el-icon size="20px">
                        <ArrowLeft />
                    </el-icon>
                    <h3 style="margin-top:21px;">视频详情</h3>
                </div>
                <video @click="videoPlayClick" class="videoUrl" width="500" height="340" controls>
                    <source :src="videoUrls[0].url" type="video/mp4">
                </video>
                <div class="videoDesc">
                    <div class="avator" v-if="videoDetailObj.data !== null">
                        <img class="pic" :src="videoDetailObj.data.avatarUrl" alt="">
                        <span>{{ videoDetailObj.data.creator.nickname }}</span>
                    </div>
                    <h2 class="title">{{ videoDetailObj.data.title }}</h2>
                    <div class="palyCount">
                        <span>发布: {{ videoDetailObj.data.publishTime }}</span>
                        <span>播放: {{ videoDetailObj.data.playTime }}</span>
                    </div>
                    <div v-if="!(videoDetailObj.data === null)">
                        <el-tag style="margin-right: 5px;" v-for=" (item, i) in videoDetailObj.data.videoGroup" :key="i"
                            type="info" class="mx-1" effect="light" round>
                            {{ item.name }}
                        </el-tag>
                    </div>
                    <div class="buttom">
                        <el-button round @click="star">
                            <el-icon :style="[tStar ? '' : 'color:red']">
                                <Star />
                            </el-icon>赞({{ videoDetailObj.data.praisedCount }})
                        </el-button>

                        <el-button v-if="iscollect" size="large" :icon="FolderAdd" round @click="like(id)">
                            <el-icon style="margin-right:5px ; font-size: 20px;" :style="[tLike ? '' : 'color:red']">
                                <FolderAdd />
                            </el-icon>收藏({{
                                    videoDetailObj.data.subscribeCount
                            }})
                        </el-button>
                        <el-button v-else size="large" :icon="FolderAdd" round @click="like(id)">
                            <el-icon style="margin-right:5px ; font-size: 20px;" :style="[tLike ? '' : 'color:red']">
                                <FolderAdd />
                            </el-icon>已收藏({{
                                    videoDetailObj.data.subscribeCount
                            }})
                        </el-button>

                        <el-button round>
                            <el-icon>
                                <Share />
                            </el-icon>分享({{ videoDetailObj.data.shareCount }})
                        </el-button>
                    </div>
                </div>
                <commentVideo ref="target" @scrtop="setTop"></commentVideo>
            </div>
            <!-- 相关视频推荐 -->
            <div class="relatedVideoContainer">
                <h3 style="margin:21px 0 0 15px;">相关视频</h3>
                <relatedVideo></relatedVideo>
            </div>
        </div>

        <div class="videoDetailContainer" v-if="!(JSON.stringify(MVDetailObj.data) === '{}')">
            <div class="detailVideo">
                <div style="display: flex;align-items: center;">
                    <el-icon size="20px">
                        <ArrowLeft />
                    </el-icon>
                    <h3 style="margin-top:21px ;margin-bottom: 15px;">MV详情</h3>
                </div>
                <video v-if="!(MVUrls === null)" class="videoUrl" width="500" height="340" controls>
                    <source :src="MVUrls" type="video/mp4">
                </video>
                <div class="videoDesc" v-if="!(MVDetailObj.data === null)">
                    <div class="avator">
                        <img class="pic" :src="MVDetailObj.data.cover" alt="">
                        <span>{{ MVDetailObj.data.artistName }}</span>
                    </div>
                    <h2 class="title">{{ MVDetailObj.data.name }}</h2>
                    <div class="palyCount">
                        <span>发布: {{ MVDetailObj.data.publishTime }}</span>
                        <span>播放: {{ MVDetailObj.data.playCount }}</span>
                    </div>
                    <div v-if="!(MVDetailObj.data === null)">
                        <el-tag style="margin-right: 5px;" v-for=" (item, i) in MVDetailObj.data.videoGroup" :key="i"
                            type="info" class="mx-1" effect="light" round>
                            {{ item.name }}
                        </el-tag>
                    </div>
                    <div class="buttom">
                        <el-button round @click="star">
                            <el-icon :style="[tStar ? '' : 'color:red']">
                                <Star />
                            </el-icon>赞({{ MVDetailObj.data.praisedCount }})
                        </el-button>
                        <el-button v-if="iscollect" size="large" :icon="FolderAdd" round @click="like(id)">
                            <el-icon style="margin-right:5px ; font-size: 20px;">
                                <FolderAdd />
                            </el-icon>收藏({{
                                    MVDetailObj.data.subCount
                            }})
                        </el-button>
                        <el-button v-else size="large" :icon="FolderAdd" round @click="like(id)">
                            <el-icon style="margin-right:5px ; font-size: 20px;">
                                <FolderAdd />
                            </el-icon>已收藏({{
                                    MVDetailObj.data.subCount
                            }})
                        </el-button>

                        <el-button round>
                            <el-icon>
                                <Share />
                            </el-icon>分享({{ MVDetailObj.data.shareCount }})
                        </el-button>
                    </div>
                </div>
                <commentVideo ref="target" @scrtop="setTop"></commentVideo>
            </div>
            <!-- 相关视频推荐 -->
            <div class="relatedVideoContainer">
                <h3 style="margin:21px 0 0 15px;">相关视频</h3>
                <relatedVideo></relatedVideo>
            </div>
        </div>

    </el-scrollbar>

</template>
<script>
import pubsub from 'pubsub-js'
import moment from 'moment'
import { MVdetail, mvUrl } from '../../api/MVapi'
import commentVideo from '../../components/asider/commentVideo.vue'
import relatedVideo from '../../components/asider/relatedVideo.vue'
import { ArrowLeft, Star, FolderAdd, Share } from '@element-plus/icons-vue'
import { $MsgErr, $MsgSucc, $MsgWarn } from '@/utils/Message'
import { videoDetailApi, videoUrl, starVideo, likeVideo } from '../../api/videoApi'
import { reactive, watch, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
export default {
    name: 'videoDetail',
    components: {
        ArrowLeft, Star, FolderAdd, Share, relatedVideo, commentVideo
    },
    setup() {
        const iscollect = ref(true)
        // 获取视频详情
        let videoDetailObj = reactive({
            data: null
        })
        const store = useStore()
        // 获取mv详情
        let MVDetailObj = reactive({
            data: null
        })
        const id = ref('')
        const tStar = ref(1)
        const tLike = ref(1)
        // 视频地址
        const videoUrls = ref([])
        // mv地址
        const MVUrls = ref(null)
        const target = ref(null)
        const offsetTop = ref(null)
        // 获取视频dom
        const videoPlayClick = () => {
            console.log('音频关闭')
            // 发布消息
            pubsub.publish('close', 'true')
        }
        // 视频给数组的time格式化
        const videoformat = (data) => {
            if (data) {
                return moment(data.publishTime).format('yyyy年M月DD日')
            }
        }
        // 获取视频详情
        const getVideoDetail = (vid) => {
            videoDetailApi(vid).then(res => {
                // console.log(res.data)
                if (res.data.code !== 200) {
                    return $MsgErr(res.data.message)
                }
                res.data.data.publishTime = videoformat(res.data.data)
                videoDetailObj.data = res.data.data
                MVDetailObj.data = {}
                console.log(videoDetailObj.data)
            })
        }
        // 给MV数组的time格式化
        const MVformat = (data) => {
            if (data) {
                return moment(data.publishTime).format('yyyy年M月DD日')
            }
        }
        // 获取mv详情
        const getMVdetail = (mvid) => {
            MVdetail(mvid).then(res => {
                if (res.data.code !== 200) {
                    $MsgErr(res.data.code)
                }
                res.data.data.publishTime = MVformat(res.data.data)
                MVDetailObj.data = res.data.data
                videoDetailObj.data = {}
                videoUrls.value = []
                console.log(videoDetailObj.data)
            })
        }
        // 点击收藏视频
        const star = () => {
            if (store.state.user.profile.cookie) {
                likeVideo(tStar.value, videoDetailObj.data.vid).then(res => {
                    if (res.data.code === 200) {
                        if (tStar.value === 1) {
                            $MsgSucc('取消点赞')
                        } else {
                            $MsgSucc('点赞成功')
                        }
                    }
                    if (res.data.code === 408) {
                        tStar.value = 0
                    }
                })
                if (tStar.value === 1) {
                    tStar.value = 0
                } else {
                    tStar.value = 1
                }
            } else {
                $MsgWarn('亲 需要登录才可以访问哦~')
            }
        }

        // 收藏视频
        const like = (id) => {
            if (store.state.user.profile.cookie) {
                if (iscollect.value) {
                    starVideo(1, id).then(res => {
                        console.log(res)
                        if (res.data.code === 200) {
                            $MsgSucc('收藏成功')
                            iscollect.value = !iscollect.value
                        } else {
                            $MsgErr('收藏失败')
                        }
                    }).catch(e => {
                        $MsgErr('已经收藏了')
                        iscollect.value = !iscollect.value
                    })
                } else {
                    starVideo(0, id).then(res => {
                        if (res.data.code === 200) {
                            $MsgSucc('取消成功')
                            iscollect.value = !iscollect.value
                        } else {
                            $MsgErr('收藏失败')
                        }
                    })
                }
            } else { $MsgWarn('亲 需要登录才可以访问哦~') }
        }
        // h获取MV地址
        const getMvUrl = (vid) => {
            MVUrls.value = null
            mvUrl(vid).then(res => {
                if (res.data.code !== 200) {
                    $MsgErr(res.data.message)
                }

                MVUrls.value = res.data.data.url
                // console.log(res.data.urls)
            })
        }
        // 获取视频地址
        const getVideoUrl = (vid) => {
            videoUrls.value = []
            videoUrl(vid).then(res => {
                if (res.data.code !== 200) {
                    $MsgErr(res.data.message)
                }
                videoUrls.value = res.data.urls
                console.log(res.data.urls)
            })
        }
        const route = useRoute()
        watch(() => route.params.id, (newValue) => {
            console.log(newValue)
            id.value = newValue
            // 匹配如果都是数字那么就是mv 不然就是视频
            let num = /^[0-9]*$/
            if (num.test(newValue)) {
                // 发mv接口
                getMVdetail(newValue)
                getMvUrl(newValue)
                console.log(newValue)
            } else {
                // 发视频接口
                if (route.path === `/videoPlay/videoDetail/${newValue}`) {
                    getVideoDetail(newValue)
                    getVideoUrl(newValue)
                }
            }
        }, { immediate: true })
        // 触发滚动事件
        const scroll = ({ scrollTop }) => {
            console.log(scrollTop)
            target.value.scrollComment(scrollTop)
        }
        // 设置高度
        const setTop = (topNum) => {
            console.log(topNum)
            offsetTop.value.setScrollTop(topNum)
        }
        return { videoDetailObj, videoUrls, star, id, videoPlayClick, iscollect, tStar, tLike, like, scroll, target, setTop, offsetTop, MVDetailObj, MVUrls }
    }
}
</script>
<style lang="less">
.videoDetailContainer {
    width: 900px;
    margin: 0 auto;
    display: flex;

    .detailVideo {
        .videoDesc {

            .buttom {
                margin-left: 10px;
                margin: 20px 0 20px 0;

                .el-button {
                    .buttom();

                    .el-icon {
                        margin-right: 3px;
                    }
                }
            }

            .avator {
                margin: 8px 0 15px 0;
                display: flex;
                align-items: center;

                .pic {
                    width: 60px;
                    height: 60px;
                    border-radius: 50%;
                    margin-right: 10px;
                    object-fit: cover;
                }
            }

            .palyCount {
                margin: 15px 0 15px 0;

                span {
                    margin-right: 20px;
                    color: #AAAAB2;
                }
            }
        }

        .videoUrl {
            margin-top: -8px;
            border-radius: 10px;

            &:focus {
                outline: -webkit-focus-ring-color auto 0px; //去除video获得焦点的边框
            }
        }
    }

    .relatedVideoContainer {
        width: 400px;
    }
}
</style>