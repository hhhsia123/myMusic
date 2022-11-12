<template>
    <div v-if="!(JSON.stringify(artistsObj) === '{}')">
        <h3 style="margin-bottom: 10px;"> 找到 {{ artistsObj.artistCount }} 个歌手</h3>
        <div class="singerContainer" v-for="(item, i) in artistsObj.artists" :key="i">
            <RouterLink :to="`/singerDetail/${item.id}`"> <img class="pic" :src="item.img1v1Url + '?param=200y200'"
                    alt="">
                <span class="uname">{{ item.name }}</span>
            </RouterLink>

        </div>
    </div>
    <div v-if="!(JSON.stringify(collectSingerObj) === '{}')">
        <h3 class="empty" v-if="collectSingerObj.count === 0">暂无收藏专辑 </h3>
        <h3 style="margin-bottom: 10px;" v-else> 收藏的歌手 ({{ collectSingerObj.count }}) </h3>
        <div class="singerContainer" v-for="(item, i) in collectSingerObj.ArtistArr" :key="i">
            <RouterLink :to="`/singerDetail/${item.id}`"> <img class="pic" :src="item.img1v1Url + '?param=200y200'"
                    alt="">
                <span class="uname">{{ item.name }}</span>
            </RouterLink>

        </div>
    </div>
</template>
<script>
import { watch, ref } from 'vue'
export default {
    name: 'searchSinger',
    components: {

    },
    props: {
        artists: {
            type: Object,
            default: () => { }
        }
    },
    setup(props) {
        const artistsObj = ref({})
        const collectSingerObj = ref({})
        watch(() => props.artists, (newvlue) => {
            if (newvlue.Artist === 'Artist') {
                collectSingerObj.value = newvlue
                artistsObj.value = {}
            } else {
                artistsObj.value = newvlue
                collectSingerObj.value = {}
            }
        }, { immediate: true, deep: true })
        return { artistsObj, collectSingerObj }
    }
}
</script>
<style lang="less" scoped>
.empty {
    position: relative;
}

.singerContainer {
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

    .uname {
        margin-left: 10px;
    }
}
</style>