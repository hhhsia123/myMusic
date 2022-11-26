<template>
    <div class="aside">
        <!-- 列表上 -->
        <el-scrollbar height="534px">
            <a v-for="(item, i) in asideCateGory" :key="i" class="scrollbar" @click="fontBig(i)"
                :class="{ 'active': index === i && isShow === true }">{{ item }}
            </a>
            <div class="myMusic">我的音乐</div>
            <!-- 列表下 -->
            <div class="iconUname" v-for="(item, i) in asidemousic" :key="i">
                <el-icon class="icon" v-if="i === 2">
                    <Stopwatch />
                </el-icon>
                <i class=" icon iconfont  icon-caijiashoucang" style="top: 15px;font-size: 14px;" v-if="i === 3"> </i>

                <el-icon class="icon" v-if="i === 0">
                    <Star />
                </el-icon>
                <el-icon class="icon" v-if="i === 1">
                    <UploadFilled />
                </el-icon>
                <a class="scrollbar-item " @click="fontButtomBig(i)"
                    :class="{ 'active': indexButtom === i && isShow === false }">{{ item.uname }}</a>
            </div>
            <!-- 列表菜单 -->
            <el-menu default-active="2" class="el-menu-vertical-demo">
                <el-sub-menu index="1">
                    <template #title>

                        <span style="margin-left: 5px;">收藏的歌单</span>
                    </template>
                    <div class="elMenuItem" v-for="(item, i) in playlistUserArr" :key="i">
                        <RouterLink :to="`/songDetail/${item.id}`">
                            <i class=" iconfont  icon-music_playlist"></i>

                            <el-menu-item class="el-menu-item is-active " :class="{ 'activered ': i === activeIndex }"
                                index="1-1" @click="changeRed(i)">
                                <span> {{ item.name }}</span>
                            </el-menu-item>
                        </RouterLink>
                    </div>
                </el-sub-menu>
            </el-menu>
        </el-scrollbar>
    </div>
</template>
<script>

// vue3引入常量
import { $MsgErr, $MsgWarn } from '@/utils/Message'
import { userList } from '../api/songDetail'
import { useRouter } from 'vue-router'
import { asideCateGory, asidemousic } from '../api/constant'
// vue3导入图标
import { Star, UploadFilled, Stopwatch } from '@element-plus/icons-vue'
import { ref, watch } from 'vue'
import { useStore } from 'vuex'

export default {
    name: 'appAside',
    components: {
        Star,
        UploadFilled,
        Stopwatch

    },
    setup() {
        const playlistUserArr = ref([])
        const store = useStore()
        const router = useRouter()
        let index = ref(0)
        let indexButtom = ref(0)
        let isShow = ref(true)
        const activeIndex = ref('')
        const likeMusicArr = ref([])
        // 点击字体变大同时下面的内容需要取消
        const fontBig = (i) => {
            index.value = i
            isShow.value = true
            activeIndex.value = ''
            // 根据索引路由跳转
            store.commit('showOrHide/asideIndex', i)
            switch (i) {
                case 0:
                    router.push('/')
                    break
                case 1:
                    router.push('/localLoad')
                    break
                case 2:
                    router.push(`/videoPlay/${i}`)
                    break
                case 3:
                    router.push(`/follow/${i}`)
                    break
                case 4:
                    router.push(`/privacy/${i}`)
            }
        }
        const changeRed = (i) => {
            activeIndex.value = i
            isShow.value = ''
        }
        watch(() => store.state.showOrHide.asideIndex, (newValue) => {
            index.value = newValue
            fontBig(newValue)
        }, { immediate: true })
        // 监听用户是否已经登录
        watch(() => store.state.user.profile.userId, (newValue) => {
            if (newValue !== '') {
                userList(newValue).then(res => {
                    if (res.data.code !== 200) {
                        $MsgErr(res.data.code)
                    }
                    console.log(res.data.playlist)
                    // 遍历数组 找出我喜欢的歌单
                    if (res.data.playlist !== undefined) {
                        let likeMusic = res.data.playlist.find(item => {
                            return item.creator.nickname === store.state.user.profile.nickname
                        })
                        likeMusicArr.value.push(likeMusic)
                        let index = res.data.playlist.findIndex(item => {
                            return item.creator.nickname === store.state.user.profile.nickname
                        })
                        res.data.playlist.splice(index, 1)
                        playlistUserArr.value = res.data.playlist
                        console.log(playlistUserArr.value)
                    }
                })
            }
        }, { immediate: true, deep: true })
        // 下面字体变大同时上面的内容需要取消
        const fontButtomBig = (i) => {
            indexButtom.value = i
            isShow.value = false
            activeIndex.value = ''

            switch (i) {
                case 0:
                    if (store.state.user.profile.cookie) {
                        router.push(`/songDetail/${likeMusicArr.value[0].id}`)
                    } else {
                        $MsgWarn('亲 需要登录才可以访问哦~')
                    }
                    break
                case 1:
                    router.push('/localLoad')
                    break
                case 2:
                    router.push('/recentPlays')
                    break
                case 3:
                    router.push('/MyCollection')
                    break
                case 4:
                    router.push(`/privacy/${i}`)
            }
        }

        return {
            asideCateGory, asidemousic, index, fontBig, fontButtomBig, isShow, indexButtom, playlistUserArr, changeRed, activeIndex
        }
    }
}
</script>
<style lang="less" scoped>
// .scrollbar() {
//     //   display: -ms-flexbox;
//     display: flex;
//     padding-left: 10px;
//     align-items: center;
//     height: 30px;
//     margin: 10px 10px 0 10px;
//     text-align: center;
//     border-radius: 4px;
//     color: #373737;
//     cursor: pointer;
//     width: 100%;

//     &:hover {
//         background-color: #E0E0E0;
//         transition: all 0.5s;
//     }

//     &.active {
//         color: @priceColor;
//         font-weight: 900;
//         font-size: 18px;
//     }
// }

.aside {
    /deep/ .el-scrollbar .el-menu-vertical-demo {
        --el-menu-hover-bg-color: #E0E0E0;
        border-right: none;
    }

    /deep/.el-scrollbar {
        width: 200px;
        border-right: 2px solid #E0E0E0;
        background-color: rgb(255, 255, 255);

        /deep/.el-scrollbar__thumb {
            display: none !important;
        }

        .iconUname {
            display: flex;
            align-items: center;
            position: relative;

            .icon {
                position: absolute;
                top: 18px;
                left: 22px;
            }

            .scrollbar-item {
                display: flex;
                padding-left: 10px;
                align-items: center;
                height: 30px;
                margin: 10px 10px 0 10px;
                text-align: center;
                border-radius: 4px;
                color: #373737;
                cursor: pointer;
                width: 100%;

                &:hover {
                    background-color: #E0E0E0;
                    transition: all 0.5s;
                }

                &.active {
                    color: @priceColor;
                    font-weight: 900;
                    font-size: 18px;
                }

                padding-left: 33px;
            }
        }

        .el-menu-vertical-demo {
            --el-menu-hover-bg-color: #E0E0E0;

            .elMenuItem {
                display: flex;
                align-items: center;
                position: relative;

                i {
                    position: absolute;
                    top: 15px;
                    left: 20px;
                    z-index: 99;
                }

                /deep/.el-menu-item {
                    .overflow();
                }

                /deep/.el-menu-item.is-active {
                    width: 202px;
                    color: #201f1f;

                    &:hover {
                        background-color: #E0E0E0;
                    }

                    &.activered {
                        color: rgb(221, 35, 35);
                        font-weight: 700;
                        font-size: 18px;
                    }
                }
            }
        }

        .myMusic {
            color: #9F9F9F;
            display: flex;
            padding-left: 10px;
            align-items: center;
            height: 20px;
            margin: 10px 10px 0 10px;
            text-align: center;
            border-radius: 4px;
            font-size: 12px;
        }

        .scrollbar {
            display: flex;
            padding-left: 10px;
            align-items: center;
            height: 30px;
            margin: 10px 10px 0 10px;
            text-align: center;
            border-radius: 4px;
            color: #373737;
            cursor: pointer;
            width: 100%;

            &:hover {
                background-color: #E0E0E0;
                transition: all 0.5s;
            }

            &.active {
                color: @priceColor;
                font-weight: 900;
                font-size: 18px;
            }

        }
    }
}
</style>