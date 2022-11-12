<template>
    <el-scrollbar height="534px">
        <div>
            <h2 style="margin: 15px;" v-if="parseInt(routeId)">关注</h2>
            <h2 style="margin: 15px;" v-else>粉丝</h2>
        </div>
        <div class="careList">
            <div class="colleCtionContainer" v-for="(item, i) in followArr" :key="i">
                <div style="display: flex;">
                    <RouterLink :to="`/songDetail/userDetail/${item.userId}`">
                        <img class="pic" :src="item.avatarUrl + '?param=200y200'" alt="">
                    </RouterLink>
                    <img v-if="item.avatarDetail !== null" class="IconUrl"
                        :src="item.avatarDetail.identityIconUrl + '?param=200y200'" alt="">
                    <div class="singerPage">
                        <div class="nickname">{{ item.nickname }}</div>
                        <div class="signature">{{ item.signature }}</div>
                        <div class="decContent">
                            <div class="plalList">歌单:{{ item.playlistCount }}</div>
                            <span>|</span>
                            <div class="followeds">粉丝:{{ item.followeds }}</div>
                        </div>
                    </div>
                </div>
                <div v-if="parseInt(iscare)">
                    <el-button round @click="dialogVisible(item.userId, item.nickname)">
                        <el-icon>
                            <Message />
                        </el-icon>私信
                    </el-button>
                </div>
                <div v-else>
                    <el-button round v-if="item.followed">
                        <el-icon>
                            <Check />
                        </el-icon>已关注
                    </el-button>
                    <el-button round @click="isfolloweds(item.userId, i)" v-else>
                        <el-icon>
                            <Plus />
                        </el-icon>关注
                    </el-button>
                    <el-button round v-if="isfollowed && i === followIndex">
                        <el-icon>
                            <Check />
                        </el-icon>已关注
                    </el-button>
                </div>
            </div>
        </div>
    </el-scrollbar>

</template>
<script>
import pubsub from 'pubsub-js'
import { useRoute } from 'vue-router'
import { Plus, Message, Check } from '@element-plus/icons-vue'
import { $MsgErr, $MsgSucc } from '@/utils/Message'
import { useStore } from 'vuex'
import { watch, ref } from 'vue'
import { careListApi, followedsApi, likeFollowApi } from '../../api/follow'
export default {
    name: 'careList',
    components: {
        Plus, Message, Check
    },
    setup() {
        const iscare = ref('')
        const route = useRoute()
        const store = useStore()
        const uId = ref(null)
        const routeId = ref()
        const followArr = ref([])
        const isfollowed = ref(false)
        const followIndex = ref('')
        const getCareListApi = (uid) => {
            careListApi(uid).then(res => {
                if (res.data.code !== 200) {
                    $MsgErr('请求失败')
                }
                // console.log(res.data.follow)
                followArr.value = res.data.follow
            })
        }
        const getFollowedsApi = (uid) => {
            followedsApi(uid).then(res => {
                if (res.data.code !== 200) {
                    $MsgErr('请求失败')
                }
                // console.log(res.data.follow)
                followArr.value = res.data.followeds
            })
        }
        // 点击是否关注
        const isfolloweds = (userId, i) => {
            likeFollowApi(userId).then(res => {
                if (res.data.code === 200) {
                    $MsgSucc('关注成功')
                }
                isfollowed.value = true
                followIndex.value = i
            })
        }
        // 点击显示聊天框
        const dialogVisible = (userId, nickName) => {
            // 发布消息
            pubsub.publish('visible', true)
            // 第二步到私信内容组件 nickName
            setTimeout(() => {
                pubsub.publish('dialogVisible', { bol: true, id: userId })
                pubsub.publish('nickName', nickName)
            })
        }
        watch(() => [store.state.user.profile.userId, route.params.id], (newval) => {
            uId.value = newval[0]
            routeId.value = newval[1]
            if (routeId.value !== undefined) {
                iscare.value = routeId.value.charAt(routeId.value.length - 1)
            }
            if (parseInt(route.params.id) === 1 || parseInt(route.params.id) === 0) {
                if (parseInt(route.params.id)) {
                    // 关注
                    getCareListApi(uId.value)
                } else {
                    // 粉丝
                    getFollowedsApi(uId.value)
                }
            } else {
                if (routeId.value !== undefined) {
                    if (parseInt(routeId.value.charAt(routeId.value.length - 1))) {
                        // 关注
                        getCareListApi(routeId.value.substr(0, routeId.value.length - 1))
                    } else {
                        // 粉丝
                        getFollowedsApi(routeId.value.substr(0, routeId.value.length - 1))
                    }
                }
            }
        }, { immediate: true })

        return { followArr, routeId, isfolloweds, isfollowed, followIndex, dialogVisible, iscare }
    }

}
</script>
<style lang="less" scoped>
.careList {
    width: 1000px;
    height: 530px;

    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    padding: 15px;

    .colleCtionContainer {
        display: flex;
        width: 400px;
        height: 100px;
        align-items: center;
        justify-content: space-between;
        position: relative;

        span {
            margin-left: 10px;
        }

        &:hover {
            background-color: #F9F9F9;
            cursor: pointer;
        }

        .singerPage {
            line-height: 30px;

            .nickname {
                color: #000000;
                font-size: 18px;
            }

            .signature {
                .overflow();
                font-size: 13px;

            }

            .decContent {
                display: flex;

                .plalList {
                    font-size: 13px;
                }

                .followeds {
                    margin-left: 8px;
                    font-size: 13px;

                }
            }
        }

        /deep/.el-button {
            float: right;
        }

        .el-icon {
            margin-right: 8px;
        }

        .IconUrl {
            position: absolute;
            width: 30px;
            height: 30px;
            top: 60%;
            left: 12%;
        }

        .pic {
            max-width: 80px;
            max-height: 80px;
            border-radius: 50%;
            margin-right: 10px;
        }
    }

}
</style>