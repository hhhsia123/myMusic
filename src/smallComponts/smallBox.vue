<template>
    <div class="boxContain">

        <div class="box" v-if="songData.length">
            <ul>
                <ul v-for="(item, i) in songData" :key="i">
                    <li>
                        <RouterLink :to="`/songDetail/${item.id}`">
                            <div class="image">
                                <img class="pic " :src="item.picUrl + '?param=200y200'" alt="" v-if="item.picUrl">
                                <img class="pic " :src="item.coverImgUrl + '?param=200y200'" alt="" v-else>

                                <!-- 遮罩层 -->
                                <div class="masks"></div>
                                <!-- 播放按钮 -->
                                <i class=" playButtom iconfont  icon-bofang-copy"></i>
                            </div>
                            <div class="desc">{{ item.name }}</div>
                            <div class="playCount">
                                <el-icon size="20px" color="#fff">
                                    <VideoPlay />
                                </el-icon>
                                <span style="color: #fff;font-size: 10px;">{{ getPlayCount(item.playCount) }}</span>
                            </div>
                        </RouterLink>
                    </li>
                </ul>
            </ul>
        </div>
    </div>
</template>
<script>

// vue3引入
import { VideoPlay } from '@element-plus/icons-vue'

import { ref } from 'vue'
export default {
    name: 'smallBox',
    components: {

        VideoPlay
    },
    props: {
        songData: {
            type: Array,
            default: () => []
        }
    },
    setup(props) {
        const data = ref([])
        const num = ref(null)
        // watch(() => props.songData, () => {
        //     data.value = props.songData
        // }, { immediate: true })
        // 获取播放量
        const getPlayCount = (num) => {
            if (num > 100000000) {
                return (num / 100000000).toFixed(1) + '亿'
            }
            if (num > 100000 && num < 100000000) {
                return (num / 10000).toFixed(1) + '万'
            }
            if (num < 99999) {
                return num
            }
        }
        return { num, getPlayCount, data }
    }
}
</script>
<style lang="less" scoped>
.boxContain {
    p {
        margin-left: 50px;

    }

    .box {

        width: 920px;
        height: 500px;
        margin: 10px 0 10px 48px;

        ul {
            .hoverShadow;

            li {
                position: relative;
                float: left;
                width: 169px;
                height: 250px;
                margin-right: 15px;
                margin-bottom: 10px;

                &:nth-child(5) {
                    margin-right: 0px;
                }

                &:nth-child(10) {
                    margin-right: 0px;
                }

                .image {
                    background: black url(../assets/imagges/图未加载.png) no-repeat center;
                    max-width: 169px;
                    height: 169px;

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
                        bottom: 83px;
                        right: 15px;
                        opacity: 0;
                        font-size: 35px;
                        transition: all 2s;
                        z-index: 100;
                    }

                    .pic {
                        border-radius: 10px;
                        margin-bottom: 8px;
                    }

                    .masks {
                        display: block;
                        position: absolute;
                        top: 0px;
                        left: 0px;
                        width: 169px !important;
                        height: 169px;
                        background-color: rgba(0, 0, 0, 0.5);
                        border-radius: 10px;
                        opacity: 0;
                        transition: all 1s;
                    }
                }

                .desc {
                    margin-top: 8px;
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

                    &:hover {
                        color: #000000;
                    }
                }

                .playCount {
                    position: absolute;
                    align-items: center;
                    line-height: 30px;
                    top: 2px;
                    left: 2px;
                    width: 90px;
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