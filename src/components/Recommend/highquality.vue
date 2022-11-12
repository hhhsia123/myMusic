
<template>
    <div class="highquality">
        <h2>爱上音乐为伴的下午</h2>
        <div class="box">
            <ul>
                <ul v-for="(item, i) in songData" :key="i">
                    <li>
                        <RouterLink :to="`/songDetail/${item.id}`">
                            <div class="image">
                                <img class="pic " :src="item.coverImgUrl" alt="">

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
        <!-- 分页 -->
        <div class="example-pagination-block">

            <el-pagination @click="clickButtom" small background layout="prev, pager, next" :total="total"
                @current-change="handleCurrentChange" class="mt-4" v-model:currentPage="songParams.currentPage"
                v-model:page-size="songParams.limit" />
        </div>
    </div>
</template>

<script>
import { VideoPlay } from '@element-plus/icons-vue'
import { getPlayCount } from '../../utils/mixins'
import { $MsgErr } from '../../utils/Message'
import { highquality } from '../../api/recommend'
import { ref, onMounted, reactive } from 'vue'
export default {
    mixins: [getPlayCount],
    name: 'personRecommend',
    components: {
        VideoPlay
    },
    setup(props, { emit }) {
        const songParams = reactive({
            limit: 50,
            currentPage: 1,
            offset: 0
        })
        const songData = ref([])
        let total = ref('')
        const gethighquality = (offset = 0) => {
            highquality(offset).then(res => {
                if (res.data.code !== 200) {
                    return $MsgErr(res.data.code)
                }
                console.log(res.data.playlists)
                songData.value = res.data.playlists
                total.value = res.data.total
            })
        }
        onMounted(() => {
            gethighquality()
        })
        // 进行分页
        const handleCurrentChange = (newValue) => {
            // console.log(newValue)
            songParams.offset = (newValue - 1) * 50
            gethighquality(songParams.offset)
        }
        // 点击按钮
        const clickButtom = () => {
            // store.commit('showOrHide/scrolltop', true)
            emit('BackTop', true)
        }
        return { songData, getPlayCount, handleCurrentChange, total, songParams, clickButtom }
    }
}
</script>
<style lang="less" scoped>
.highquality {

    /deep/.example-pagination-block {
        margin-left: 50%;
        height: 50px;
        transform: translateX(-50%);

        .el-pagination {
            margin-top: 15px;
            margin-bottom: 60px;
        }

        .el-pager li {
            outline: none;
        }

        .el-pagination.is-background .el-pager li:not(.is-disabled).is-active {
            background-color: @priceColor;
        }

        .el-pagination.is-background .el-pager li:not(.is-disabled):hover {
            color: @priceColor ;
        }
    }

    .box {

        width: 920px;
        height: 500px;
        margin: 10px 0 10px 0px;

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
                    background: black url(../../assets/imagges/图未加载.png) no-repeat center;

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
                        z-index: 9999;
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
}
</style>