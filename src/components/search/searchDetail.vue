<template>
    <el-scrollbar height="534px">
        <div class="searchDetail">
            <div class="singerDetail">
                <h2 style="margin-bottom: 15px;">搜索 {{ keyWorder }}</h2>
                <span style="color: #676767;">你可能感兴趣的</span>
                <div style="display: flex; align-items:center ;">
                    <RouterLink :to="`/songDetail/${item.id}`" v-for="(item, i) in playlistArr" :key="i">
                        <div class="multimatchContainer">
                            <img class="pic" :src="item.coverImgUrl + '?param=200y200'" alt="">
                            <div class="singerText">歌单: {{ item.name }}</div>
                        </div>
                    </RouterLink>
                    <RouterLink :to="`/singerDetail/${item.id}`" v-for="(item, i) in artists" :key="i">
                        <div class="multimatchContainer">
                            <img class="pic" :src="item.img1v1Url + '?param=200y200'" alt="">
                            <div class="singerText">歌手: {{ item.name }}</div>
                        </div>
                    </RouterLink>
                </div>

            </div>
            <!--标签页  -->
            <!--   <div style="height: 26px;">找到123首歌</div> -->
            <div class="tabsContainer">
                <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
                    <el-tab-pane label="单曲" name="first">
                        <!-- 单曲 -->
                        <searchSongSheet :songSheet="songSheetObj" @change="($event) =>
                        getCloudSearch(keyWorder, 1, $event)"></searchSongSheet>
                    </el-tab-pane>
                    <el-tab-pane label="歌手" name="second">
                        <!-- 歌手 -->
                        <searchSinger :artists="artistsArr"></searchSinger>
                    </el-tab-pane>
                    <el-tab-pane label="专辑" name="third">
                        <searchAlbum :albums="albumsArr" @change="($event) =>
                        getCloudSearch(keyWorder, 10, $event)"></searchAlbum>
                    </el-tab-pane>
                    <el-tab-pane label="视频" name="four">
                        <searchVideo :video="videoArr" :filterLoading="lazyLoad" @change="($event) =>
                        getCloudSearch(keyWorder, 1014, $event)"></searchVideo>
                    </el-tab-pane>
                    <el-tab-pane label="歌单" name="five">
                        <searchPlaylists :playlist="playlistsArr" @change="($event) =>
                        getCloudSearch(keyWorder, 1000, $event)"></searchPlaylists>
                    </el-tab-pane>
                </el-tabs>
            </div>
        </div>
    </el-scrollbar>
</template>
<script>
import searchPlaylists from '../../components/search/searchPlaylists.vue'
import searchVideo from '../../components/search/searchVideo.vue'
import searchAlbum from '../../components/search/searchAlbum.vue'
import moment from 'moment'
import searchSinger from '../../components/search/searchSinger.vue'
import searchSongSheet from '../../components/search/searchSongSheet.vue'
import { $MsgErr } from '@/utils/Message'
import { watch, ref, reactive } from 'vue'
import { useRoute } from 'vue-router'
import { multimatchApi, cloudSearch } from '../../api/search'
export default {
    name: 'searchDetail',
    components: {
        searchSongSheet,
        searchSinger,
        searchAlbum,
        searchVideo,
        searchPlaylists
    },
    setup() {
        const playlistsArr = ref({})
        const lazyLoad = ref(false)
        const videoArr = ref({})
        const albumsArr = ref({})
        const artistsArr = ref({})
        const artists = ref([])
        const activeName = ref('first')
        const playlistArr = ref([])
        const keyWorder = ref('')
        const route = useRoute()
        const songSheetObj = reactive({
            offset: 0,
            songCount: '',
            songs: []
        })
        const getMultimatchApi = (keyword) => {
            multimatchApi(keyword).then(res => {
                if (res.data.code !== 200) {
                    $MsgErr('请求失败')
                }
                playlistArr.value = res.data.result.playlist
                artists.value = res.data.result.artist
            })
        }
        // 发请求
        const getCloudSearch = (val, type, offset = 0) => {
            lazyLoad.value = true
            cloudSearch(val, type, offset).then(res => {
                if (res.data.code !== 200) {
                    $MsgErr('请求失败')
                }
                if (type === 1) {
                    res.data.result.songs.forEach((item, i) => {
                        item.dt = moment(item.dt).format('mm:ss')
                        item.songIndex = i
                    })
                    console.log(res.data.result)
                    songSheetObj.songCount = res.data.result.songCount
                    songSheetObj.songs = res.data.result.songs
                } else if (type === 100) {
                    console.log(res.data.result)
                    artistsArr.value = res.data.result
                } else if (type === 10) {
                    albumsArr.value = res.data.result
                } else if (type === 1014) {
                    res.data.result.videos.forEach((item, i) => {
                        item.duration = moment(item.durationms).format('mm:ss')
                        item.songIndex = i
                    })
                    lazyLoad.value = false
                    videoArr.value = res.data.result
                } else if (type === 1000) {
                    playlistsArr.value = res.data.result
                }
            })
        }
        watch(() => route.params.id, (newVal) => {
            if (newVal && route.path === `/search/${encodeURIComponent(newVal)}`) {
                keyWorder.value = newVal
                getMultimatchApi(newVal)
                getCloudSearch(newVal, 1)
            }
        }, { immediate: true })
        const handleClick = (tab) => {
            // 判断是什么分类发什么请求
            if (keyWorder.value) {
                switch (tab.props.name) {
                    case 'first':
                        getCloudSearch(keyWorder.value, 1)
                        break
                    case 'second':
                        getCloudSearch(keyWorder.value, 100)
                        break
                    case 'third':
                        getCloudSearch(keyWorder.value, 10)
                        break
                    case 'four':
                        getCloudSearch(keyWorder.value, 1014)
                        break
                    case 'five':
                        getCloudSearch(keyWorder.value, 1000)
                        break
                }
            }
        }
        if (keyWorder.value) {
            switch (activeName.value) {
                case 'first':
                    getCloudSearch(keyWorder.value, 1)
                    break
            }
        }

        return { playlistArr, keyWorder, activeName, songSheetObj, getCloudSearch, handleClick, artistsArr, albumsArr, videoArr, lazyLoad, playlistsArr, artists }
    }
}
</script>
<style lang="less" scoped>
.searchDetail {
    padding: 30px 30px 0 30px;
    width: 1000px;

    .singerDetail {

        .multimatchContainer {
            margin: 20px 0 20px 0;
            display: flex;
            background-color: #F5F5F5;
            height: 80px;
            width: 350px;
            align-items: center;
            margin-left: 15px;

            .pic {
                width: 60px;
                height: 60px;
                border-radius: 50%;
                margin: 0 15px 0 15px;
            }
        }
    }

    .tabsContainer {
        display: flex;

        .el-tabs {
            color: #303133;
            width: 100%;

            .el-tab-pane {
                .el-table {
                    /deep/.cell {
                        white-space: nowrap !important
                    }

                }

            }

            /deep/.el-tabs__item.is-active {
                color: @priceColor !important;
                font-weight: 700;
                font-size: 20px;
            }

            /deep/.el-tabs__active-bar {
                background-color: @priceColor ;
            }

            // 去掉下边框
            /deep/ .el-tabs__nav-wrap {
                &::after {
                    background-color: transparent;
                }
            }

            /deep/.el-tabs__item:hover {
                color: #303133;
            }

        }
    }

}
</style>