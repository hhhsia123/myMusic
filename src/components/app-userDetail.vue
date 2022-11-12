<template>
    <el-scrollbar height="534px">
        <div class="userDetailContainer">
            <div class="userDetailBox" v-if="userDetailData">
                <img class="filter" :src="userDetailData.profile.backgroundUrl" alt="">
                <img class="coverImgUrl + '?param=200y200'" :src="userDetailData.profile.avatarUrl" alt="">
                <div class="rightBox">
                    <h2>{{ userDetailData.profile.nickname }}</h2>
                    <div class="grade">
                        <p>LV{{ userDetailData.level }}</p>
                        <div class="iconButtom" v-if="isShowprivate">
                            <el-button round @click="getPrivate(userDetailData.profile.nickname)">发私信</el-button>
                            <el-button round>关注</el-button>
                        </div>
                    </div>
                    <div class="info">
                        <RouterLink :to="`/userDynamic/${userDetailData.profile.userId}`">
                            <div class="dynamic">
                                <span>{{ userDetailData.profile.eventCount }}</span>
                                <span>动态</span>
                            </div>
                        </RouterLink>
                        <RouterLink :to="`/care/${userDetailData.profile.userId}${1}`">
                            <div class="data-care">
                                <span>{{ userDetailData.profile.follows }}</span>
                                <span>关注</span>
                            </div>
                        </RouterLink>
                        <RouterLink :to="`/care/${userDetailData.profile.userId}${0}`">
                            <div class="data-follows">
                                <span>{{ userDetailData.profile.followeds }}</span>
                                <span>粉丝</span>
                            </div>
                        </RouterLink>
                    </div>
                    <div class="text">
                        <p><span>用户Id: </span> <span>{{ userDetailData.profile.userId }}</span>
                        </p>
                        <p> <span>所在地区: </span>
                            <span>{{ userDetailData.profile.province }}</span>
                            <span>{{ userDetailData.profile.city }}</span>
                        </p>

                        <p><span>简介: </span> <span class="desc" v-if="userDetailData.profile.avatarDetail">{{
                                (userDetailData.profile.avatarDetail.userType === null) ? '什么也没有说点什么把~' :
                                    userDetailData.profile.avatarDetail.userType
                        }}</span><span class="desc" v-else> 暂无介绍</span></p>
                    </div>
                </div>

            </div>
        </div>
        <h2 v-if="userDetailData" class="createrSong">
            {{ userDetailData.profile.nickname }}收藏的歌单({{ songList.length }})</h2>
        <div class="songList">
            <!-- <smallBox :songList="songList"></smallBox> -->
            <div class="box" v-if="songList">

                <ul v-for="(item, i) in songList" :key="i">
                    <li>
                        <RouterLink :to="`/songDetail/${item.id}`">
                            <div class="image">
                                <img class="pic " :src="item.coverImgUrl + '?param=200y200'" alt="">

                                <!-- 遮罩层 -->
                                <div class="masks"></div>
                                <!-- 播放按钮 -->
                                <i class=" playButtom iconfont  icon-bofang-copy"></i>
                            </div>
                            <div class="desc">{{ item.name }}</div>
                            <div class="playCount">
                                <el-icon size="20px" color="#fff">
                                    <VideoPlay />
                                </el-icon>
                                <span style="color: #fff;font-size: 10px;">{{ getPlayCount(item.playCount) }}</span>
                            </div>
                        </RouterLink>
                    </li>
                </ul>
            </div>
        </div>
    </el-scrollbar>
</template>

<script>
import { VideoPlay } from '@element-plus/icons-vue'
import { getPlayCount } from '../utils/mixins'
import pubsub from 'pubsub-js'
import { useStore } from 'vuex'
import { watch, ref } from 'vue'
import { useRoute } from 'vue-router'
import { userDetail, userList } from '../api/songDetail'
// import smallBox from '../smallComponts/smallBox.vue'
import axios from 'axios'
export default {
    mixins: [getPlayCount],
    name: 'userDetail',
    components: {
        VideoPlay
    },
    setup() {
        const userId = ref('')
        const isShowprivate = ref(true)
        const router = useRoute()
        const userDetailData = ref('')
        const songList = ref([])
        let cityData = ref([])
        const store = useStore()
        // 调用用户接口
        const getuserDetail = (newVal) => {
            userDetail(newVal).then(res => {
                console.log(res.data)
                userDetailData.value = res.data
            })
        }
        // 获取用户歌单
        const getuserList = (newVal) => {
            userList(newVal).then(res => {
                console.log(res.data.playlist)
                songList.value = res.data.playlist
            })
        }
        // 获取城市数据
        // 1. 数据在哪里？https://yjy-oss-files.oss-cn-zhangjiakou.aliyuncs.com/tuxian/area.json
        // 2. 何时获取？打开城市列表的时候，做个内存中缓存
        // 3. 怎么使用数据？定义计算属性，根据点击的省份城市展示
        const getcityData = () => {
            return new Promise((resolve, reject) => {
                if (window.cityData) {
                    resolve(window.cityData)
                } else {
                    axios.get('https://yjy-oss-files.oss-cn-zhangjiakou.aliyuncs.com/tuxian/area.json').then(res => {
                        window.cityData = res.data
                        resolve(window.cityData)
                    })
                }
            })
        }
        // 调用私信组件私信内容
        const getPrivate = (nickName) => {
            // 发布消息
            pubsub.publish('visible', true)
            // 第二步到私信内容组件 nickName
            setTimeout(() => {
                pubsub.publish('dialogVisible', { bol: true, id: userId.value })
                pubsub.publish('nickName', nickName)
            })
        }
        // 监听路由id值
        watch(() => router.params.id, (newVal) => {
            console.log(newVal)
            userId.value = newVal
            if (newVal && `/songDetail/userDetail/${newVal}` === router.path) {
                if (store.state.user.profile.userId === parseInt(newVal)) {
                    // 相等就不显示私信按钮
                    isShowprivate.value = false
                }
                getuserDetail(newVal)
                getuserList(newVal)
                // 获取数据
                getcityData().then(res => {
                    cityData.value = res
                    console.log(res)
                    // userDetailData.value.profile.city
                    // userDetailData.profile.province
                })
            }
        }, { immediate: true })

        setTimeout(() => {
            const arrcityprovince = cityData.value.find(item => {
                return item.code === (userDetailData.value.profile.province).toString()
            })
            let arrcity
            if (arrcityprovince) {
                userDetailData.value.profile.province = arrcityprovince.name
                arrcity = arrcityprovince.areaList.find(item => {
                    return item.code === userDetailData.value.profile.city.toString()
                })
                if (arrcity) {
                    userDetailData.value.profile.city = arrcity.name
                } else {
                    console.log(' 没找到city')
                }
            } else {
                console.log('没找到province')
            }
        }, 500)
        return { userDetailData, songList, getPlayCount, isShowprivate, getPrivate }
    }
}

</script>
<style lang="less" scoped>
.info() {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-right: 30px;
    border-right: 1px solid #f1f1f1c9;

    span {
        color: #fff;
    }
}

.createrSong {
    margin: 20px 0 20px 50px;
}

.songList {
    .box {

        width: 920px;
        height: 500px;
        margin: 10px 0 10px 48px;

        ul {
            .hoverShadow;

            li {
                position: relative;
                float: left;
                width: 169px;
                height: 250px;
                margin-right: 15px;
                margin-bottom: 10px;

                &:nth-child(5) {
                    margin-right: 0px;
                }

                &:nth-child(10) {
                    margin-right: 0px;
                }

                .image {
                    background: black url(../assets/imagges/图未加载.png) no-repeat center;

                    &:hover {
                        .masks {
                            opacity: 1;
                        }

                        .playButtom {
                            opacity: 1;
                        }
                    }

                    .playButtom {
                        color: @priceColor;
                        position: absolute;
                        bottom: 83px;
                        right: 15px;
                        opacity: 0;
                        font-size: 35px;
                        transition: all 2s;
                        z-index: 99;
                    }

                    .pic {
                        border-radius: 10px;
                        margin-bottom: 8px;
                    }

                    .masks {
                        display: block;
                        position: absolute;
                        top: 0px;
                        left: 0px;
                        width: 169px !important;
                        height: 169px;
                        background-color: rgba(0, 0, 0, 0.5);
                        border-radius: 10px;
                        opacity: 0;
                        transition: all 1s;
                    }
                }

                .desc {
                    font-size: 13px;
                    color: #373737;
                    font-size: 26rpx;
                    /* 多行文本溢出隐藏，省略号代替 */
                    overflow: hidden;
                    text-overflow: ellipsis;
                    display: -webkit-box;
                    /* 设置对齐模式 */
                    -webkit-box-orient: vertical;
                    /* 设置盒子的行数 */
                    -webkit-line-clamp: 2;
                }

                .playCount {
                    position: absolute;
                    align-items: center;
                    line-height: 30px;
                    top: 2px;
                    left: 2px;
                    width: 80px;
                    height: 30px;
                    background-color: rgba(0, 0, 0, 0.4);
                    border-radius: 30px;

                    .el-icon {
                        vertical-align: middle;
                        margin-left: 3px;
                        margin-right: 5px;
                        margin-bottom: 2px;
                    }
                }

            }
        }
    }

}

.userDetailContainer {
    width: 1000px;
    height: 250px;
    display: flex;
    position: relative;
    box-sizing: border-box;

    .userDetailBox {
        .filter {
            top: 0;
            right: 0;
            width: 100%;
            filter: blur(40px);
            object-fit: cover;
            position: absolute;
        }

        .coverImgUrl {
            position: absolute;
            height: 220px;
            width: 220px;
            border-radius: 50%;
            left: 3%;
            top: 5%;
        }

        .rightBox {
            position: absolute;
            right: 2%;
            top: 5%;
            width: 700px;

            h2 {
                color: #921111;
            }

            .grade {
                display: flex;
                align-items: center;
                justify-content: space-between;
                height: 50px;
                border-bottom: 1px solid #E5E5E5;

                p {
                    width: 60px;
                    height: 25px;
                    background-color: #b5b5b58f;
                    border-radius: 30px;
                    text-align: center;
                    line-height: 25px;
                    color: #f1f1f1c9;
                }
            }

            .info {
                display: flex;
                align-items: center;
                margin-top: 20px;

                div[class^=data] {
                    padding: 0 20px 0 20px;
                    color: #fff;
                    border-right: 1px solid #f1f1f1c9;
                    display: flex;
                    flex-direction: column;
                    align-items: center;

                }

                span {
                    &:hover {
                        color: #ececec;
                    }
                }

                .dynamic {
                    .info();

                    span {
                        &:hover {
                            color: #ececec;
                        }
                    }
                }

                .care {
                    .info();
                }

                .follows {
                    .info();
                }
            }

            .text {
                margin: 20px 0 10px 0px;

                p {
                    display: flex;
                    margin: 10px 0;

                    span {
                        color: #fff;
                        margin-right: 5px;

                    }

                    .desc {
                        display: inline;
                        width: 400px;
                    }

                }
            }
        }

    }
}
</style>