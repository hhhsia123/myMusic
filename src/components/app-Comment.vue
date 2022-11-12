<template>
    <el-input v-model="textarea" maxlength="150" placeholder="请留下您的评论！" show-word-limit type="textarea" />
    <div class="float ">
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
                <img class="pic" :src="item.user.avatarUrl + '?param=220y220'" alt="">
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
                        <span class="repliedContent">{{ item.beReplied[0].content }}
                        </span>
                    </div>
                </div>
                <!-- 评论底部 -->
                <div class="commentBottom">
                    <div class="commentCreatedTime">{{ item.time }}</div>
                    <div class="commentIcons">
                        <!-- 需要把他封装成组件不然就不是独立的 -->
                        <i class="icon iconfont  icon-dianzan" :class="{ 'red': dianznNum && i === dianzanIndex }"
                            @click="clickDianzan(item.commentId, item.likedCount, i, 'hot')"><span
                                style="color: #676767; font-size: 10px; margin-left: 5px; ">{{
                                        getLikedCount(item.likedCount, i)
                                }}</span></i>
                        <i class="icon iconfont icon-fenxiang"></i>
                        <i class="icon iconfont icon-pinglun" style="cursor: pointer;"
                            @click="repliedClick(item.commentId, item.user.nickname)"></i>

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
    <div class="commentList" v-if="comment">
        <div class="hotCommentList" v-for="(item, i) in comment" :key="i">
            <!-- 头像 -->
            <div class="commentCreatorAvatar clickUser">
                <img class="pic" :src="item.user.avatarUrl + '?param=100y100'" alt="">
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
                        <span class="repliedContent">{{ item.beReplied[0].content }}
                        </span>
                    </div>
                </div>
                <!-- 评论底部 -->
                <div class="commentBottom">
                    <div class="commentCreatedTime">{{ item.time }}</div>
                    <div class="commentIcons">
                        <i class="icon iconfont  icon-dianzan" @click="clickDianzan(item.commentId, item.likedCount, i)"
                            :class="{ 'red': dianznNum && i === dianzanIndex }"><span
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
</template>
<script>
import emoJi from './app-emoJi.vue'
import { sendCommentApi, thumbsUp } from '../api/commentApi'
import { albumComment } from '../api/singerDetail'
import { useStore } from 'vuex'
import moment from 'moment'
import { commentList, musiccomment } from '../api/songDetail'
import { reactive, ref, watch } from 'vue'
import { $MsgErr, $MsgSucc, $MsgWarn } from '../utils/Message'
export default {
    name: 'appComment',
    components: {
        emoJi
    },
    props: {
        id: {
            type: Number,
            default: 6699931397
        },
        isAlbumComment: {
            type: Boolean,
            default: false,
            emoJi

        },
        // 歌曲
        musicommentId: {
            type: Number,
            default: null
        }
    },
    setup(props, { emit }) {
        const id = ref(null)
        const total = ref(null)
        const commentParams = reactive({
            offset: 0,
            limit: 20,
            timestamp: '',
            currentPage: 1
        })
        const store = useStore()
        const comment = ref([])
        const hotCommentList = ref([])
        const textarea = ref('')
        const isAlbumComment = ref([])
        const isReplied = ref(false)
        const commentId = ref(null)
        const isShow = ref(false)
        const emoJiArr = ref([])
        // 表情
        const getEmoji = (val) => {
            emoJiArr.value.push(val)
            isShow.value = false
            textarea.value = textarea.value + emoJiArr.value.join('')
        }
        const clickShow = () => {
            isShow.value = !isShow.value
        }
        const songComment = ref(null)
        const dianzanIndex = ref(null)
        const dianznNum = ref(null)
        const arrIndex = ref([])
        const dianzanIndexArr = ref([])
        const hotDianzanIndexArr = ref([])
        // 给数组的time格式化
        const format = (Comments) => {
            if (Comments) {
                Comments.forEach(item => {
                    item.time = moment(item.time).format('yyyy年M月DD日')
                })
            }
        }
        // 获取评论接口
        const getCommentApi = (newValue) => {
            const { offset, limit, timestamp } = commentParams
            if (newValue[1]) {
                // 发的是专辑评论
                albumComment(newValue[0], offset, limit, timestamp).then(res => {
                    console.log(res.data)
                    if (res.data.code !== 200) {
                        $MsgErr(res.data.code)
                        // console.log(res.data.code)
                    }
                    total.value = res.data.total
                    format(res.data.hotComments)
                    hotCommentList.value = res.data.hotComments
                    console.log(hotCommentList.value)
                    format(res.data.comments)
                    comment.value = res.data.comments
                })
            } else if (songComment.value) {
                musiccomment(songComment.value, offset, limit, timestamp).then(res => {
                    console.log(res.data)
                    if (res.data.code !== 200) {
                        $MsgErr(res.data.code)
                        // console.log(res.data.code)
                    }
                    total.value = res.data.total
                    format(res.data.hotComments)
                    hotCommentList.value = res.data.hotComments
                    console.log(hotCommentList.value)
                    format(res.data.comments)
                    comment.value = res.data.comments
                })
            } else {
                // 歌单
                commentList(newValue[0], offset, limit, timestamp).then(res => {
                    if (res.data.code !== 200) {
                        $MsgErr(res.data.code)
                        // console.log(res.data.code)
                    }
                    total.value = res.data.total
                    format(res.data.hotComments)
                    hotCommentList.value = res.data.hotComments
                    console.log(hotCommentList.value)
                    format(res.data.comments)
                    comment.value = res.data.comments
                })
            }
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
                                comment.value[dianzanIndex.value].likedCount = likedCount + 1
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
                            comment.value[dianzanIndex.value].likedCount = likedCount - 1
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
            dianzanIndex.value = index
            if (store.state.user.profile.cookie) {
                getThumbsUp(1, 2, id.value, cid, likedCount, hot)
            } else {
                $MsgWarn('亲 需要登录才可以访问哦~')
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

                let time = setInterval(() => {
                    if (comment.value[0].content === content) {
                        clearInterval(time)
                    }
                    getCommentApi(isAlbumComment.value)
                }, 10000)

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
                if (isAlbumComment.value[1]) {
                    if (isReplied.value) {
                        // 回复评论
                        getSendCommentApi(1, 3, id.value, textarea.value.trim(), commentId.value)
                    } else {
                        // 评论
                        getSendCommentApi(1, 3, id.value, textarea.value.trim())
                    }
                } else if (songComment.value) {
                    if (isReplied.value) {
                        // 回复评论
                        getSendCommentApi(1, 0, songComment.value, textarea.value.trim(), commentId.value)
                    } else {
                        // 评论
                        getSendCommentApi(1, 0, songComment.value, textarea.value.trim())
                    }
                } else {
                    if (isReplied.value) {
                        // 回复评论
                        getSendCommentApi(1, 2, id.value, textarea.value.trim(), commentId.value)
                    } else {
                        // 评论
                        getSendCommentApi(1, 2, id.value, textarea.value.trim())
                    }
                }
            } else {
                $MsgWarn('亲 需要登录才可以访问哦~')
            }
        }
        // 监听评论是专辑评论还是歌单评论
        watch(() => [props.id, props.isAlbumComment, props.musicommentId], (newValue) => {
            id.value = newValue[0]
            songComment.value = newValue[2]
            isAlbumComment.value = newValue
            getCommentApi(newValue)
        }, { immediate: true })
        // 获取当前页吗
        const handleCurrentChange = (newValue) => {
            console.log(newValue)
            if (newValue === 1) {
                commentParams.offset = (newValue * 0)
                commentParams.currentPage = newValue
                getCommentApi(isAlbumComment.value)
            } else if (newValue === 2) {
                commentParams.offset = (newValue * 10)
                commentParams.currentPage = newValue
                getCommentApi(isAlbumComment.value)
            } else {
                commentParams.offset = (newValue * 20)
                commentParams.currentPage = newValue

                getCommentApi(isAlbumComment.value)

                if (commentParams.offset >= total.value) {
                    commentParams.offset = total.value
                    getCommentApi(isAlbumComment.value)
                }
            }
        }
        // 点击按钮
        const clickButtom = () => {
            emit('clickTop', true)
        }
        return { textarea, hotCommentList, comment, total, dianzanIndex, getLikedCount, dianznNum, clickDianzan, getEmoji, clickShow, commentParams, handleCurrentChange, clickButtom, commentClick, repliedClick }
    }
}
</script>
<style lang="less">
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

.el-textarea__inner {
    width: 940px;
    height: 70px;
    resize: none;
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
        width: 940px;

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

            .replied {
                width: 100%;
                background-color: #F5F5F5;

                .repliedItem {
                    margin: 5px;
                }
            }

            .commentBottom {
                display: flex;
                justify-content: space-between;
                margin-top: 10px;

                .commentCreatedTime {
                    color: #9F9F9F;
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

/deep/.el-textarea {
    --el-input-focus-border-color: @priceColor;
}
</style>