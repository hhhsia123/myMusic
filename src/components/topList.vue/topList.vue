<template>

    <el-scrollbar height="465px" v-loading="loading">
        <div class="topContainer">
            <h2 style="margin-bottom: 20px;">官方榜</h2>
            <div class="topList" v-for="(item, i) in songData" :key="i">
                <img class="coverImgUrl" :src="item.coverImgUrl" alt="">
                <div class="column">
                    <el-table :data="item.tracks" stripe style="width: 650px" :cell-class-name="cellStyke">
                        <el-table-column type="index" width="30" />
                        <el-table-column prop="name" width="550" />
                        <el-table-column prop="ar[0].name" width="70" />
                    </el-table>
                    <RouterLink :to="`/songDetail/${item.id}`">
                        <span class="more" style="margin-top: 10px; display: flex;">查看更多</span>
                    </RouterLink>
                </div>
            </div>
            <!-- 全球榜 -->
            <h2 style="margin-top: 20px;">全球榜</h2>
            <VideoPlay :songData="arrToplist"></VideoPlay>
        </div>
    </el-scrollbar>
</template>
<script>
import VideoPlay from '../../smallComponts/smallBox.vue'
import { songDetail } from '../../api/songDetail'
import { toplist } from '../../api/TopApi'
import { onMounted, ref } from 'vue'
export default {
    name: 'topList',
    components: {
        VideoPlay
    },
    setup() {
        const songData = ref([])
        const arrToplist = ref([])
        const loading = ref(false)
        const newArr = ref([])
        // 获取排行接口
        const getToplist = () => {
            toplist().then(res => {
                console.log(res.data)
                newArr.value = res.data.list.splice(0, 4)
                arrToplist.value = res.data.list
                newArr.value.forEach((item) => {
                    getSongDetail(item.id)
                })
            })
        }
        // 给前3个索引标红
        const cellStyke = (row) => {
            // console.log(row)
            if (row.columnIndex === 0) {
                return 'goodsIndex'
            }
        }
        // 获取歌单详情
        const getSongDetail = (id) => {
            songDetail(id).then((res) => {
                songData.value.push(res.data.playlist)
                songData.value.forEach((item, i) => {
                    songData.value[i].tracks = item.tracks.slice(0, 5)
                })
                // console.log(songData.value)
            })
        }
        onMounted(() => {
            getToplist()
        })
        return { loading, songData, cellStyke, arrToplist }
    }

}
</script>
<style lang="less" scoped>
.topContainer {
    width: 900px;
    height: 500px;
    margin: 0px auto;

    /deep/.boxContain {
        .box {
            margin: 10px 0 10px 0px;

        }

    }

    .topList {
        display: flex;
        justify-content: space-between;
        margin-bottom: 30px;

        .column {
            display: flex;
            flex-direction: column;

            .more {
                &:hover {
                    color: #BC3A3A;
                }
            }

            .el-table {
                thead {
                    display: none;
                }

                /deep/.goodsIndex .cell {
                    color: rgb(188, 58, 58);
                    font-weight: 700;
                }
            }

        }

        .coverImgUrl {
            width: 180px;
            height: 180px;
            border-radius: 10px;
        }
    }
}
</style>