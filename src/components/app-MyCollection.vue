<template>
    <el-scrollbar height="534px">
        <div class="tabsContainer">
            <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
                <el-tab-pane label="歌手" name="second">
                    <!-- 歌手 -->
                    <searchSinger :artists="ArtistObj"></searchSinger>
                </el-tab-pane>
                <el-tab-pane label="专辑" name="third">
                    <searchAlbum :albums="collection" @change="($event) =>
                    getCloudSearch(keyWorder, 10, $event)"></searchAlbum>
                </el-tab-pane>
                <el-tab-pane label="视频" name="four">
                    <searchVideo :video="MvSubListObj" :filterLoading="lazyLoad" @change="($event) =>
                    getCloudSearch(keyWorder, 1014, $event)"></searchVideo>
                </el-tab-pane>
                <el-tab-pane label="专栏" name="five">
                    <searchPlaylists :playlist="playlistsArr" @change="($event) =>
                    getCloudSearch(keyWorder, 1000, $event)"></searchPlaylists>
                </el-tab-pane>
            </el-tabs>
        </div>
    </el-scrollbar>

</template>
<script>
import searchVideo from '../components/search/searchVideo.vue'
import searchSinger from '../components/search/searchSinger.vue'
import searchAlbum from '../components/search/searchAlbum.vue'
import { $MsgErr } from '@/utils/Message'
import { onMounted, reactive, ref } from 'vue'
import { myCollectionApi, artistApi, mvSubList } from '../api/myCollection'
export default {
    name: 'MyCollection',
    components: {
        // searchSongSheet,
        // searchSinger,
        searchAlbum,
        searchSinger,
        searchVideo
        // searchVideo,
        // searchPlaylists
    },
    setup() {
        const activeName = ref('second')
        const collection = reactive({
            collection: 'collection',
            count: null,
            collectionArr: []

        })
        const ArtistObj = reactive({
            Artist: 'Artist',
            count: null,
            ArtistArr: []

        })
        const MvSubListObj = reactive({
            MvSubList: 'MvSubList',
            count: null,
            MvSubListArr: []

        })
        // 专辑接口
        const getMyCollectionApi = () => {
            myCollectionApi().then(res => {
                if (res.data.code !== 200) {
                    $MsgErr('请求失败')
                }
                console.log(res.data)
                collection.count = res.data.count
                collection.collectionArr = res.data.data
            })
        }
        // 获取歌手接口
        const getArtistApi = () => {
            artistApi().then(res => {
                if (res.data.code !== 200) {
                    $MsgErr('请求失败')
                }
                ArtistObj.count = res.data.count
                ArtistObj.ArtistArr = res.data.data
            })
        }
        // 获取视频mv接口
        const getMvSubList = () => {
            mvSubList().then(res => {
                if (res.data.code !== 200) {
                    $MsgErr('请求失败')
                }
                MvSubListObj.count = res.data.count
                MvSubListObj.MvSubListArr = res.data.data
            })
        }

        // 发请求
        // const getCloudSearch = () => {
        //     lazyLoad.value = true
        //     cloudSearch(val, type, offset).then(res => {
        //         if (res.data.code !== 200) {
        //             $MsgErr('请求失败')
        //         }
        //         if (type === 1) {
        //             res.data.result.songs.forEach((item, i) => {
        //                 item.dt = moment(item.dt).format('mm:ss')
        //                 item.songIndex = i
        //             })
        //             console.log(res.data.result)
        //             songSheetObj.songCount = res.data.result.songCount
        //             songSheetObj.songs = res.data.result.songs
        //         } else if (type === 100) {
        //             console.log(res.data.result)
        //             artistsArr.value = res.data.result
        //         } else if (type === 10) {
        //             albumsArr.value = res.data.result
        //         } else if (type === 1014) {
        //             res.data.result.videos.forEach((item, i) => {
        //                 item.duration = moment(item.durationms).format('mm:ss')
        //                 item.songIndex = i
        //             })
        //             lazyLoad.value = false
        //             videoArr.value = res.data.result
        //         } else if (type === 1000) {
        //             playlistsArr.value = res.data.result
        //         }
        //     })
        // }
        onMounted(() => {
            // 获取我的专辑
            getMyCollectionApi()
            getArtistApi()
        })
        const handleClick = (tab) => {
            // 判断是什么分类发什么请求

            switch (tab.props.name) {
                case 'first':
                    break
                case 'second':
                    getArtistApi()
                    break
                case 'third':
                    getMyCollectionApi()
                    break
                case 'four':
                    getMvSubList()
                    break
                case 'five':
                    // getCloudSearch(keyWorder.value, 1000)
                    break
            }
        }

        return { collection, ArtistObj, handleClick, activeName, MvSubListObj }
    }
}

</script>
<style lang="less" scoped>
.tabsContainer {
    display: flex;
    margin: 30px 0 0 30px;
    width: 970px;
    height: 540px;
    position: relative;

    /deep/.empty {
        // position: absolute;
        left: 40%;
        top: 50%;
        position: relative;
        margin-top: 200px;
    }

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
</style>