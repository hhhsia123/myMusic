<template>
    <div class="boxContain" v-if="videoData">

        <div class="box">
            <ul>
                <ul>
                    <li v-for="(item, i) in videoData" :key="i">

                        <RouterLink :to="`/videoPlay/videoDetail/${item.vid}`">
                            <div v-if="!keletonShow">
                                <div class="image">
                                    <img class="pic " :src="item.coverUrl + '?param=200y200'" alt="">

                                    <!-- 遮罩层 -->
                                    <div class="masks"></div>
                                    <!-- 播放按钮 -->
                                    <i class=" playButtom iconfont  icon-bofang-copy"></i>
                                    <i class="duration">{{ item.duration }}</i>
                                </div>
                                <div class="desc">{{ item.title }}</div>
                                <div style="color: #E7CFE7; margin-top: 10px; font-size: 10px;">by: {{
                                        item.creator[0].userName
                                }}</div>
                            </div>
                            <el-skeleton class="skeleton" animated v-if="keletonShow">
                                <template #template>
                                    <el-skeleton-item variant="image" style="width: 210px; height: 116px" />
                                    <div style="padding: 14px">
                                        <div style="
     display: flex;
     align-items: center;justify-items: space-between;"> </div>
                                    </div>
                                </template>
                            </el-skeleton>
                        </RouterLink>
                    </li>
                </ul>
            </ul>
        </div>
    </div>
</template>
<script>

import { ref, watch } from 'vue'
export default {
    name: 'videoBox',
    components: {
    },
    props: {
        videoData: {
            type: Array,
            default: () => []
        },
        Loading: {
            type: Boolean,
            default: false
        }
    },
    setup(props) {
        const keletonShow = ref(false)
        const data = ref([])
        const num = ref(null)
        watch(() => props.Loading, () => {
            console.log(props.Loading)
            keletonShow.value = props.Loading
            console.log(props.videoData)
        }, { immediate: true })
        return { num, data, keletonShow }
    }
}
</script>
<style lang="less" scoped>
.boxContain {
    p {
        margin-left: 50px;

    }

    .box {

        width: 940px;
        height: 600px;
        margin: 15px 0 10px 0px;

        ul {

            li {
                position: relative;
                float: left;
                width: 223px;
                height: 200px;
                margin-right: 15px;
                margin-bottom: 10px;

                &:nth-child(4) {
                    margin-right: 0px;
                }

                &:nth-child(8) {
                    margin-right: 0px;
                }

                .image {

                    &:hover {
                        .masks {
                            opacity: 1;
                        }

                        .playButtom {
                            opacity: 1;
                        }
                    }

                    .playButtom {
                        color: @priceColor;
                        position: absolute;
                        bottom: 100px;
                        right: 20px;
                        opacity: 0;
                        font-size: 35px;
                        transition: all 2s;
                        z-index: 100;
                    }

                    .duration {
                        color: #fff;
                        position: absolute;
                        bottom: 84px;
                        right: 25px;
                        font-size: 10px;
                        z-index: 100;
                    }

                    .pic {
                        border-radius: 10px;
                        margin-bottom: 8px;
                        width: 210px;
                        height: 123px;
                        object-fit: cover;
                    }

                    .masks {
                        display: block;
                        position: absolute;
                        top: 0px;
                        left: 0px;
                        width: 210px !important;
                        height: 123px !important;
                        background-color: rgba(0, 0, 0, 0.5);
                        border-radius: 10px;
                        opacity: 0;
                        transition: all 1s;
                    }
                }

                .desc {
                    font-size: 13px;
                    color: #373737;
                    font-size: 26rpx;
                    /* 多行文本溢出隐藏，省略号代替 */
                    overflow: hidden;
                    text-overflow: ellipsis;
                    display: -webkit-box;
                    /* 设置对齐模式 */
                    -webkit-box-orient: vertical;
                    /* 设置盒子的行数 */
                    -webkit-line-clamp: 2;
                }

                .playCount {
                    position: absolute;
                    align-items: center;
                    line-height: 30px;
                    top: 2px;
                    left: 2px;
                    width: 80px;
                    height: 30px;
                    background-color: rgba(0, 0, 0, 0.4);
                    border-radius: 30px;

                    .el-icon {
                        vertical-align: middle;
                        margin-left: 5px;
                        margin-right: 5px;
                        margin-bottom: 2px;
                    }
                }

            }
        }
    }
}
</style>