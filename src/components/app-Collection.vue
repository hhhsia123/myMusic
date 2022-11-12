<template>
    <div>
        <div class="colleCtion" ref="target" v-if="subscribers.length">
            <span class="colleCtionContainer" v-for="(item, i) in subscribers" :key="i" @click="toUserDetial(i)">
                <img class="pic" :src="item.avatarUrl + '?param=100y100'" alt="">
                <span>{{ item.nickname }}</span>
            </span>
        </div>
        <h2 v-else class="noscllection">暂无收藏者</h2>
    </div>
</template>
<script>
import { reactive, onMounted, ref } from 'vue'
import { collection } from '../api/songDetail'
import { MsgErr } from '../utils/Message'
import { useRouter } from 'vue-router'
export default {
    name: 'colleCtion',
    components: {
    },
    props: {
        id: {
            type: Number,
            default: 6699931397
        }
    },
    setup(props) {
        const router = useRouter()
        const target = ref(null)
        const params = reactive({
            offset: 0,
            limit: 20
        })
        const subscribers = ref([])
        onMounted(() => {
            getCollection()
        })
        // 获取收藏者的接口
        const getCollection = () => {
            collection(props.id, params.limit, params.offset).then((res) => {
                if (res.data.code !== 200) {
                    MsgErr(res.data.code)
                }
                subscribers.value = res.data.subscribers
                params.offset = params.offset + 20
                params.limit = params.limit + 20
            })
        }
        // 获取用户详情信息
        const toUserDetial = (i) => {
            router.push('/songDetail/userDetail/' + subscribers.value[i].userId)
        }

        return { subscribers, target, getCollection, toUserDetial }
    }
}
</script>
<style lang="less" scoped>
div {
    position: relative;

    .noscllection {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }

    .colleCtion {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;

        .colleCtionContainer {
            display: flex;
            width: 400px;
            height: 100px;
            align-items: center;

            span {
                margin-left: 10px;
            }

            &:hover {
                background-color: #F9F9F9;
                cursor: pointer;
            }

            .pic {
                max-width: 80px;
                max-height: 80px;
                border-radius: 50%;
            }
        }
    }
}
</style>