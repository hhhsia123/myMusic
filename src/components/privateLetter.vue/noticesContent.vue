<template>
    <el-scrollbar height="425px" ref="scrollbarRef" @scroll="scroll">
        <div ref="privacyTarget" v-if="notices">
            <div class="privacyText" v-for="(item, i) in notices" :key="i">
                <img class="pic" :src="item.notice.user.avatarUrl" alt="">
                <div class="rightTitle">
                    <div class="name">
                        <div>
                            <span class="nickname">{{ item.notice.user.nickname }}</span>
                            <span v-if="item.notice.comment !== undefined" class="comment">赞了你的评论</span>
                            <span v-if="item.notice.generalNotice !== undefined" class="comment">{{
                                    item.notice.generalNotice.actionDesc
                            }}</span>
                            <span v-if="item.notice.track !== undefined" class="comment">赞了你的主页背景</span>
                            <span v-if="item.notice.playlist !== undefined" class="comment">收藏了你的歌单</span>
                        </div>
                        <span class="timer">{{ item.time }}</span>
                    </div>
                    <div v-if="item.notice.comment !== undefined" class="msg">{{ item.notice.comment.content }}</div>
                    <div v-if="item.notice.generalNotice !== undefined" class="msg">{{ item.notice.generalNotice.content
                    }}</div>
                    <div v-if="item.notice.track !== undefined" class="msg">{{
                            item.notice.track.info.commentThread.resourceTitle
                    }}</div>
                    <div v-if="item.notice.playlist !== undefined" class="msg">{{
                            item.notice.playlist.name
                    }}</div>
                </div>
            </div>
        </div>
        <div class="noContent" v-else>暂无内容</div>
    </el-scrollbar>
</template>
<script>
import { ref } from 'vue'

export default {
    name: 'noticesContent',
    components: {

    },
    props: {
        notices: {
            type: Array,
            default: () => []
        }
    },
    setup(porps, { emit }) {
        // 滚动触发
        const privacyTarget = ref(null)
        const scrollTimer = ref(null)
        const scroll = ({ scrollTop }) => {
            if (privacyTarget.value !== undefined) {
                if ((privacyTarget.value.clientHeight - 415) === parseInt(scrollTop)) {
                    // 节流
                    if (scrollTimer.value !== null) {
                        clearTimeout(scrollTimer.value)
                    }
                    scrollTimer.value = setTimeout(() => {
                        console.log('加载数据啦---')
                        emit('change', '1')
                    }, 500)
                }
            }
        }
        return { scroll, privacyTarget }
    }
}
</script>
<style lang="less" scoped>
.noContent {
    position: absolute;
    transform: translate(-50%, -50%);
    left: 50%;
    top: 50%;
    font-weight: 700;

}

.privacyText {
    margin-top: 10px;
    height: 70px;
    display: flex;
    align-items: center;
    position: relative;
    padding: 0 20px 0px 20px;
    border-bottom: 1px solid #eee;

    &:hover {
        background-color: #F6F6F7;
    }

    .pic {
        width: 40px;
        height: 40PX;
        border-radius: 50%;
    }

    .rightTitle {
        margin-left: 15px;
        width: 82%;

        .name {
            display: flex;
            justify-content: space-between;

            .nickname {
                color: #507DAF;
            }

            .comment {
                color: #939394;
                margin-left: 5px;
                font-size: 10px;
            }

            .timer {
                color: #CCCCCC;
                font-size: 10px;
            }
        }

        .msg {
            .overflow()
        }
    }
}
</style>