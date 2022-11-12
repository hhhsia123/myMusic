<template>
    <div class="commentContainer">
        <el-input v-model="textarea" maxlength="150" placeholder="请留下您的评论" show-word-limit type="textarea" />
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
        <div class="commentList">
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
        </div>

    </div>
</template>
<script>
import { useStore } from 'vuex'
import emoJi from '../app-emoJi.vue'
import { threadIdSendComment, threadIdthumbsUp } from '../../api/commentApi'
import { $MsgErr, $MsgSucc, $MsgWarn } from '@/utils/Message'
import moment from 'moment'
import { ref, watch, reactive } from 'vue'
export default {
    name: 'followComment',
    components: {
        emoJi
    },
    props: {
        comment: {
            type: Object
        },
        dynamicId: {
            type: Number
        }

    },
    emits: ['getDynamicComment'],
    setup(props, { emit }) {
        const commentData = ref({})
        const total = ref(null)
        const commentParams = reactive({
            offset: 0,
            limit: 20,
            currentPage: 1
        })
        const commentId = ref('')
        const textarea = ref('')
        const isReplied = ref(false)
        const comments = ref([])
        const hotCommentList = ref([])
        const dianzanIndex = ref(null)
        const dianznNum = ref(null)
        const arrIndex = ref([])
        const dianzanIndexArr = ref([])
        const hotDianzanIndexArr = ref([])
        const threadId = ref(null)
        const isShow = ref(false)
        const emoJiArr = ref([])
        const store = useStore()
        // 表情
        const getEmoji = (val) => {
            emoJiArr.value.push(val)
            isShow.value = false
            textarea.value = textarea.value + emoJiArr.value.join('')
        }
        // 给数组的time格式化
        const format = (Comments) => {
            if (Comments) {
                Comments.forEach(item => {
                    item.time = moment(item.time).format('yyyy年M月DD日')
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
        // 获取评论接口
        const getCommentData = () => {
            total.value = commentData.value.total
            format(commentData.value.hotComments)
            hotCommentList.value = commentData.value.hotComments
            format(commentData.value.comments)
            comments.value = commentData.value.comments
        }

        // 点赞
        const getThumbsUp = (t, type, id, cid, likedCount, hot) => {
            threadIdthumbsUp(t, type, id, cid).then(res => {
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
                getThumbsUp(1, 6, threadId.value, cid, likedCount, hot)
            } else {
                $MsgWarn('亲 需要登录才可以访问哦~')
            }
        }
        // 发送评论
        const getSendCommentApi = (t, type, id, content, commentId = '') => {
            threadIdSendComment(t, type, id, content, commentId).then(res => {
                if (res.data.code !== 200) {
                    $MsgErr('请求失败')
                } else {
                    $MsgSucc('评论成功数据可能有延迟')
                }
                console.log(res.data)
                textarea.value = ''
                let time = setInterval(() => {
                    if (comments.value[0].content === content) {
                        clearInterval(time)
                    }
                    emit('getDynamicComment', threadId.value)
                }, 10000)
                // 最后重置是否回复
                isReplied.value = false
            })
        }
        // // 点击发送评论
        const commentClick = () => {
            // 动态
            if (store.state.user.profile.cookie) {
                if (isReplied.value) {
                    // 回复评论
                    getSendCommentApi(1, 6, threadId.value, textarea.value.trim(), commentId.value)
                } else {
                    // 评论
                    getSendCommentApi(1, 6, threadId.value, textarea.value.trim())
                }
            } else {
                $MsgWarn('亲 需要登录才可以访问哦~')
            }
        }
        // 回复
        const repliedClick = (id, content) => {
            commentId.value = id
            textarea.value = '回复' + content + ' : '
            isReplied.value = true
        }
        // 获取评论数据
        watch(() => [props.comment, props.dynamicId], (newValue) => {
            commentData.value = newValue[0]
            threadId.value = newValue[1]
            getCommentData(commentData.value)
        }, { immediate: true })

        return { textarea, comments, hotCommentList, commentParams, total, scroll, clickDianzan, commentClick, getEmoji, dianznNum, dianzanIndex, getLikedCount, repliedClick }
    }
}
</script>
<style lang="less" scoped>
.commentContainer {
    max-width: 550px !important;

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

    .moreComment {
        height: 100px;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        .buttom()
    }

    .commentList {
        max-width: 550px !important;

        .hotCommentList {
            display: flex;
            border-bottom: 2px solid #eee;
            padding-bottom: 10px;
            margin-top: 15px;
            width: 560px;

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
                width: 90%;

                .replied {
                    width: 65%;
                    background-color: #F5F5F5;
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
}

/deep/.example-pagination-block {
    margin-left: 50%;
    height: 50px;
    transform: translateX(-50%);

    .el-pagination {
        margin-top: 15px;
        margin-bottom: 60px;
    }

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

/deep/.el-textarea {

    width: 550px !important;
}

/deep/.el-textarea__inner {
    width: 550px !important;

}
</style>