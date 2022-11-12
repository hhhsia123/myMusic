<template>
    <div v-if="!(JSON.stringify(collectionObj) === '{}')">
        <h3 class="empty" v-if="collectionObj.count === 0">暂无收藏专辑 </h3>
        <h3 style="margin-bottom: 10px;" v-else>收藏的专辑({{ collectionObj.count }})</h3>
        <div class="albumsContainer" v-for="(item, i) in collectionObj.collectionArr" :key="i">
            <RouterLink class="link" :to="`/albumDetail/${item.id}`" sty>
                <img class="pic" :src="item.picUrl + '?param=200y200'" alt="">
                <div class="nameContainer">
                    <span class="uname">{{ item.name }}</span>
                    <span class="tname">{{ item.artists.name }}</span>
                </div>
            </RouterLink>

        </div>
    </div>
    <div v-if="!(JSON.stringify(albumsObj) === '{}')">
        <h3 style="margin-bottom: 10px;"> 找到 {{ albumsObj.albumCount }} 张专辑</h3>
        <div class="albumsContainer" v-for="(item, i) in albumsObj.albums" :key="i">
            <RouterLink class="link" :to="`/albumDetail/${item.id}`" sty>
                <img class="pic" :src="item.picUrl + '?param=200y200'" alt="">
                <div class="nameContainer">
                    <span class="uname">{{ item.name }}</span>
                    <span class="tname">{{ item.artist.name }}</span>
                </div>
            </RouterLink>

        </div>
        <!-- 分页 -->
        <div class="example-pagination-block">

            <el-pagination @click="clickButtom" small background layout="prev, pager, next"
                :total="albumsObj.albumCount" @size-change="handleSizeChange" @current-change="handleCurrentChange"
                class="mt-4" v-model:currentPage="songAlbumObj.currentPage" v-model:page-size="songAlbumObj.limit" />
        </div>
    </div>
</template>
<script>

import { reactive, watch, ref } from 'vue'
export default {
    name: 'searchAlbum',
    components: {},
    props: {
        albums: {
            type: Object,
            default: () => { }
        }
    },
    setup(props, { emit }) {
        const collectionObj = ref({})
        const albumsObj = ref({})
        const songAlbumObj = reactive({
            offset: 0,
            currentPage: 1,
            limit: 10
        })
        watch(() => props.albums, (newVal) => {
            // 监听是搜索的还是我的收藏的
            if (newVal.collection) {
                collectionObj.value = newVal
                songAlbumObj.value = {}
            } else {
                albumsObj.value = newVal
                collectionObj.value = {}
            }
        }, { immediate: true, deep: true })
        const handleCurrentChange = (newValue) => {
            console.log(newValue)
            if (newValue === 1) {
                songAlbumObj.offset = (newValue * 0)
                songAlbumObj.currentPage = newValue
                emit('change', songAlbumObj.offset)
            } else {
                songAlbumObj.offset = ((newValue - 1) * 10)
                songAlbumObj.currentPage = newValue
                emit('change', songAlbumObj.offset)
                if (songAlbumObj.offset >= albumsObj.value.albumCount) {
                    songAlbumObj.offset = albumsObj.value.albumCount
                }
            }
        }
        return { handleCurrentChange, albumsObj, songAlbumObj, collectionObj }
    }
}
</script>
<style lang="less" scoped>
.example-pagination-block {
    margin-left: 54%;
    height: 50px;
    transform: translateX(-50%);
    margin-top: 30px;

    .el-pagination {
        margin-top: 15px;
    }

    /deep/.el-pager li {
        outline: none;
    }

    /deep/ .el-pagination.is-background .el-pager li:not(.is-disabled).is-active {
        background-color: @priceColor;
    }

    /deep/.el-pagination.is-background .el-pager li:not(.is-disabled):hover {
        color: @priceColor ;
    }
}

.empty {
    // position: absolute;
    left: 50%
}

.albumsContainer {

    .link {
        display: flex;
        align-items: center;
        margin: 8px 0 8px 0;

        &:hover {
            background-color: #FAFAFA;
        }

        .pic {
            max-width: 80px;

            border-radius: 10px;
        }

        .nameContainer {
            width: 50%;
            display: flex;
            justify-content: space-between;

            .tname {
                transform: translateX(80%);
            }

            .uname {
                margin-left: 10px;
            }
        }

    }

}
</style>