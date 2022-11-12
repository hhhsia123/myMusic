<template>
    <div class="boxContain">

        <div class="box">
            <ul>
                <ul>
                    <li v-for="(item, i) in singerData" :key="i">

                        <RouterLink :to="`/singerDetail/${item.id}`">
                            <div v-if="!keletonShow">
                                <div class="image">
                                    <img class="pic " v-lazyload="item.img1v1Url + '?param=200y200'" alt="">

                                    <!-- 遮罩层 -->
                                    <div class="masks"></div>
                                    <!-- 播放按钮 -->
                                    <i class=" playButtom iconfont  icon-bofang-copy"></i>
                                </div>
                                <div class="desc">{{ item.name }}</div>
                            </div>
                            <el-skeleton class="skeleton" animated v-if="keletonShow">
                                <template #template>
                                    <el-skeleton-item variant="image" style="width: 240px; height: 240px" />
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
    name: 'singerBox',
    components: {
    },
    props: {
        singerData: {
            type: Array,
            default: () => []
        },
        Loading: {
            type: Boolean,
            default: false
        }
    },
    setup(props) {
        const keletonShow = ref(true)
        const data = ref([])
        const num = ref(null)
        watch(() => props.Loading, () => {
            console.log(props.Loading)
            keletonShow.value = props.Loading
        }, { immediate: true })
        return { num, data, keletonShow }
    }
}
</script>
<style lang="less" scoped>
.el-skeleton__item {
    width: 169px !important;
    height: 169px !important;
}

.boxContain {
    p {
        margin-left: 50px;

    }

    .box {

        width: 920px;
        height: 500px;
        margin: 10px 0 10px 48px;

        ul {

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
                        max-width: 169px;
                        height: 169px;
                        object-fit: cover;
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
                    margin-top: 15px;
                    font-size: 16px;
                    color: #373737;
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