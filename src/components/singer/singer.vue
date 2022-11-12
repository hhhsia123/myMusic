<template>

    <div v-infinite-scroll="load" class="infinite-list" style="overflow: auto;height: 465px; list-style: none;"
        infinite-scroll-delay="1000" infinite-scroll-distance="100">
        <div class="singerContainer">
            <!-- 筛选区 -->
            <div class="languageContainer">
                <span class="lang">语种 :</span>
                <span class="all " :class="{ 'active': i === langIndex }" @click="clickLang(i, item.unameNum)"
                    v-for="(item, i) in singerLanguage" :key="i">{{ item.uname }}</span>
            </div>
            <!-- 筛选区 -->
            <div class="typeContainer">
                <span class="type">分类 :</span>
                <span class="all " :class="{ 'active': i === typeIndex }" v-for="(item, i) in type" :key="i"
                    @click="clickType(i, item.unameType)">{{ item.type }}</span>
            </div>
            <!-- 筛选区 -->
            <div class=" letterContainer">
                <div class="letter">筛选 :</div>
                <div class="zimu"> <span class="all " :class="{ 'active': i === letterIndex }"
                        v-for="(item, i) in letter" :key="i" @click="clickLetter(i, item.letterNum)">{{ item.letter
                        }}</span>
                </div>
            </div>
        </div>
        <!-- 盒子 -->
        <singerBox :singerData="artistsArr" :Loading="filterLoading"></singerBox>
    </div>

</template>
<script>
import { $MsgErr } from '../../utils/Message'
import { songerApi } from '../../api/newMusic'
import singerBox from '../../smallComponts/singerBox.vue'
import { singerLanguage, type, letter } from '../../api/constant'
import { onMounted, reactive, ref } from 'vue'

export default {
    name: 'sinGer',
    components: {
        singerBox
    },
    setup() {
        const filterLoading = ref(false)
        const artistsArr = ref([])
        const langIndex = ref(0)
        const typeIndex = ref(0)
        const letterIndex = ref(0)
        const songerObj = reactive({
            offset: 0,
            type: -1,
            area: -1,
            initial: -1,
            limit: 30
        })
        // 点击语种
        const clickLang = (i, num) => {
            songerObj.area = num
            langIndex.value = i
            getSongerApi(songerObj)
        }
        // 点击分类
        const clickType = (i, num) => {
            songerObj.type = num
            typeIndex.value = i
            getSongerApi(songerObj)
        }
        // 点击字母
        const clickLetter = (i, num) => {
            letterIndex.value = i
            songerObj.initial = num
            getSongerApi(songerObj)
        }
        // 获取歌手
        const getSongerApi = (songerObj, isScoll) => {
            filterLoading.value = true
            if (songerObj.type === -1 && songerObj.area === -1 && songerObj.initial === -1 && isScoll !== 'isScoll') {
                songerObj.offset = 0
            }
            songerApi(songerObj).then(res => {
                if (!(res.data.code === 200)) {
                    $MsgErr(res.data.code)
                }
                if (isScoll === 'isScoll') {
                    let arr = [...artistsArr.value, ...res.data.artists]
                    artistsArr.value = arr
                } else {
                    artistsArr.value = res.data.artists
                }
                filterLoading.value = false
            })
        }
        // 滚动底部加载
        const load = () => {
            songerObj.offset = songerObj.offset + 30
            getSongerApi(songerObj, 'isScoll')
        }
        onMounted(() => {
            getSongerApi(songerObj)
        })
        return { singerLanguage, type, letter, clickLang, langIndex, typeIndex, clickType, clickLetter, letterIndex, artistsArr, load, filterLoading }
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
    .singerContainer {
        width: 900px;
        margin: 0px auto;

        .languageContainer {
            margin: 20px 0 10px 0;

            .lang {
                margin-right: 10px;
                padding-left: 0
            }

            .all {
                padding: 0 20px;
                border-right: 1px solid #eee;
                display: inline;
                height: 35px;

                &:hover {
                    color: @priceColor ;
                }

                &.active {
                    color: @priceColor ;
                    background-color: #FEF5F5;
                    border-radius: 30px;
                }
            }

        }

        .typeContainer {
            margin-bottom: 10px;

            .type {
                margin-right: 10px;
                padding-left: 0
            }

            .all {
                padding: 0 20px;
                border-right: 1px solid #eee;

                &:hover {
                    color: @priceColor ;
                }

                &.active {
                    color: @priceColor ;
                    background-color: #FEF5F5;
                    border-radius: 30px;

                }
            }

        }

        .letterContainer {
            display: flex;

            .letter {
                padding-left: 0;
                width: 66px;
            }

            .zimu {
                display: flex;
                flex-wrap: wrap;

                .all {
                    padding: 0 20px;
                    border-right: 1px solid #eee;
                    margin-bottom: 15px;

                    &:hover {
                        color: @priceColor ;
                    }

                    &.active {
                        color: @priceColor ;
                        background-color: #FEF5F5;
                        border-radius: 30px;

                    }
                }
            }
        }
    }

}
</style>
