<template>
    <!-- 热评 -->
    <!-- <el-scrollbar height="425px" ref="scrollbarRef" @scroll="scroll"> -->
    <div class="commentList" v-if="forwards">
        <div class="hotCommentList" v-for="(item, i) in forwards" :key="i">
            <!-- 头像 -->
            <div class="commentCreatorAvatar clickUser">
                <img class="pic" :src="item.json.comment.user.avatarUrl" alt="">
            </div>
            <!-- 评论 -->
            <div class="commentMain">
                <div style="display:flex ; justify-content:space-between ; width: 296px;"> <span
                        class="commentUserNickName clickUser">{{ item.json.comment.user.nickname }}:
                    </span>
                    <span class="commentCreatedTime">{{ item.time }}</span>
                </div>
                <div class="Content">{{ item.json.comment.content }}
                </div>
                <!-- 回复 -->
                <div class="replied">
                    <!-- 是否有发布单曲 -->
                    <div class="repliedItem">
                        <img class="pic" :src="item.json.resource.coverImgUrl" alt="">

                        <div class="title">
                            <div class="name">{{ item.json.resource.name }}</div>
                            <div class="singer">by {{ item.json.resource.creator.nickname }}</div>
                        </div>
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
    <!-- </el-scrollbar> -->
</template>
<script>
import { watch } from 'vue'

export default {
    name: 'forwardsContent',
    components: {

    },
    props: {
        forwards: {
            type: Array,
            default: () => []
        }
    },
    setup(props) {
        watch(() => props.forwards, () => {
            console.log(props.forwards)
        }, { immediate: true })
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

                width: 100%;
                background-color: #F5F5F5;
                display: flex;
                align-items: center;
                margin-top: 10px;

                .repliedItem {
                    margin-left: 10px;
                    display: flex;
                    align-items: center;

                    .pic {
                        margin: 10px 0 10px 0;
                        max-width: 60px;
                        max-height: 60px;
                    }

                    .title {
                        margin-left: 10px;
                    }
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