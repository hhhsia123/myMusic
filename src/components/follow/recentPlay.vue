<template>
    <div class="recentPlayContent">
        <p class="bofan">最近播放 :</p>
        <div class="single" v-for="(item, i) in listArr" :key="i"
            @click="clickShowsong(item.data.al.picUrl, item.data.name, item.data.ar[0].name, item.resourceId)">
            <i class="icon iconfont " :class="[i === 0 ? 'icon-jiadayinliang' : 'icon-yinle']"></i>
            <div class="singleTitle">
                {{ item.data.name }} - <span>{{ item.data.ar[0].name }}</span>
            </div>
        </div>
        <el-button round @click="dialogVisible">返回</el-button>
    </div>
</template>
<script>
// import { $MsgSucc, $MsgErr } from '@/utils/Message'
import { recentApi } from '../../api/record'
import { onMounted, ref } from 'vue'

export default {
    name: 'recentPlay',
    components: {

    },
    setup(props, { emit }) {
        const listArr = ref([])
        const getRecentApi = () => {
            recentApi().then(res => {
                console.log(res.data)
                listArr.value = res.data.data.list.slice(0, 6)
                console.log(listArr)
            })
        }
        // 关闭
        const dialogVisible = () => {
            emit('close', false)
        }
        // 传对象给父组件
        const clickShowsong = (img, song, singer, id) => {
            dialogVisible()
            emit('infoObj', { img, song, singer, id })
        }
        onMounted(() => {
            getRecentApi()
            console.log('最近播放')
        })
        return { listArr, dialogVisible, clickShowsong }
    }
}
</script>
<style lang="less" scoped>
.recentPlayContent {
    width: 500px;
    height: 294px;
    display: table-cell;

    display:table-cell .bofan {
        color: #999999;
        margin-bottom: 20px;
    }

    .el-button {
        margin-top: 15px;
        margin-left: 250px;
        transform: translateX(-50%);
    }

    .single {
        display: flex;
        height: 40px;
        align-items: center;
        cursor: pointer;

        &:hover {
            background-color: #F2F2F2;
            border-radius: 5px;
        }

        .iconfont {
            color: #999999;
            margin: 0 15px 0 15px;
            color: red;
        }

        .singleTitle {

            span {
                color: #999999;
            }
        }
    }
}
</style>