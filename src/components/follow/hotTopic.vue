<template>
    <div class="hotTopicBox" v-if="!(JSON.stringify(userDetailData) === '{}')">
        <div class="hotbox">
            <div class="avator" v-if="userDetailData.profile !== undefined">
                <img class="picUrl" :src="userDetailData.profile.avatarUrl" alt="">
                <div class="nickname">{{ userDetailData.profile.nickname }}</div>
            </div>
            <div class="info">
                <RouterLink :to="'/userDynamic/1'">
                    <div class="dynamic">
                        <span>{{ userDetailData.profile.eventCount }}</span>
                        <span>动态</span>
                    </div>
                </RouterLink>
                <RouterLink :to="'/care/1'">
                    <div class="data-care">
                        <span>{{ userDetailData.profile.follows }}</span>
                        <span>关注</span>
                    </div>
                </RouterLink>
                <RouterLink :to="'/care/0'">
                    <div class="data-follows">
                        <span>{{ userDetailData.profile.followeds }}</span>
                        <span>粉丝</span>
                    </div>
                </RouterLink>
            </div>
        </div>

    </div>
    <div class="hotTopicContianer">
        <div class="topicNav">
            <h4 class="topic">热门话题</h4>
            <a href="JavaScript:;">更多话题 <el-icon :size="15">
                    <ArrowRight />
                </el-icon>
            </a>
        </div>
        <RouterLink :to="`/follow/topicRanking/${item.actId}`" class="topicTheme" v-for="(item, i) in hotList" :key="i">
            <img class="pic" :src="item.sharePicUrl" alt="">
            <div class="titelContainer">
                <div class="title">#{{ item.title }}#</div>
                <div class="join">{{ item.participateCount }}人参与</div>
            </div>
        </RouterLink>
    </div>
</template>
<script>
import { ArrowRight } from '@element-plus/icons-vue'
import { $MsgErr } from '@/utils/Message'
import { watch, ref } from 'vue'
import { useStore } from 'vuex'
import { userDetail } from '../../api/songDetail'
import { hotTopic } from '../../api/TopApi'
export default {
    name: 'hotTopic',
    components: {
        ArrowRight
    },
    setup() {
        const userDetailData = ref({})
        const store = useStore()
        const hotList = ref([])
        // 调用用户接口
        const getuserDetail = (newVal) => {
            userDetail(newVal).then(res => {
                console.log(res.data)
                userDetailData.value = res.data
            })
        }
        const getHotTopic = () => {
            // 获取热门话题
            hotTopic().then(res => {
                if (res.data.code !== 200) {
                    $MsgErr(res.data.code)
                }
                console.log(res.data)
                // 截取前5个渲染
                hotList.value = res.data.hot.slice(0, 8)
            })
        }
        // 监听路由id值
        watch(() => store.state.user.profile.userId, (newVal) => {
            console.log(newVal)
            getuserDetail(newVal)
            getHotTopic()
        }, { immediate: true })
        return { userDetailData, hotList }
    }

}
</script>
<style lang="less" scoped>
.info() {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-right: 28px;
    border-right: 1px solid #DCDCDD;

    span {
        color: #7E7E7F;
    }
}

.hotTopicBox {

    background-color: #F5F5F7;

    .hotbox {

        height: 150px;
        text-align: center;
        margin: 0 0 0 45px;
        padding-top: 30px;

        .avator {
            display: flex;

            .picUrl {
                width: 50px;
                height: 50px;
                border-radius: 50%;
            }

            .nickname {
                margin-left: 8px;
                color: #565657;
            }
        }

        .info {
            display: flex;
            align-items: center;
            margin-top: 20px;

            span {
                &:hover {
                    color: #363636;
                }
            }

            div[class^=data] {
                padding: 0 20px 0 20px;
                color: #7E7E7F;
                border-right: 1px solid #DCDCDD;
                display: flex;
                flex-direction: column;
                align-items: center;

            }

            .dynamic {
                .info();

                span {
                    &:hover {
                        color: #363636;
                    }
                }

            }

            .care {
                .info();
            }

            .follows {
                .info();
            }
        }
    }

}

.hotTopicContianer {
    position: sticky;
    top: 30px;

    .topicNav {
        margin-top: 15px;
        display: flex;
        justify-content: space-around;

    }

    .topicTheme {
        display: flex;
        align-items: center;
        margin-left: 42px;
        margin-top: 15px;

        .pic {
            width: 40px;
            height: 40px;
            border-radius: 5px;
            margin-right: 8px;
        }

        .titelContainer {
            display: flex;
            flex-direction: column;

            .join {
                color: #CCCCCC;
                font-size: 10px;
            }
        }
    }

}
</style>