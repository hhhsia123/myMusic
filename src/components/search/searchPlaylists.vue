<template>
    <h3 style="margin-bottom: 10px;"> 找到 {{ searchPlaylistObj.playlistCount }} 个歌单</h3>
    <div class="palyListContainer">
        <smallBox :songData="searchPlaylistObj.playlists"></smallBox>
    </div>
    <!-- 分页 -->
    <div class="example-pagination-block">

        <el-pagination @click="clickButtom" small background layout="prev, pager, next"
            :total="searchPlaylistObj.playlistCount" @size-change="handleSizeChange"
            @current-change="handleCurrentChange" class="mt-4" v-model:currentPage="searchPlaylistObj.currentPage"
            v-model:page-size="searchPlaylistObj.limit" />
    </div>
</template>
<script>
import smallBox from '../../smallComponts/smallBox.vue'
import { reactive, watch } from 'vue'
export default {
    name: 'searchPlaylists',
    components: {
        smallBox
    },
    props: {
        playlist: {
            type: Object,
            default: () => { }
        }
    },
    setup(props, { emit }) {
        const searchPlaylistObj = reactive({
            playlistCount: null,
            playlists: [],
            offset: 0,
            currentPage: 1,
            limit: 10
        })
        watch(() => props.playlist, (newVal) => {
            searchPlaylistObj.playlistCount = newVal.playlistCount
            searchPlaylistObj.playlists = newVal.playlists
        }, { immediate: true, deep: true })
        const handleCurrentChange = (newValue) => {
            console.log(newValue)
            if (newValue === 1) {
                searchPlaylistObj.offset = (newValue * 0)
                searchPlaylistObj.currentPage = newValue
                emit('change', searchPlaylistObj.offset)
            } else {
                searchPlaylistObj.offset = ((newValue - 1) * 10)
                searchPlaylistObj.currentPage = newValue
                emit('change', searchPlaylistObj.offset)
                if (searchPlaylistObj.offset >= searchPlaylistObj.playlistCount) {
                    searchPlaylistObj.offset = searchPlaylistObj.playlistCount
                }
            }
        }
        return { searchPlaylistObj, handleCurrentChange }
    }
}
</script>
<style lang="less" scoped>
/deep/.boxContain {
    /deep/.box {
        margin: 8px 0 10px 0px;
    }
}

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
</style>