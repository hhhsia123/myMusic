<template>
    <div class="commentContainer">
        <el-input v-model="textarea" maxlength="150" placeholder="请留下您的评论！" show-word-limit type="textarea" />
        <div class="float  ">
            <el-popover :visible="isShow" popper-class="dialogEmoji" placement="top" title="表情" :width="200"
                trigger="click">
                <template #reference>
                    <i class="icon iconfont  icon-xiaolian" @click="clickShow"> </i>
                </template>
                <emoJi @emoJival="getEmoji"></emoJi>
            </el-popover>
            <el-button round @click="commentClick">评论</el-button>
        </div>
        <h3 v-if="hotCommentList">精彩评论</h3>
        <!-- 热评 -->
        <div class="commentList" v-if="hotCommentList">
            <div class="hotCommentList" v-for="(item, i) in hotCommentList" :key="i">
                <!-- 头像 -->
                <div class="commentCreatorAvatar clickUser">
                    <img class="pic" :src="item.user.avatarUrl" alt="">
                </div>
                <!-- 评论 -->
                <div class="commentMain">
                    <RouterLink :to="`/songDetail/userDetail/${item.user.userId}`"> <span
                            class="commentUserNickName clickUser">{{ item.user.nickname }}: </span></RouterLink>
                    <span class="Content">{{ item.content }}
                    </span>
                    <!-- 回复 -->
                    <div class="replied">
                        <div class="repliedItem" v-if="item.beReplied.length">
                            <RouterLink :to="`/songDetail/userDetail/${item.beReplied[0].user.userId}`">
                                <span class="repliedUser clickUser">@{{ item.beReplied[0].user.nickname }}: </span>
                            </RouterLink>
                            <span class="repliedContent">{{ item.beReplied.content }}
                            </span>
                        </div>
                    </div>
                    <!-- 评论底部 -->
                    <div class="commentBottom">
                        <div class="commentCreatedTime">{{ item.time }}</div>
                        <div class="commentIcons">
                            <i class="icon iconfont  icon-dianzan" :class="{ 'red': dianznNum && i === dianzanIndex }"
                                @click="clickDianzan(item.commentId, item.likedCount, i, 'hot')"><span
                                    style="color: #676767; font-size: 10px; margin-left: 5px; ">{{
                                            getLikedCount(item.likedCount, i)
                                    }}</span></i>
                            <i class="icon iconfont icon-fenxiang"></i>
                            <i class="icon iconfont icon-pinglun" style="cursor: pointer;"
                                @click="repliedClick(item.commentId, item.user.nickname, i)"></i>

                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="moreComment" v-if="hotCommentList">
            <el-button round>更多评论</el-button>
        </div>
        <h3>最新评论({{ total }})</h3>
        <!-- 普通评论 -->
        <div class="commentList" v-if="comments">
            <div class="hotCommentList" v-for="(item, i) in comments" :key="i">
                <!-- 头像 -->
                <div class="commentCreatorAvatar clickUser">
                    <img class="pic" :src="item.user.avatarUrl" alt="">
                </div>
                <!-- 评论 -->
                <div class="commentMain">
                    <RouterLink :to="`/songDetail/userDetail/${item.user.userId}`"> <span
                            class="commentUserNickName clickUser">{{ item.user.nickname }}: </span></RouterLink>
                    <span class="Content">{{ item.content }}
                    </span>
                    <!-- 回复 -->
                    <div class="replied">
                        <div class="repliedItem" v-if="item.beReplied.length">
                            <RouterLink :to="`/songDetail/userDetail/${item.beReplied[0].user.userId}`">
                                <span class="repliedUser clickUser">@{{ item.beReplied[0].user.nickname }}: </span>
                            </RouterLink>
                            <span class="repliedContent">{{ item.beReplied.content }}
                            </span>
                        </div>
                    </div>
                    <!-- 评论底部 -->
                    <div class="commentBottom">
                        <div class="commentCreatedTime">{{ item.time }}</div>
                        <div class="commentIcons">
                            <i class="icon iconfont  icon-dianzan" :class="{ 'red': dianznNum && i === dianzanIndex }"
                                @click="clickDianzan(item.commentId, item.likedCount, i)"><span
                                    style="color: #676767; font-size: 10px; margin-left: 5px; ">{{
                                            getLikedCount(item.likedCount, i)
                                    }}</span></i>
                            <i class="icon iconfont icon-fenxiang"></i>
                            <i class="icon iconfont icon-pinglun" style="cursor: pointer;"
                                @click="repliedClick(item.commentId, item.user.nickname, i)"></i>

                        </div>
                    </div>
                </div>
            </div>
            <!-- 分页 -->
            <div class="example-pagination-block">

                <el-pagination @click="clickButtom" small background layout="prev, pager, next" :total="total"
                    @size-change="handleSizeChange" @current-change="handleCurrentChange" class="mt-4"
                    v-model:currentPage="commentParams.currentPage" v-model:page-size="commentParams.limit" />
            </div>
        </div>

    </div>
</template>
<script>
import { useStore } from 'vuex'
import { sendCommentApi, thumbsUp } from '../../api/commentApi'
import emoJi from '../app-emoJi.vue'
import moment from 'moment'
import { $MsgErr, $MsgSucc, $MsgWarn } from '../../utils/Message'
import { ref, watch, reactive } from 'vue'
import { commentVideo } from '../../api/videoApi'
import { useRoute } from 'vue-router'
import { mvComment } from '../../api/MVapi'
export default {
    name: 'commentVideo',
    components: {
        emoJi
    },
    setup(props, { emit }) {
        const store = useStore()
        const scrollnum = ref(null)
        const route = useRoute()
        const total = ref(null)
        const commentParams = reactive({
            offset: 0,
            limit: 20,
            currentPage: 1
        })
        const comments = ref([])
        const hotCommentList = ref([])
        const textarea = ref('')
        const vid = ref('')
        const isReplied = ref(false)
        const MvId = ref('')
        let num = /^[0-9]*$/
        const commentId = ref('')
        let videoMvId = null
        const dianzanIndex = ref(null)
        const dianznNum = ref(null)
        const arrIndex = ref([])
        const dianzanIndexArr = ref([])
        const hotDianzanIndexArr = ref([])
        const isShow = ref(false)
        const emoJiArr = ref([])
        // 表情
        const getEmoji = (val) => {
            emoJiArr.value.push(val)
            isShow.value = false
            textarea.value = textarea.value + emoJiArr.value.join('')
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
        // 点赞借口
        const getThumbsUp = (t, type, id, cid, likedCount, hot) => {
            thumbsUp(t, type, id, cid).then(res => {
                if (res.data.code !== 200) {
                    $MsgErr('请求失败')
                } else {
                    watch(dianzanIndex, (newValue) => {
                        dianznNum.value = false
                    })

                    if (!dianznNum.value) {
                        $MsgSucc('点赞成功')
                        // 把索引存起来如果在点击就没反应
                        dianznNum.value = true
                        if (hot) {
                            if (dianzanIndexArr.value.findIndex((item) => item === dianzanIndex.value) === -1) {
                                hotCommentList.value[dianzanIndex.value].likedCount = likedCount + 1
                            }
                            hotDianzanIndexArr.value.push(dianzanIndex.value)
                            getLikedCount(likedCount)
                        } else {
                            if (dianzanIndexArr.value.findIndex((item) => item === dianzanIndex.value) === -1) {
                                comments.value[dianzanIndex.value].likedCount = likedCount + 1
                            }
                            dianzanIndexArr.value.push(dianzanIndex.value)
                            getLikedCount(likedCount)
                        }
                    } else {
                        if (hot) {
                            $MsgSucc('取消点赞成功')
                            hotCommentList.value[dianzanIndex.value].likedCount = likedCount - 1
                            dianznNum.value = false
                            let filter = dianzanIndexArr.value.filter((item) => item !== dianzanIndex.value)
                            dianzanIndexArr.value = filter
                            // dianzanIndexArr.value.splice(index, 1)
                            getLikedCount(likedCount)
                        } else {
                            $MsgSucc('取消点赞成功')
                            comments.value[dianzanIndex.value].likedCount = likedCount - 1
                            dianznNum.value = false
                            let filter = dianzanIndexArr.value.filter((item) => item !== dianzanIndex.value)
                            dianzanIndexArr.value = filter
                            // dianzanIndexArr.value.splice(index, 1)
                            getLikedCount(likedCount)
                        }
                    }
                }
            })
        }
        // 点赞
        const clickDianzan = (cid, likedCount, index, hot) => {
            if (store.state.user.profile.cookie) {
                dianzanIndex.value = index
                getThumbsUp(1, 5, videoMvId, cid, likedCount, hot)
            } else {
                $MsgWarn('亲 需要登录才可以评论哦~')
            }
        }
        // 获取评论接口
        const getCommentApi = (vid) => {
            const { offset, limit } = commentParams
            commentVideo(vid, offset, limit).then(res => {
                if (res.data.code !== 200) {
                    $MsgErr(res.data.code)
                    // console.log(res.data.code)
                }
                total.value = res.data.total
                format(res.data.hotComments)
                hotCommentList.value = res.data.hotComments
                console.log(hotCommentList.value)
                format(res.data.comments)
                comments.value = res.data.comments
                console.log(comments.value)
            })
        }
        // 获取评论接口
        const getMvComment = (mvid) => {
            const { offset, limit } = commentParams
            mvComment(mvid, offset, limit).then(res => {
                if (res.data.code !== 200) {
                    $MsgErr(res.data.code)
                    // console.log(res.data.code)
                }
                total.value = res.data.total
                format(res.data.hotComments)
                hotCommentList.value = res.data.hotComments
                console.log(hotCommentList.value)
                format(res.data.comments)
                comments.value = res.data.comments
                console.log(comments.value)
            })
        }
        watch(() => route.params.id, (newValue) => {
            if (newValue && `/videoPlay/videoDetail/${newValue}` === route.path) {
                // 匹配如果都是数字那么就是mv 不然就是视频
                videoMvId = newValue
                if (num.test(newValue)) {
                    // 发mv接口
                    // 相关mv
                    MvId.value = newValue
                    getMvComment(newValue)
                } else {
                    // 发视频接口
                    vid.value = newValue
                    getCommentApi(newValue)
                }
            }
        }, { immediate: true })
        // 给数组的time格式化
        const format = (Comments) => {
            if (Comments) {
                Comments.forEach(item => {
                    item.time = moment(item.time).format('yyyy年M月DD日')
                })
            }
        }
        // 获取当前页吗
        const handleCurrentChange = (newValue) => {
            console.log(newValue)
            if (newValue === 1) {
                commentParams.offset = (newValue * 0)
                commentParams.currentPage = newValue
                getCommentApi(vid.value)
            } else if (newValue === 2) {
                commentParams.offset = (newValue * 10)
                commentParams.currentPage = newValue
                getCommentApi(vid.value)
            } else {
                commentParams.offset = (newValue * 20)
                commentParams.currentPage = newValue
                if (commentParams.offset >= total.value) {
                    commentParams.offset = total.value
                    getCommentApi(vid.value)
                } else {
                    getCommentApi(vid.value)
                }
            }
        }
        // 发送评论
        const getSendCommentApi = (t, type, id, content, commentId = '') => {
            sendCommentApi(t, type, id, content, commentId).then(res => {
                if (res.data.code !== 200) {
                    $MsgErr('请求失败')
                } else {
                    $MsgSucc('评论成功数据可能有延迟')
                }
                console.log(res.data)
                textarea.value = ''

                if (num.test(id)) {
                    let time = setInterval(() => {
                        if (comments.value[0].content === content) {
                            clearInterval(time)
                        }
                        getMvComment(MvId.value)
                    }, 10000)
                } else {
                    let time = setInterval(() => {
                        if (comments.value[0].content === content) {
                            clearInterval(time)
                        }
                        getCommentApi(vid.value)
                    }, 10000)
                }

                // 最后重置是否回复
                isReplied.value = false
            })
        }
        // 回复
        const repliedClick = (id, content) => {
            clickButtom()
            commentId.value = id
            textarea.value = '回复' + content + ' : '
            isReplied.value = true
        }
        // // 点击发送评论
        const commentClick = () => {
            if (store.state.user.profile.cookie) {
                if (num.test(videoMvId)) {
                    // mv
                    if (isReplied.value) {
                        // 回复评论
                        getSendCommentApi(1, 1, MvId.value, textarea.value.trim(), commentId.value)
                    } else {
                        // 评论
                        getSendCommentApi(1, 1, MvId.value, textarea.value.trim())
                    }
                } else {
                    // 视频
                    if (isReplied.value) {
                        // 回复评论
                        getSendCommentApi(1, 5, vid.value, textarea.value.trim(), commentId.value)
                    } else {
                        // 评论
                        getSendCommentApi(1, 5, vid.value, textarea.value.trim())
                    }
                }
            } else {
                $MsgWarn('亲 需要登录才可以评论哦~')
            }
        }
        // 封装动画
        let time
        function animate() {
            clearInterval(time)
            time = setInterval(() => {
                if (scrollnum.value <= 500) {
                    clearInterval(time)
                }
                scrollnum.value = scrollnum.value - 50
                emit('scrtop', scrollnum.value)
            }, 30)
        }

        const scrollComment = (scrollTop) => {
            console.log(scrollTop)
            scrollnum.value = Math.floor(scrollTop)
        }
        // 点击按钮
        const clickButtom = () => {
            animate()
        }
        return { clickButtom, textarea, handleCurrentChange, getEmoji, getLikedCount, dianznNum, dianzanIndex, commentClick, clickDianzan, repliedClick, comments, hotCommentList, commentParams, total, scrollComment }
    }
}
</script>
<style lang="less" scoped>
.commentContainer {
    width: 550px;

    .float {
        // width: 100%;
        margin-top: 10px;
        display: flex;
        align-items: center;
        justify-content: flex-end;

        .iconfont {
            font-size: 20px;
            cursor: pointer;
        }

        .el-button {
            margin-left: 10px;
        }
    }

    /deep/.el-textarea__inner {
        height: 70px;
        resize: none;
        width: 550px;
    }

    .moreComment {
        height: 100px;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        .buttom()
    }

    .commentList {
        .example-pagination-block {
            display: flex;
            justify-content: center;
            margin-top: 15px;
            margin-bottom: 20px;

            .el-pager li {
                outline: none;
            }

            /deep/.el-pagination.is-background .el-pager li:not(.is-disabled).is-active {
                background-color: @priceColor;
            }

            /deep/.el-pagination.is-background .el-pager li:not(.is-disabled):hover {
                color: @priceColor ;
            }
        }

        .hotCommentList {
            display: flex;
            border-bottom: 2px solid #eee;
            padding-bottom: 10px;
            margin-top: 15px;
            width: 550px;

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

                .replied {
                    background-color: #F5F5F5;
                }

                .commentBottom {
                    display: flex;
                    justify-content: space-between;
                    margin-top: 10px;

                    .commentCreatedTime {
                        color: #8b8b8b;
                    }

                    .commentIcons {
                        display: flex;
                        width: 150px;
                        justify-content: space-around;

                        .iconfont {
                            &.red {
                                color: red;
                            }

                        }

                    }
                }
            }
        }

    }
}

/deep/.el-textarea {
    --el-input-focus-border-color: @priceColor;
}
</style>