<template>
    <!-- 切换栏 -->
    <div v-infinite-scroll="load" class="infinite-list" style="overflow: auto;height: 470px; list-style: none;"
        infinite-scroll-delay="1000" infinite-scroll-distance="20">
        <div class="videoPage">
            <div class="ToggleNav">
                <el-popover offset="10" popper-class="navToggle" style="overflow: auto;" :show-arrow="false"
                    placement="bottom-start" class="TogglePopover" title="全部歌单" :width="550" trigger="click" content="">
                    <el-scrollbar height="250px">
                        <div class="languageContainer">
                            <!-- 分类 -->
                            <div class="cart">
                                <div class="language" v-for="(list, i) in categoryGroup" :key="i">
                                    <a :class="{ 'active': i === cartIndex }"
                                        @click="clickActive(i, list.id, list.name)">{{
                                                list.name
                                        }}</a>
                                </div>
                            </div>
                        </div>
                    </el-scrollbar>
                    <template #reference>
                        <el-button round>
                            {{ followCateName }}
                            <el-icon style="margin-left:5px; font-size: 15px;">
                                <ArrowRight />
                            </el-icon>
                        </el-button>
                    </template>

                </el-popover>
                <!-- 切换栏 -->
                <div class="qiehuan">
                    <ul>
                        <li :class="{ 'active': i === TopIndex }" v-for="(item, i) in categoryArr" :key="i"><a
                                href="javascript:;" @click="clickTop(i, item.id, item.name)">{{ item.name }}</a>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="videoShowContainer">
                <videoShow ref="target" />
            </div>

        </div>
    </div>

</template>
<script>
import { $MsgErr } from '@/utils/Message'
import { onMounted, reactive, ref } from 'vue'
import { ArrowRight } from '@element-plus/icons-vue'
import { videoNavApi, videoGroupList } from '../../api/videoApi'
import videoShow from '../../components/asider/videoShow.vue'
export default {
    name: 'videoPage',
    components: {
        ArrowRight,
        videoShow
    },
    setup() {
        const categoryGroup = ref([])
        const categoryArr = ref([])
        const TopIndex = ref(0)
        const followCateName = ref('现场')
        const target = ref(null)
        const cartIndex = ref('')
        const videoResourceObj = reactive({
            id: 60100,
            offset: 0
        })
        // 点击显示active
        const clickActive = (i, id, name) => {
            cartIndex.value = i
            followCateName.value = name
            TopIndex.value = ''
            videoResourceObj.id = id
            target.value.getVideoResource(videoResourceObj.id, 0, name)
        }

        // 切换tap栏
        const clickTop = (i, id, name) => {
            TopIndex.value = i
            followCateName.value = name
            videoResourceObj.id = id
            target.value.getVideoResource(videoResourceObj.id, 0, name)
        }
        // 接口调用
        const getVideoNavApi = () => {
            videoNavApi().then(res => {
                if (res.data.code !== 200) {
                    $MsgErr(res.data.code)
                }
                console.log(res.data)
                categoryArr.value = res.data.data
            })
        }
        // 视频列表组播放
        const getVideoGroupList = () => {
            videoGroupList().then(res => {
                if (res.data.code !== 200) {
                    $MsgErr(res.data.code)
                }
                console.log(res.data.data)
                categoryGroup.value = res.data.data
            })
        }

        // 滚动底部加载
        const load = () => {
            videoResourceObj.offset = videoResourceObj.offset + 8
            target.value.getVideoResource(videoResourceObj.id, videoResourceObj.offset)
        }
        onMounted(() => {
            getVideoNavApi()
            getVideoGroupList()
            target.value.getVideoResource(videoResourceObj.id)
            // console.log(target.value.getVideoResource(videoResourceObj.id))
        })
        return { categoryArr, clickTop, TopIndex, categoryGroup, followCateName, clickActive, target, load }
    }
}
</script>
<style lang="less" scoped>
::-webkit-scrollbar-track {
    border-radius: 60px;
    background-color: #fff;
}

::-webkit-scrollbar {
    width: 12px;
    background-color: #fff;
}

::-webkit-scrollbar-thumb {
    border-radius: 60px;
    width: 5px;
    box-shadow: inset 0 0 6px rgba(0, 0, 0, .1);
    background-color: #DEDFE1;
}

.infinite-list {
    width: 950px;

    .videoPage {
        width: 931px;

        .videoShowContainer {
            height: 200px
        }

        .ToggleNav {
            width: 100%;
            display: flex;
            justify-content: space-between;
            margin-top: 10px;

            .qiehuan {
                width: 600px;
                margin-right: 30px;

                ul {
                    display: flex;
                    text-align: center;

                    li {
                        font-size: 6px;
                        width: 100px;
                        height: 25px;
                        line-height: 25px;
                        border-radius: 13px;

                        &.active {
                            background-color: #FEF5F5;

                            a {
                                color: #EC4141;
                            }
                        }

                        a {
                            &:hover {
                                color: #EC4141;
                            }
                        }
                    }

                }
            }
        }
    }
}
</style>