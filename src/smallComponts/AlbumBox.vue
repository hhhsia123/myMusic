<template>
    <div class="boxContain">

        <div class="box">
            <ul>
                <ul v-for="(item, i) in AlbumData" :key="i">
                    <li>
                        <RouterLink :to="`/albumDetail/${item.id}`">
                            <div class="image">
                                <img class="pic " :src="item.blurPicUrl + '?param=200y200'" alt="" v-if="item.picUrl">
                                <img class="pic " :src="item.coverImgUrl + '?param=200y200'" alt="" v-else>

                                <!-- 遮罩层 -->
                                <div class="masks"></div>
                                <!-- 播放按钮 -->
                                <i class=" playButtom iconfont  icon-bofang-copy"></i>
                            </div>
                            <div class="desc">{{ item.name }}</div>
                            <div class="text">{{ item.company }}</div>
                        </RouterLink>
                    </li>
                </ul>
            </ul>
        </div>
    </div>
</template>
<script>

// vue3引入

import { ref, watch } from 'vue'
export default {
    name: 'albumBox',
    components: {

    },
    props: {
        AlbumData: {
            type: Array,
            default: () => []
        }
    },
    setup(props) {
        const data = ref([])
        const num = ref(null)
        watch(() => props.songData, () => {
            data.value = props.songData
        }, { immediate: true })
        return { num, data }
    }
}
</script>
<style lang="less" scoped>
.boxContain {
    p {
        margin-left: 50px;

    }

    .box {

        width: 830px;
        height: 500px;
        margin: 10px 0 10px 65px;

        ul {
            .hoverShadow;

            li {
                position: relative;
                float: left;
                width: 169px;
                height: 250px;
                margin-right: 31px;
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
                        color: #fff;
                        position: absolute;
                        bottom: 83px;
                        right: 50%;
                        top: 20%;
                        opacity: 0;
                        font-size: 50px;
                        transition: all 2s;
                        z-index: 100;
                        transform: translateX(50%);
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
                    font-size: 15px;
                    .overflow();
                    margin-bottom: 10px;

                    &:hover {
                        color: #000000;
                    }
                }

                .text {
                    color: #9FBFDF;
                    font-size: 8px;

                    .overflow();

                    &:hover {
                        color: #000000;
                    }
                }

            }
        }
    }
}
</style>