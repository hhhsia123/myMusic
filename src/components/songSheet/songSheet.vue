<template>
    <el-scrollbar height="465px" ref="offsetTop" @scroll="scroll" v-loading="loadingScoll"
        element-loading-text="Loading...">
        <div class="songSheetContainer">
            <div class="topNav">
                <img class="backgundPic + '?param=200y200'" :src="picUrl" alt="">
                <img class="pic + '?param=200y200'" :src="picUrl" alt="">
                <div class="button">
                    <i class=" iconfont  icon-dianzan"></i>
                    <span>精品歌单</span>
                </div>
                <span class="text">[ 精品歌单yuzhiy ]</span>

            </div>
            <!-- 切换栏 -->
            <div class="ToggleNav">
                <el-popover offset="10" popper-class="navToggle" style="overflow: auto;" :show-arrow="false"
                    placement="bottom-start" class="TogglePopover" title="全部歌单" :width="550" trigger="click" content="">
                    <el-scrollbar height="150px">
                        <div class="languageContainer" v-for="(item, i) in CategoryArr" :key="i">
                            <!-- 类型 -->
                            <div class="typeContainer">
                                <div class="type">{{ item.name }}</div>
                            </div>
                            <!-- 分类 -->
                            <div class="cart">
                                <div class="language" v-for="(list, i) in item.Categorys" :key="i">
                                    <a :class="{ 'active': i === cartIndex && list.category === categoryNum }"
                                        @click="clickActive(i, list.category, list.name)">{{ list.name }}</a>
                                </div>
                            </div>
                        </div>
                    </el-scrollbar>
                    <template #reference>
                        <el-button round>
                            {{ followCateName }}<el-icon style="margin-left:5px; font-size: 15px;">
                                <ArrowRight />
                            </el-icon>
                        </el-button>
                    </template>

                </el-popover>
                <!-- 切换栏 -->
                <div class="qiehuan">
                    <ul>
                        <li :class="{ 'active': i === TopIndex }" v-for="(item, i) in qiehuan" :key="i"><a
                                href="javascript:;" @click="clickTop(i, item.name)">{{ item.name }}</a>
                        </li>
                    </ul>
                </div>
            </div>
            <!-- 盒子 -->
            <smallBox v-if="isplaylist" :songData="playlists"></smallBox>

            <!-- <div v-else>1111</div> -->
            <div class="loading block" v-loading="loading" v-else></div>
            <!-- 分页 -->
            <div class="example-pagination-block">

                <el-pagination @click="clickButtom" small background layout="prev, pager, next" :total="total"
                    @current-change="handleCurrentChange" class="mt-4" v-model:currentPage="songParams.currentPage"
                    v-model:page-size="songParams.limit" />

            </div>

        </div>

    </el-scrollbar>

</template>
<script>
import smallBox from '../../smallComponts/smallBox.vue'
import { catlist, highquality } from '../../api/recommend'
import { ArrowRight } from '@element-plus/icons-vue'
import { onBeforeMount, ref, reactive } from 'vue'
export default {
    name: 'songSheet',
    components: {
        ArrowRight,
        smallBox
    },
    setup() {
        const loading = ref(false)
        const loadingScoll = ref(false)
        const songParams = reactive({
            limit: 50,
            currentPage: 1,
            offset: 0
        })
        const isplaylist = ref(true)
        const scrollnum = ref(null)
        const offsetTop = ref(null)
        const total = ref(null)
        const closePopover = ref(true)
        const picUrl = ref('')
        const playlists = ref([])
        const followCateName = ref('流行')
        const TopIndex = ref(1)
        const qiehuan = ref([])
        const categoryNum = ref(null)
        const cartIndex = ref(null)
        let CategorysList = reactive({})
        const sub = ref([])
        let language = ref([])
        const style = ref([])
        const scene = ref([])
        const touch = ref([])
        const theme = ref([])
        const CategoryArr = ref([])
        // 点击显示active
        const clickActive = (i, category, name) => {
            cartIndex.value = i
            categoryNum.value = category
            followCateName.value = name
            TopIndex.value = ''
            getHighquality(0, followCateName.value)
        }
        // 切换tap栏
        const clickTop = (i, name) => {
            TopIndex.value = i
            followCateName.value = name
            // 发送请求
            getHighquality(0, followCateName.value)
        }
        // 获取分类的具体内容
        const getHighquality = (offset = 0, name) => {
            isplaylist.value = false
            loading.value = true
            highquality(offset, name).then(res => {
                console.log(res)
                playlists.value = res.data.playlists
                // 截取第一个歌单
                picUrl.value = res.data.playlists.slice(0, 1)
                picUrl.value = picUrl.value[0].coverImgUrl
                console.log(picUrl.value[0].coverImgUrl)
                // 获取总数量
                total.value = res.data.total
                isplaylist.value = true
                loading.value = false
            })
        }
        // 获取分类接口
        const getCatlist = () => {
            catlist().then(res => {
                console.log(res.data)
                CategorysList.value = res.data.categories
                sub.value = res.data.sub
                // 遍历数组
                sub.value.forEach(item => {
                    if (item.category === 0) {
                        language.value.push(item)
                    }
                    if (item.category === 1) {
                        style.value.push(item)
                    }
                    if (item.category === 2) {
                        scene.value.push(item)
                    }
                    if (item.category === 3) {
                        touch.value.push(item)
                    }
                    if (item.category === 4) {
                        theme.value.push(item)
                    }
                })
                // 遍历对象
                for (let key in CategorysList.value) {
                    CategoryArr.value.push({
                        name: CategorysList.value[key],
                        category: parseFloat(key)
                    })
                }
                console.log(CategoryArr.value)
                // 合并对象与数组
                CategoryArr.value.forEach(item => {
                    if (item.category === language.value[0].category) {
                        item.Categorys = language.value
                    }
                    if (item.category === style.value[0].category) {
                        item.Categorys = style.value
                    }
                    if (item.category === scene.value[0].category) {
                        item.Categorys = scene.value
                    }
                    if (item.category === touch.value[0].category) {
                        item.Categorys = touch.value
                    }
                    if (item.category === theme.value[0].category) {
                        item.Categorys = theme.value
                    }
                })
                // 截取前10个分类
                qiehuan.value = sub.value.slice(0, 10)
                // 进行分页
            })
        }
        const handleCurrentChange = (newValue) => {
            // console.log(newValue)
            songParams.offset = (newValue - 1) * 50
            getHighquality(songParams.offset, followCateName.value)
        }
        onBeforeMount(() => {
            getCatlist()
            getHighquality(10, '流行')
        })
        const scroll = ({ scrollTop }) => {
            scrollnum.value = Math.floor(scrollTop)
            // console.log(scrollnum.value)
        }
        // 封装动画
        let time
        function animate() {
            clearInterval(time)
            time = setInterval(() => {
                if (scrollnum.value <= 0) {
                    clearInterval(time)
                    loadingScoll.value = false
                }
                scrollnum.value = scrollnum.value - 50
                offsetTop.value.setScrollTop(scrollnum.value)
            }, 30)
        }

        // 返回顶部
        // 点击按钮
        const clickButtom = () => {
            animate()
            loadingScoll.value = true
            // store.commit('showOrHide/scrolltop', true)
            // emit('clickTop', true)
        }

        return { scroll, loadingScoll, offsetTop, total, isplaylist, clickButtom, handleCurrentChange, songParams, loading, closePopover, picUrl, CategoryArr, cartIndex, clickActive, categoryNum, qiehuan, clickTop, TopIndex, followCateName, playlists }
    }
}
</script>
<style lang="less" scoped>
.songSheetContainer {
    width: 900px;
    margin: 0px auto;

    .block {
        height: 500px;
        width: 900px;
    }

    .loading {
        top: -35px;
        background-color: transparent;
    }

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

    /deep/.boxContain {
        .box {
            margin: 10px 0 10px 0px;

        }

    }

    .ToggleNav {
        width: 100%;
        display: flex;
        justify-content: space-between;
        margin-top: 10px;

        .qiehuan {
            width: 600px;

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

    .topNav {
        height: 190px;
        overflow: hidden;
        width: 100%;
        border-radius: 15px;
        position: relative;

        .button {
            position: absolute;
            top: 30%;
            left: 21%;
            transform: translateY(-50%);
            width: 110px;
            border: 2px solid #D9A05A;
            height: 35px;
            border-radius: 40px;
            display: flex;
            justify-content: center;
            align-items: center;

            span {
                color: #D9A05A;
            }

            .iconfont {
                color: #D9A05A;
                margin-right: 10px;
                font-weight: 500;
            }
        }

        .text {
            position: absolute;
            top: 60%;
            left: 21%;
            transform: translateY(-50%);
            color: #fff;
            font-weight: 500;
            font-size: 20px;
        }

        .pic {
            position: absolute;
            top: 50%;
            left: 20px;
            max-width: 150px;
            max-height: 150px;
            transform: translateY(-50%);
            border-radius: 10px;
        }

        .backgundPic {
            width: 100%;
            height: 100%;
            filter: blur(30px);
        }
    }

}
</style>