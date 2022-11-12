<template>
    <el-scrollbar height="200px">
        <div v-for="(item, i) in emojiArr" :key="i">
            <span class="emoji" v-for="(list, i) in item.iconArr" :key="i" @click="emojiClick(list.icon)">
                {{ list.icon }}
            </span>
        </div>
    </el-scrollbar>

</template>
<script>

import { emojiArr } from '../utils/emoji'
export default {
    name: 'emoJi',
    components: {

    },
    emits: ['emoJival'],
    setup(props, { emit }) {
        const emojiClick = (val) => {
            emit('emoJival', val)
        }
        return { emojiArr, emojiClick }
    }
}
</script>
<style lang="less" scoped>
.emoji {
    display: inline;
    margin: 5px;
    cursor: pointer;
}
</style>