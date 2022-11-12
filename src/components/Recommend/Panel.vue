<template>
    <h2>{{$store.state.user.profile.nickname}}的雷达歌单</h2>
    <div class="clickButtom">
        <p style="color: #9F9FCF;">根据你的红心收藏为你推荐更多歌曲</p>
        <div style="display: flex;">
            <a @click="toggle(-1)" :class="{ disabled: index === 0 }" href="javascript:;"
                class="iconfonts iconfont icon-xiangzuojiantou "></a>
            <a @click="toggle(1)" :class="{ disabled: index === 3 }" href="javascript:;"
                class="iconfonts  iconfont icon-jiantou"></a>
        </div>
    </div>
    <div class="box" style="position: relative">
        <Transition name="fade">
            <ul :style="{ transform: `translateX(${index* -934}px)` }">
                <li v-for="(item, i) in data" :key="i">
                    <RouterLink :to="`/songDetail/${item.id}`">
                        <div class="image">
                            <img class="pic " :src="item.picUrl" alt="">

                            <!-- 遮罩层 -->
                            <div class="masks"></div>
                            <!-- 播放按钮 -->
                            <i class=" playButtom iconfont  icon-bofang-copy"></i>
                        </div>
                        <div class="desc">{{item.name}}</div>
                        <div class="playCount">
                            <el-icon size="20px" color="#fff">
                                <VideoPlay />
                            </el-icon>
                            <span style="color: #fff;font-size: 10px;">{{getPlayCount(item.playcount)}}</span>
                        </div>
                    </RouterLink>
                </li>
            </ul>
        </Transition>
    </div>
</template>

<script>
import { VideoPlay } from '@element-plus/icons-vue'
import { useStore } from 'vuex'
import { recommend } from '../../api/recommend'
// import { useLazyData } from '@/hook/index'
import { ref } from 'vue'
export default {
    name: 'PanelBrand',
    components: { VideoPlay },

    setup() {
        const store = useStore()
        const data = ref([])
        const index = ref(0)
        // 获取私人歌单
        recommend().then(res => {
            console.log(res.data.recommend)
            data.value = res.data.recommend
        })
        const getPlayCount = (num) => {
            if (num > 100000000) {
                return (num / 100000000).toFixed(1) + '亿'
            }
            if (num > 10000 < 100000000) {
                return (num / 100000).toFixed(1) + '万'
            }
        }
        // 点击让其translateX走负的906
        const toggle = (step) => {
            const newIndex = index.value + step
            if (newIndex < 0 || newIndex > 3) {
                return false
            }
            index.value = newIndex
        }
        return { data, getPlayCount, toggle, index, store }
    }
}
</script>

<style scoped lang='less'>
.box {

    width: 920px;
    margin: 10px 0 10px 0px;
    display: flex;
    overflow: hidden;

    // .fade-enter-active {

    // }

    // .fade-leave-active {

    // }

    // @keyframes identifier {
    //     from{

    //     }
    //     to{

    //     }
    // }

    ul {
        display: flex;
        transition: all 2s;

        li {
            position: relative;
            float: left;
            width: 169px;
            height: 250px;
            margin-right: 18px;
            margin-bottom: 10px;

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
                    bottom: 93px;
                    right: 15px;
                    opacity: 0;
                    font-size: 35px;
                    transition: all 2s;
                    z-index: 9999;
                    font-size: 45px;

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

.clickButtom {
    display: flex;
    justify-content: space-between;

    .iconfonts {
        width: 25px;
        height: 25px;
        border-radius: 50%;
        color: #fff;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-left: 5px;
        background-color: rgba(187, 5, 5, 0.5);
        text-align: center;

        &.disabled {
            background: #ccc;
            cursor: not-allowed;
        }
    }
}
</style>