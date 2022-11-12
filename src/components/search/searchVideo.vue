<template>
    <div v-if="!(JSON.stringify(searchVideoObj) === '{}')">
        <h3> 找到 {{ searchVideoObj.videoCount }} 个视频</h3>
        <videoBox :videoData="searchVideoObj.videos" :Loading="keletonShow"></videoBox>
        <!-- 分页 -->
        <div class="example-pagination-block">

            <el-pagination @click="clickButtom" small background layout="prev, pager, next"
                :total="searchVideoObj.videoCount" @size-change="handleSizeChange" @current-change="handleCurrentChange"
                class="mt-4" v-model:currentPage="searchVideoObj.currentPage"
                v-model:page-size="searchVideoObj.limit" />
        </div>
    </div>
    <div v-if="!(JSON.stringify(MvSubListObj) === '{}')">
        <h3 class="empty" v-if="MvSubListObj.count === 0">暂无收藏专辑</h3>
        <h3 v-else> 收藏的视频或者Mv ({{ MvSubListObj.count }})</h3>
        <videoBox :videoData="MvSubListObj.MvSubListArr"></videoBox>
    </div>
</template>
<script>
import videoBox from '../../smallComponts/searchVideo.vue'
import { reactive, watch, ref } from 'vue'
export default {
    name: 'searchVideo',
    components: {
        videoBox
    },
    props: {
        video: {
            type: Object,
            default: () => { }
        },
        filterLoading: {
            type: Boolean,
            default: false
        }
    },
    setup(props, { emit }) {
        const MvSubListObj = ref({})
        const keletonShow = ref(false)
        const searchVideoObj = reactive({
            videoCount: null,
            videos: [],
            offset: 0,
            currentPage: 1
        })
        const clear = () => {
            Object.keys(searchVideoObj).map(key => {
                return delete searchVideoObj[key]
            })
        }
        watch(() => props.filterLoading, () => {
            keletonShow.value = props.filterLoading
        }, { immediate: true })
        watch(() => props.video, (newVal) => {
            if (newVal.MvSubList === 'MvSubList') {
                MvSubListObj.value = newVal
                clear()
            } else {
                searchVideoObj.videoCount = newVal.videoCount
                searchVideoObj.videos = newVal.videos
                MvSubListObj.value = {}
            }
        }, { immediate: true, deep: true })
        const handleCurrentChange = (newValue) => {
            console.log(newValue)
            if (newValue === 1) {
                searchVideoObj.offset = (newValue * 0)
                searchVideoObj.currentPage = newValue
                emit('change', searchVideoObj.offset)
            } else {
                searchVideoObj.offset = ((newValue - 1) * 10)
                searchVideoObj.currentPage = newValue
                emit('change', searchVideoObj.offset)
                if (searchVideoObj.offset >= searchVideoObj.videoCount) {
                    searchVideoObj.offset = searchVideoObj.videoCount
                }
            }
        }
        return { searchVideoObj, handleCurrentChange, keletonShow, MvSubListObj }
    }
}
</script>
<style lang="less" scoped>
.empty {
    position: relative;
}

.example-pagination-block {
    margin-left: 54%;
    height: 50px;
    transform: translateX(-50%);
    margin-top: 30px;

    .el-pagination {
        margin-top: 15px;
    }

    /deep/.el-pager li {
        outline: none;
    }

    /deep/ .el-pagination.is-background .el-pager li:not(.is-disabled).is-active {
        background-color: @priceColor;
    }

    /deep/.el-pagination.is-background .el-pager li:not(.is-disabled):hover {
        color: @priceColor ;
    }
}
</style>