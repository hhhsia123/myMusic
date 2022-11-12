<template>
    <!-- 热评 -->
    <el-scrollbar height="425px" ref="scrollbarRef" @scroll="scroll">
        <div class="commentList" v-if="comments">
            <div class="hotCommentList" v-for="(item, i) in comments" :key="i">
                <!-- 头像 -->
                <div class="commentCreatorAvatar clickUser">
                    <img class="pic" :src="item.user.avatarUrl" alt="">
                </div>
                <!-- 评论 -->
                <div class="commentMain">
                    <div style="display:flex ; justify-content:space-between ; width: 296px;"> <span
                            class="commentUserNickName clickUser">{{ item.user.nickname }}:
                        </span>
                        <span class="commentCreatedTime">{{ item.time }}</span>
                    </div>
                    <div class="Content">{{ item.content }}
                    </div>
                    <!-- 回复 -->
                    <div class="replied">
                        <div class="repliedItem">
                            <span class="repliedContent">{{ item.beRepliedContent }}
                            </span>
                        </div>
                    </div>
                    <!-- 评论底部 -->
                    <div class="commentBottom">
                        <div class="commentIcons">
                            <i class="icon iconfont icon-pinglun"> 回复</i>

                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="noContent" v-else>暂无内容</div>
    </el-scrollbar>
</template>
<script>
// import { watch } from 'vue'

// import { ref } from 'vue'

export default {
    name: 'commentContent',
    components: {

    },
    props: {
        comments: {
            type: Array,
            default: () => []
        }
    },
    setup(props, { emit }) {
        // const lastTimer=ref(null)
        // const scrollTimer = ref(null)
        // const privacyTarget = ref(null)
        // const scroll = ({ scrollTop }) => {
        //     if ((privacyTarget.value.clientHeight - 415) === parseInt(scrollTop)) {
        //         // 节流
        //         if (scrollTimer.value !== null) {
        //             clearTimeout(scrollTimer.value)
        //         }
        //         scrollTimer.value = setTimeout(() => {
        //             console.log('加载数据啦---')
        //             lastTimer.value = offset.value + 8
        //             emit('change', offset.value)
        //         }, 500)
        //     }
        // }
        return { scroll }
    }
}
</script>
<style lang="less" scoped>
.commentList {
    padding: 10px 20px 30px 20px;

    .example-pagination-block {
        display: flex;
        justify-content: center;
        margin-top: 15px;
        margin-bottom: 20px;

        .el-pager li {
            outline: none;
        }

        /deep/.el-pagination.is-background .el-pager li:not(.is-disabled).is-active {
            background-color: @priceColor;
        }

        /deep/.el-pagination.is-background .el-pager li:not(.is-disabled):hover {
            color: @priceColor ;
        }
    }

    .hotCommentList {
        display: flex;
        border-bottom: 2px solid #eee;
        padding-bottom: 10px;
        margin-top: 15px;

        .commentCreatorAvatar {
            .pic {
                max-width: 40px;
                max-height: 40px;
                border-radius: 50%;
                flex: 1;
                margin-top: 10px;
            }

        }

        .commentMain {
            margin-left: 15px;
            line-height: 30px;
            width: 291px;

            .commentCreatedTime {
                color: #DFCFDF;
                font-size: 10px;
            }

            .replied {
                background-color: #F5F5F5;

                height: 40px;
                line-height: 40px;

                .repliedContent {
                    margin-left: 15px;
                }
            }

            .commentBottom {

                margin-top: 10px;

                .commentIcons {
                    display: flex;
                    width: 291px;
                    justify-content: flex-end;

                }
            }
        }
    }

}

.noContent {
    position: absolute;
    transform: translate(-50%, -50%);
    left: 50%;
    top: 50%;
    font-weight: 700;

}
</style>