<template>
    <el-autocomplete class="input_border" v-model="state" :fetch-suggestions="querySearchAsync"
        popper-class="myAutocomplete" :debounce="800" :placeholder="dfSearch">
        <!-- 图标 -->
        <template #suffix>
            <el-icon @click="clickSearch">
                <Search />
            </el-icon>
        </template>
        <template #default>
            <!-- 搜索内容/建议 -->
            <div class="suggestContainer" v-if="!(JSON.stringify(suggestObj.data) === '{}')">
                <div class="sc" v-if="!(suggestObj.data === undefined)">
                    <i class="icon iconfont icon-beijingyinle"></i><span>单曲</span>
                    <div class="songs"><span v-for="(item, i) in suggestObj.data.songs" :key="i"
                            @click="searchSong(item, i)">{{ item.name }}-{{
                                    item.artists[0].name
                            }}</span></div>

                    <i class="icon iconfont icon-yonghu1"></i><span>歌手</span>
                    <div class="artists" v-for="(item, i) in suggestObj.data.artists" :key="i">
                        <RouterLink :to="`/singerDetail/${item.id}`"><span>{{ item.name
                        }}</span> </RouterLink>
                    </div>

                    <i class="icon iconfont icon-zhuanji"></i><span>专辑</span>
                    <div class="albums" v-for="(item, i) in suggestObj.data.albums" :key="i">
                        <RouterLink :to="`/albumDetail/${item.id}`"><span>{{ item.name
                        }}-{{ item.artist.name }}</span></RouterLink>
                    </div>
                    <i class="icon iconfont icon-gedan"></i><span>歌单</span>
                    <div class="playlists" v-for="(item, i) in suggestObj.data.playlists" :key="i">
                        <RouterLink :to="`/songDetail/${item.id}`"><span>{{ item.name
                        }}</span></RouterLink>
                    </div>
                </div>
            </div>
            <!-- 搜索top -->
            <div v-else class="searchContianer" @click="handleItemClick('display', '.myAutocomplete')">
                <div class="historySearchContainer">
                    <div class="hisorySearch">搜索历史<i class="icon iconfont icon-lajitong"></i></div>
                    <div class="check" @click="clickAll">查看全部</div>
                </div>
                <div class="tag" :class="{ 'activeTag': isShowAllTag }">
                    <el-tag class="mx-1" closable effect="plain" round
                        v-for="(item, i) in $store.state.showOrHide.historyScore" :key="i" @close="handleClose(item)"
                        @click="clickTag(item)">
                        {{ item }}
                    </el-tag>
                </div>

                <div>热搜榜</div>
                <div class="suggestList" v-for="(item, i) in rearchArr" :key="i">
                    <span class="type">{{ item.index }}</span>
                    <RouterLink :to="`/search/${encodeURIComponent(item.searchWord)}`">
                        <div class="title">
                            <div class="value">{{ item.searchWord }} <img class="pic"
                                    :src="item.iconUrl + '?param=200y200'" alt=""> <span>
                                    {{
                                            item.score
                                    }}</span></div>
                            <span class="link">{{ item.content }}</span>
                        </div>
                    </RouterLink>
                </div>
            </div>
        </template>
    </el-autocomplete>
</template>
<script>
import moment from 'moment'
import { useStore } from 'vuex'
import { search, searchsuggest, defaultSearch } from '../../api/search'
import { Search } from '@element-plus/icons-vue'
import { onMounted, ref, watch, reactive } from 'vue'
import { $MsgErr } from '@/utils/Message'
import { useRouter } from 'vue-router'
export default {
    name: 'searchCp',
    components: {
        Search
    },
    setup() {
        const temp = ref(false)
        const songDetailObj = reactive({})
        const index = ref('')
        const songData = ref([])
        const arrSetList = ref([])
        const router = useRouter()
        const dfSearch = ref('')
        const suggestObj = reactive({
            data: {}
        })
        const keyWords = ref('')
        const isShowAllTag = ref(false)
        const rearchArr = ref([])
        const state = ref('')
        const querySearchAsync = (queryString, callback) => {
            console.log(queryString)
            callback(loadAll())
        }
        const store = useStore()
        // 1输入的时候发请求
        // 2.输入的时候把内容放在数组中显示
        let arrhistory = ref([])
        const clickSearch = () => {
            if (state.value === '' || state.value === undefined) {
                state.value = dfSearch.value
            }
            // 点击搜索把数组追加进去
            arrhistory.value.push(state.value)
            // 把数组倒叙
            arrhistory.value.reverse()
            // 对数组进行去重
            let arrSet = new Set(arrhistory.value)
            arrSetList.value = Array.from(arrSet)
            // 把其内容放入vuex中
            store.commit('showOrHide/history', arrSetList.value)
            // 跳转到搜索详情页面
            router.push('/search/' + encodeURIComponent(state.value))
            state.value = ''
        }
        const loadAll = () => {
            return [1]
        }
        // 播放歌曲
        const searchSong = (item, i) => {
            item.duration = moment(item.duration).format('mm:ss')
            songData.value.push(item)
            if (songData.value.length) {
                store.commit('showOrHide/songlist', songData.value)
            }
            songData.value = []
            // 获取歌曲id 和 index
            index.value = i

            songDetailObj.picUrl = item.artists[0].img1v1Url
            songDetailObj.title = item.artists[0].name
            songDetailObj.name = item.name
            songDetailObj.id = item.id
            songDetailObj.uid = ''
            songDetailObj.rowsIndex = index.value
            store.commit('showOrHide/picUrl', songDetailObj)
            // audio.value.play()
            temp.value = true
            store.commit('showOrHide/discisShow', temp.value)
        }
        // 删除标签
        const handleClose = (tag) => {
            const index = store.state.showOrHide.historyScore.findIndex(item => {
                return item === tag
            })
            arrSetList.value.splice(index, 1)
            store.commit('showOrHide/history', arrSetList.value)
        }
        // 点击把值赋值给搜索框
        const clickTag = (tagName) => {
            dfSearch.value = tagName
        }
        // 查看全部历史记录
        const clickAll = () => {
            isShowAllTag.value = !isShowAllTag.value
        }
        // 获取搜索建立
        const getSearch = () => {
            search().then(res => {
                if (res.data.code !== 200) {
                    $MsgErr(res.data.message)
                }
                console.log(res.data.data)
                // 添加一个索引
                res.data.data.forEach((item, i) => {
                    item.index = i + 1
                })
                rearchArr.value = res.data.data
            })
        }
        // 输入关键词获得搜索建议
        const getsearchsuggest = (newVal) => {
            searchsuggest(newVal).then(res => {
                console.log(res.data.result)
                if (newVal === '') {
                    suggestObj.data = {}
                } else {
                    suggestObj.data = res.data.result
                }
            })
        }
        watch(() => state.value, (newVal) => {
            if (!(newVal === undefined)) {
                newVal.trim()
                keyWords.value = newVal
                getsearchsuggest(newVal)
            }
        }, { immediate: true })
        // 点击继续显示
        const handleItemClick = (item, classname) => {
            setTimeout(() => {
                let dom = document.querySelector(classname)
                dom.style.display = item
            }, 1000)
        }
        onMounted(() => {
            getSearch()
            defaultSearch().then(res => {
                dfSearch.value = res.data.data.showKeyword
            })
        })
        return { state, querySearchAsync, rearchArr, clickSearch, clickTag, store, searchSong, clickAll, isShowAllTag, handleItemClick, suggestObj, dfSearch, handleClose }
    }
}
</script>
<style lang="less" scoped>
.myAutocomplete {
    display: block !important;
    width: 400px;
}

.suggestContainer {
    .sc {
        i {
            margin: 10px;
        }

        div {
            display: flex;
            flex-direction: column;
            width: 400px;

            span {
                padding-left: 20px;
                height: 40px;

                &:hover {
                    background-color: #fff;
                }
            }

        }
    }
}

.searchContianer {
    margin: 10px 20px 0 20px;

    .historySearchContainer {
        display: flex;
        justify-content: space-between;

    }

    .tag {
        display: flex;
        flex-wrap: wrap;
        margin: 3px 0 10px 0;

        &.activeTag {
            height: 75px;
            overflow: hidden;
        }

        /deep/.el-tag {
            --el-tag-text-color: #333333;
            border-color: #333333;
            --el-tag-hover-color: #ff0000;
            margin: 10px 10px 0px 0;
        }
    }

    .suggestList {
        display: flex;
        align-items: center;
        width: 400px;
        margin-left: -20px;

        &:hover {
            background-color: #fff;
        }

        .type {
            color: @priceColor;
            margin: 0 20px 0 20px;
        }

        .title {
            display: flex;
            flex-direction: column;
            justify-content: center;
            height: 70px;

            .value {
                color: #313131;

                .pic {
                    max-width: 15px;
                    margin: 0 5px 0 5px;
                }

                span {
                    color: #DBDBDB;
                    font-size: 10px;
                }
            }

            .link {
                color: #919191;
                margin-top: -10px;
            }
        }
    }
}
</style>