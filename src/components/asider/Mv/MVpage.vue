<template>

    <div v-infinite-scroll="load" class="infinite-list" style="overflow: auto;height: 470px; list-style: none;"
        infinite-scroll-delay="1000" infinite-scroll-distance="20">
        <div class="singerContainer">
            <!-- 筛选区 -->
            <div class="languageContainer">
                <span class="lang">语种 :</span>
                <span class="all " :class="{ 'active': i === langIndex }" @click="clickLang(i, item.uname)"
                    v-for="(item, i) in singerLanguageMV" :key="i">{{ item.uname }}</span>
            </div>
            <!-- 筛选区 -->
            <div class="typeContainer">
                <span class="type">分类 :</span>
                <span class="all " :class="{ 'active': i === typeIndex }" v-for="(item, i) in typeMV" :key="i"
                    @click="clickType(i, item.type)">{{ item.type }}</span>
            </div>
            <!-- 筛选区 -->
            <div class=" letterContainer">
                <div class="letter">筛选 :</div>
                <div class="zimu"> <span class="all " :class="{ 'active': i === letterIndex }"
                        v-for="(item, i) in sortMV" :key="i" @click="clickLetter(i, item.type)">{{ item.type
                        }}</span>
                </div>
            </div>
            <MVBox :videoData="artistsArr" :Loading="filterLoading"></MVBox>
        </div>
    </div>
</template>
<script>
import moment from 'moment'
import MVBox from '../../../smallComponts/MVBox.vue'
import { $MsgErr } from '@/utils/Message'
import { allMV } from '../../../api/MVapi'
import { onMounted, ref, reactive } from 'vue'
import { singerLanguageMV, sortMV, typeMV } from '../../../api/constant'
export default {
    name: 'MvPage',
    components: {
        MVBox
    },
    setup() {
        const filterLoading = ref(false)
        const artistsArr = ref([])
        const langIndex = ref(0)
        const typeIndex = ref(0)
        const letterIndex = ref(0)
        const songerObj = reactive({
            offset: 0,
            type: '',
            area: '',
            order: '',
            limit: 10
        })
        // 点击语种
        const clickLang = (i, name) => {
            songerObj.area = name
            langIndex.value = i
            getAllMV(songerObj)
        }
        // 点击分类
        const clickType = (i, name) => {
            songerObj.type = name
            typeIndex.value = i
            getAllMV(songerObj)
        }
        // 点击字母
        const clickLetter = (i, name) => {
            letterIndex.value = i
            songerObj.order = name
            getAllMV(songerObj)
        }
        // 获取歌手
        const getAllMV = (songerObj, isScoll) => {
            filterLoading.value = true
            if (songerObj.type === '' && songerObj.area === '' && songerObj.order === '' && isScoll !== 'isScoll') {
                songerObj.offset = 0
            }
            allMV(songerObj).then(res => {
                if (!(res.data.code === 200)) {
                    $MsgErr(res.data.code)
                }
                res.data.data.forEach((item, i) => {
                    item.duration = moment(item.duration).format('mm:ss')
                    item.songIndex = i
                })
                if (isScoll === 'isScoll') {
                    let arr = [...artistsArr.value, ...res.data.data]
                    artistsArr.value = arr
                } else {
                    artistsArr.value = res.data.data
                }
                filterLoading.value = false
            })
        }
        // 滚动底部加载
        const load = () => {
            songerObj.offset = songerObj.offset + 10
            getAllMV(songerObj, 'isScoll')
        }
        onMounted(() => {
            getAllMV(songerObj)
        })
        return { singerLanguageMV, sortMV, typeMV, clickLang, clickType, clickLetter, load, filterLoading, artistsArr, langIndex, typeIndex, letterIndex }
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

/deep/.boxContain {
    .box {
        margin: 10px 0 10px 0px;

    }
}

.infinite-list {
    width: 950px;

    .singerContainer {
        width: 900px;

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
                width: 46px;
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