<template>
    <div class="dynamicContainer">
        <div class="commentList" v-if="eventMessge">
            <div class="hotCommentList" v-for="(item, i) in eventMessge" :key="i">
                <!-- 头像 -->
                <div class="commentCreatorAvatar clickUser">
                    <img class="pic" :src="item.user.avatarUrl" alt="">
                </div>
                <!-- 评论 -->
                <div class="commentMain">
                    <RouterLink :to="`/songDetail/userDetail/${item.user.userId}`"> <span
                            class="commentUserNickName clickUser">{{ item.user.nickname }}: </span></RouterLink>
                    <span class="Content">{{ item.type }} </span>
                    <div class="commentCreatedTime">{{ item.eventTime }}</div>
                    <div class="text">{{ item.json.msg }}</div>
                    <RouterLink :to="`/follow/topicRanking/${list.id}`" v-for="list in item.bottomActivityInfos"
                        :key="list">
                        <span class="bottomActivityInfos" style="cursor: pointer; color: #5A8AC9;">#{{ list.name
                        }}#
                        </span>
                    </RouterLink>
                    <!-- 回复 -->
                    <div class="replied" v-if="!(JSON.stringify(item.json.song) === '{}')">
                        <!-- 是否有发布单曲 -->
                        <div class="repliedItem"
                            v-if="!(item.json.song === undefined || item.json.song.album === undefined)"
                            @click="playSong(item.json.song)">
                            <div class="image">
                                <img class="pic" :src="item.json.song.album.picUrl + '?param=200y200'" alt="">

                                <div class="masks"></div>

                                <i class=" playButtom iconfont  icon-bofang-copy"></i>
                            </div>

                            <div class="title" v-if="!(item.json.song === undefined)">
                                <div class="name">{{ item.json.song.name }}</div>
                                <div class="singer">{{ item.json.song.album.artists[0].name }}</div>
                            </div>
                        </div>
                        <!-- 判断是否有歌单 -->
                        <div class="repliedItem"
                            v-if="!(item.json.playlist === undefined || item.json.playlist.creator === undefined)">
                            <img class="pic" :src="item.json.playlist.coverImgUrl + '?param=200y200'" alt="">

                            <RouterLink :to="`/songDetail/${item.json.playlist.id}`">
                                <div class="title" v-if="!(item.json.playlist === undefined)">
                                    <div class="name">{{ item.json.playlist.name }}</div>
                                    <div class="singer">by : {{ item.json.playlist.creator.nickname }}</div>
                                </div>
                            </RouterLink>
                        </div>
                        <!-- 是否是转发 -->
                        <div class="repliedItem" v-if="!(item.json.event === undefined)">
                            <div class="forwardCommentMain">
                                <span class="commentUserNickName clickUser">@{{ item.json.event.user.nickname }}:
                                </span>
                                <span class="Content">{{ item.json.event.type }} </span>
                                <div class="text">{{ item.json.event.json.msg }}</div>
                                <RouterLink :to="`/follow/topicRanking/${list.id}`"
                                    v-for="list in item.json.event.bottomActivityInfos" :key="list">
                                    <span class="bottomActivityInfos" style="cursor: pointer; color: #5A8AC9;">#{{
                                            list.name
                                    }}#
                                    </span>
                                </RouterLink>
                                <!-- 回复 -->
                                <div class="forwardreplied"
                                    v-if="!(JSON.stringify(item.json.event.json.song) === '{}')">
                                    <!-- 是否有发布单曲 -->
                                    <div class="repliedItem"
                                        v-if="!(item.json.event.json.song === undefined || item.json.event.json.song.album === undefined)"
                                        @click="playSong(item.json.event.json.song)">
                                        <div class="image">
                                            <img class="pic"
                                                :src="item.json.event.json.song.album.picUrl + '?param=200y200'" alt="">

                                            <div class="masks"></div>

                                            <i class=" playButtom iconfont  icon-bofang-copy"></i>
                                        </div>
                                        <div class="title" v-if="!(item.json.event.json.song === undefined)">
                                            <div class="name">{{ item.json.event.json.song.name }}</div>
                                            <div class="singer">{{ item.json.event.json.song.album.artists[0].name }}
                                            </div>
                                        </div>
                                    </div>
                                    <!-- 判断是否有歌单 -->
                                    <div class="repliedItem"
                                        v-if="!(item.json.event.json.playlist === undefined || item.json.event.json.playlist.creator === undefined)">
                                        <img class="pic" :src="item.json.playlist.coverImgUrl + '?param=200y200'"
                                            alt="">
                                        <RouterLink :to="`/songDetail/${item.json.event.json.playlist.id}`">
                                            <div class="title" v-if="!(item.json.event.json.playlist === undefined)">
                                                <div class="name">{{ item.json.event.json.playlist.name }}</div>
                                                <div class="singer">by : {{
                                                        item.json.event.json.playlist.creator.nickname
                                                }}</div>
                                            </div>
                                        </RouterLink>
                                    </div>
                                </div>
                                <!-- 是否有图片 -->
                                <div class="picUrl">
                                    <el-image style="max-width: 150px; " :src="list.originUrl"
                                        :preview-src-list="picUrl(item.json.event.pics)" :initial-index="0" fit="cover"
                                        v-for="(list, i) in item.json.event.pics" :key="i" />
                                </div>
                                <!-- 判断是否有视频 -->
                                <div class="videoUrl" v-if="!(item.json.event.json.mv === undefined)">
                                    <video v-if="!(MVUrls === null)" class="videoUrl" width="500" height="340" controls>
                                        <source :src="MVUrls" type="video/mp4">
                                    </video>
                                </div>
                                <!-- 评论底部 -->
                                <div class="commentBottom">
                                    <div class="commentIcons">
                                        <i class="icon iconfont  icon-dianzan"
                                            :class="{ 'red': dianznNum && i === dianzanIndex }"
                                            @click="clickDianzan(item.info.threadId, item.info.likedCount, i, 'hot')"><span
                                                style="color: #676767; font-size: 10px; margin-left: 5px; ">{{
                                                        getLikedCount(item.info.likedCount, i)
                                                }}</span></i>
                                        <i class="icon iconfont icon-fenxiang"> <span> {{ (item.info.shareCount)
                                        }}</span></i>
                                        <i class="icon iconfont icon-pinglun" @click="comment(item.info.threadId, i)">
                                            <span> {{
                                                    (item.info.commentCount)
                                            }}</span></i>

                                    </div>
                                </div>
                                <!-- 评论 -->
                                <div class="comment" v-if="showComment && i === index">
                                    <followComment :comment="dynamicComment" :dynamicId="threadId"
                                        @getDynamicComment="comment">
                                    </followComment>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- 是否有图片 -->
                    <div class="picUrl">
                        <el-image style="max-width: 150px; " :src="list.originUrl" :preview-src-list="picUrl(item.pics)"
                            :initial-index="0" fit="cover" v-for="(list, i) in item.pics" :key="i" />
                    </div>
                    <!-- 判断是否有视频 -->
                    <div class="videoUrl" v-if="!(item.json.mv === undefined)">
                        <video v-if="!(MVUrls === null)" class="videoUrl" width="500" height="340" controls>
                            <source :src="MVUrls" type="video/mp4">
                        </video>
                    </div>
                    <!-- 评论底部 -->
                    <div class="commentBottom">
                        <div class="commentIcons">
                            <i class="icon iconfont  icon-dianzan" :class="{ 'red': dianznNum && i === dianzanIndex }"
                                @click="clickDianzan(item.info.threadId, item.info.likedCount, i, 'hot')"><span
                                    style="color: #676767; font-size: 10px; margin-left: 5px; ">{{
                                            getLikedCount(item.info.likedCount, i)
                                    }}</span></i>
                            <i class="icon iconfont icon-fenxiang"> <span> {{ (item.info.shareCount) }}</span></i>
                            <i class="icon iconfont icon-pinglun" @click="comment(item.info.threadId, i)"> <span> {{
                                    (item.info.commentCount)
                            }}</span></i>

                        </div>
                    </div>
                    <!-- 评论 -->
                    <div class="comment" v-if="showComment && i === index">
                        <followComment :comment="dynamicComment" :dynamicId="threadId" @getDynamicComment="comment">
                        </followComment>
                    </div>
                </div>

            </div>
        </div>
    </div>
</template>
<script>
import moment from 'moment'
import { useStore } from 'vuex'
import { $MsgSucc } from '@/utils/Message'
import followComment from '../../components/follow/followComment.vue'
import { watch, ref, reactive } from 'vue'
import { eventComment } from '../../api/follow'
export default {
    name: 'dynamicList',
    components: {
        followComment
    },
    props: {
        eventMessge: {
            type: Array,
            defauly: () => []
        },
        MVUrls: {
            type: String
        }
    },
    setup(props) {
        const store = useStore()
        const songData = ref([])
        const threadId = ref('')
        const index = ref('')
        const showComment = ref(false)
        const dynamicComment = ref({})
        const dianzanIndex = ref(null)
        const dianznNum = ref(null)
        const arrIndex = ref([])
        const dianzanIndexArr = ref([])
        const hotDianzanIndexArr = ref([])
        const eventsArr = ref([])
        const temp = ref(false)
        let songDetailObj = reactive({})
        watch(() => props.eventMessge, (newValue) => {
            eventsArr.value = newValue
        }, { immediate: true })
        // 播放单曲
        const playSong = (song) => {
            song.duration = moment(song.duration).format('mm:ss')
            songData.value.push(song)
            if (songData.value.length) {
                store.commit('showOrHide/songlist', songData.value)
            }
            songData.value = []
            // 获取歌曲id 和 index
            index.value = 0

            songDetailObj.picUrl = song.album.picUrl
            songDetailObj.title = song.artists[0].name
            songDetailObj.name = song.name
            songDetailObj.id = song.id
            songDetailObj.uid = ''
            songDetailObj.rowsIndex = 0
            store.commit('showOrHide/picUrl', songDetailObj)
            // audio.value.play()
            temp.value = true
            store.commit('showOrHide/discisShow', temp.value)
        }
        const picUrl = (picArr) => {
            // 对图片进行改造
            return picArr.map(item => {
                return item.originUrl
            })
        }
        // 点击展示评论区
        const comment = (discussId, i) => {
            index.value = i
            threadId.value = discussId
            eventComment(discussId).then(res => {
                console.log(res.data)
                dynamicComment.value = res.data
                showComment.value = !showComment.value
            })
        }
        const getLikedCount = (likeCount, i) => {
            arrIndex.value.push(i)
            if (dianznNum.value === null) {
                return likeCount
            } else if (dianznNum.value) {
                // index = arrIndex.value.findIndex(item => {
                //     return item === dianzanIndex.value
                // })
                if (arrIndex.value[i] === dianzanIndex.value) {
                    return likeCount
                } else {
                    return likeCount
                }
            } else {
                if (arrIndex.value[i] === dianzanIndex.value) {
                    return likeCount
                } else {
                    return likeCount
                }
            }
        }
        // 点赞
        const getThumbsUp = (likedCount, hot) => {
            watch(dianzanIndex, (newValue) => {
                dianznNum.value = false
            })

            if (!dianznNum.value) {
                $MsgSucc('点赞成功')
                // 把索引存起来如果在点击就没反应
                dianznNum.value = true
                if (hot) {
                    if (dianzanIndexArr.value.findIndex((item) => item === dianzanIndex.value) === -1) {
                        eventsArr.value[dianzanIndex.value].info.likedCount = likedCount + 1
                    }
                    hotDianzanIndexArr.value.push(dianzanIndex.value)
                    getLikedCount(likedCount)
                }
            } else {
                if (hot) {
                    $MsgSucc('取消点赞成功')
                    eventsArr.value[dianzanIndex.value].info.likedCount = likedCount - 1
                    dianznNum.value = false
                    let filter = dianzanIndexArr.value.filter((item) => item !== dianzanIndex.value)
                    dianzanIndexArr.value = filter
                    // dianzanIndexArr.value.splice(index, 1)
                    getLikedCount(likedCount)
                }
            }
        }
        // 点赞
        const clickDianzan = (threadId, likedCount, index, hot) => {
            dianzanIndex.value = index
            getThumbsUp(likedCount, 'hot')
        }
        return { picUrl, comment, dynamicComment, playSong, showComment, index, threadId, clickDianzan, getLikedCount, dianznNum, dianzanIndex }
    }
}
</script>
<style lang="less" scoped>
.commentList {
    .example-pagination-block {
        display: flex;
        justify-content: center;
        margin-top: 15px;

        .el-pager li {
            outline: none;
        }

        .el-pagination.is-background .el-pager li:not(.is-disabled).is-active {
            background-color: @priceColor;
        }

        .el-pagination.is-background .el-pager li:not(.is-disabled):hover {
            color: @priceColor ;
        }
    }

    .hotCommentList {
        display: flex;
        border-bottom: 2px solid #eee;
        padding-bottom: 10px;
        margin-top: 15px;
        max-width: 630px;

        .commentCreatorAvatar {
            .pic {
                max-width: 40px;
                max-height: 40px;
                border-radius: 50%;
                flex: 1;
                margin-top: 10px;
            }

        }

        .commentMain {
            margin-left: 15px;
            line-height: 30px;
            width: 100%;

            .commentCreatedTime {
                color: #9F9F9F;
                font-size: 13px;
            }

            .Content {
                color: #989898;
            }

            .comment {
                background-color: #F3F3F4;
                display: flex;
                justify-content: center;

                /deep/.commentContainer {
                    margin: 20px 0 20px 0;
                }
            }

            .picUrl {
                margin-top: 15px;

                .el-image {
                    margin: 3px;
                    border-radius: 15px;
                }
            }

            .videoUrl {
                margin-top: -8px;

                &:focus {
                    outline: -webkit-focus-ring-color auto 0px; //去除video获得焦点的边框
                }
            }

            .replied {

                width: 100%;
                background-color: #F5F5F5;
                display: flex;
                align-items: center;
                margin-top: 10px;
                border-radius: 10px;

                .repliedItem {
                    margin-left: 10px;
                    display: flex;
                    align-items: center;
                    cursor: pointer;

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
                            top: 40%;
                            right: 20%;
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
                            top: 10px;
                            left: 0px;
                            width: 60px !important;
                            height: 60px;
                            background-color: rgba(0, 0, 0, 0.5);
                            border-radius: 10px;
                            opacity: 0;
                            transition: all 1s;
                        }
                    }

                    .pic {
                        margin: 10px 0 10px 0;
                        max-width: 60px;
                        max-height: 60px;
                        border-radius: 10px;
                    }

                    .title {
                        margin-left: 10px;

                        .singer {
                            color: #989898;
                            font-size: 10px;
                        }
                    }

                    .forwardCommentMain {
                        margin-left: 10px;

                        .Content {
                            color: #989898;
                        }

                        .forwardreplied {
                            margin: 10px 0 10px 0;
                            border-radius: 10px;
                            display: flex;
                            align-items: center;
                            background-color: #ffff;
                            width: 535px;

                            .pic {
                                margin: 10px 0 10px 0;
                                max-width: 60px;
                                max-height: 60px;
                                border-radius: 10px;
                            }

                            .title {
                                margin-left: 10px;

                                .singer {
                                    color: #989898;
                                    font-size: 10px;
                                }
                            }

                        }
                    }
                }
            }

            .commentBottom {
                display: flex;
                justify-content: flex-end;
                margin-top: 10px;

                .commentIcons {
                    display: flex;
                    width: 150px;
                    justify-content: space-around;

                    .iconfont {
                        &.red {
                            color: red;
                        }
                    }

                    span {
                        font-size: 10px;
                        margin-left: 5px;
                    }
                }
            }
        }
    }

}
</style>