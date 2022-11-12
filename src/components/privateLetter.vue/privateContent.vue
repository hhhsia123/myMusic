<template>
    <el-scrollbar height="425px" ref="scrollbarRef" @scroll="scroll">
        <div ref="privacyTarget" v-if="privacy">
            <div class="privacyText" v-for="(item, i) in privacy" :key="i"
                @click="visible(item.fromUser.userId, item.fromUser.nickname)">
                <img class="pic" :src="item.fromUser.avatarUrl + '?param=200y200'" alt="">
                <img v-if="!(item.fromUser.avatarDetail === null)" class="iconV"
                    :src="item.fromUser.avatarDetail.identityIconUrl" alt="">
                <div class="rightTitle">
                    <div class="name">
                        <span class="nickname">{{ item.fromUser.nickname }}</span>
                        <span class="timer">{{ item.lastMsgTime }}</span>
                    </div>
                    <div class="msg">{{ JSON.parse(item.lastMsg).msg }}
                    </div>
                    <!-- <div class="msg" v-else>{{ JSON.parse(item.lastMsg).song.name }}</div> -->
                </div>
            </div>
        </div>
        <div class="noContent" v-else>暂无内容</div>
    </el-scrollbar>

</template>
<script>
import pubsub from 'pubsub-js'
import { ref } from 'vue'
export default {
    name: 'privateContent',
    components: {

    },
    props: {
        privacy: {
            type: Array,
            default: () => []
        }
    },
    setup(props, { emit }) {
        const visibleDrawer = ref(false)
        const privacyTarget = ref(null)
        const scrollbarRef = ref(null)
        const scrollTimer = ref(null)
        const offset = ref(null)
        // 滚动触发
        const scroll = ({ scrollTop }) => {
            if (privacyTarget.value !== undefined) {
                if ((privacyTarget.value.clientHeight - 415) === parseInt(scrollTop)) {
                    // 节流
                    if (scrollTimer.value !== null) {
                        clearTimeout(scrollTimer.value)
                    }
                    scrollTimer.value = setTimeout(() => {
                        console.log('加载数据啦---')
                        offset.value = offset.value + 8
                        emit('change', offset.value)
                    }, 500)
                }
            }
        }
        // 点击显示二级抽屉
        const visible = (uid, nickname) => {
            // 发布消息
            pubsub.publish('nickName', nickname)
            visibleDrawer.value = !visibleDrawer.value
            // 发请求
            emit('visible', visibleDrawer.value, uid)
        }
        // 判断是否继续加载的条件
        return { scrollbarRef, scroll, privacyTarget, visible, visibleDrawer }
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
        width: 50px;
        height: 50PX;
        border-radius: 50%;
    }

    .iconV {
        position: absolute;
        width: 15px;
        height: 15px;
        left: 14%;
        top: 63%;
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