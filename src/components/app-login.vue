<template>
    <!-- 头像 -->
    <RouterLink :to="`/songDetail/userDetail/${$store.state.user.profile.userId}`"
        v-if="store.state.user.profile.avatarUrl">
        <el-avatar class="avarat" :size="40" :src="$store.state.user.profile.avatarUrl">
            <el-icon>
                <UserFilled />
            </el-icon>
        </el-avatar>
    </RouterLink>
    <el-avatar class="avarat" :size="40" :src="UserFilled" v-else>
        <el-icon>
            <UserFilled />
        </el-icon>
    </el-avatar>

    <el-popover placement="bottom" :width="400" :height="400" trigger="click"
        v-if="visible && !$store.state.user.profile.cookie">
        <template #reference>
            <span>未登录</span>
        </template>
        <img class="picIcon" src="../assets/imagges/网易云图标.jpeg" alt="">
        <el-form :model="formLabelAlign" :rules="rules" ref="ruleFormRef">
            <el-form-item prop="uname">
                <el-input :prefix-icon="Search" v-model.number="formLabelAlign.uname" placeholder="请输入手机号">
                    <template #prefix>
                        <el-icon class="el-input__icon">
                            <Iphone />
                        </el-icon>
                    </template>
                </el-input>
            </el-form-item>
            <el-form-item prop="password">
                <el-input placeholder="请输入密码" type="password" v-model="formLabelAlign.password">
                    <template #prefix>
                        <el-icon>
                            <Lock />
                        </el-icon>
                    </template>
                </el-input>
            </el-form-item>
            <el-button style="margin-left: 60px;width: 250px; margin-bottom: 20px;" type="danger" plain @click="login">
                登录
            </el-button>
            <el-link style="margin-left: 170px; margin-bottom: 30px; text-align: center;" type="danger">注册
            </el-link>
        </el-form>
    </el-popover>
    <img class="heijiao" src="../assets/imagges/黑椒会员.png" alt="" v-if="store.state.user.profile.avatarUrl">

</template>
<script>
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { $MsgErr, $MsgSucc } from '../utils/Message'
import { longinApi } from '../api/loginApi'
import { Lock, Iphone, UserFilled } from '@element-plus/icons-vue'
import { reactive, ref, watch } from 'vue'
export default {
    name: 'appLogin',
    components: {
        Iphone,
        Lock,
        UserFilled
    },
    setup() {
        // 注册vuex
        const router = useRouter()
        const store = useStore()
        const validValue = ref(false)
        const visible = ref(true)
        const ruleFormRef = ref(null)
        // 表单验证
        const formLabelAlign = reactive({
            uname: '',
            password: ''
        })
        // 表单预验证
        const rules = reactive({
            uname: [
                { trigger: 'blur', validator: checkName }
            ],
            password: [
                {
                    trigger: 'blur',
                    validator: validatePass
                }
            ]
        })

        function checkName(rule, value, callback) {
            if (!value) {
                return callback(new Error('不能为空'))
            }
            setTimeout(() => {
                let myreg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/
                if (!myreg.test(value)) {
                    callback(new Error('请输入正确的手机号'))
                } else {
                    callback()
                }
            }, 1000)
        };
        function validatePass(rule, value, callback) {
            if (value === '') {
                callback(new Error('请输入密码'))
            } else {
                callback()
            }
        }
        // 登录接口
        watch(validValue, (newValue) => {
            if (newValue) {
                validValue.value = false
                longinApi(formLabelAlign).then(res => {
                    if (res.data.code === 502) {
                        console.log(res.data)
                        $MsgErr(res.data.msg)
                        return false
                    }
                    if (res.data.code === 200) {
                        ruleFormRef.value.resetFields()
                        visible.value = false
                        // 把cookie保存在本地
                        let profile = res.data.profile
                        let cookies = res.data.cookie
                        cookies = cookies.split(';')
                        let cookie = cookies.find(item => item.indexOf('MUSIC_U') !== -1)
                        profile.cookie = cookie
                        const { avatarUrl, city, nickname, province, userId, token, eventCount, followeds, follows } = profile
                        store.commit('user/setuser', { avatarUrl, city, nickname, province, userId, token, cookie, eventCount, followeds, follows })
                        $MsgSucc('登录成功')
                        // 刷新页面
                        router.go(0)
                    }
                })
            }
        })
        // const getLoginApi = () => {
        //     longinApi(formLabelAlign.uname, formLabelAlign.password).then(res => {
        //         // ruleFormRef.value.resetFields()
        //         visible.value = false
        //         console.log(res.data)
        //     })
        // }
        // 登录
        const login = () => {
            // 如果预验证通过就提示登录成功关闭对话框
            ruleFormRef.value.validate(valid => {
                if (valid) {
                    console.log(valid)
                    validValue.value = valid
                }
                console.log(valid, formLabelAlign.uname, formLabelAlign.password)
            })
        }
        return { formLabelAlign, rules, ruleFormRef, login, visible, store }
    }
}
</script>

<style lang="less" scoped>
/deep/.el-input {
    width: 250px !important;
    --el-input-focus-border-color: #ec4141;
    margin: 5px 60px !important;
}

/deep/.el-form-item__error {
    left: 60px;
}

.el-popover {
    /deep/.el-form {
        margin: 0 40px !important;

    }
}

.heijiao {
    max-width: 50px;
}

span {
    cursor: pointer;
    color: #e9e6e6;
    margin: 0 8px;
    cursor: pointer;

    &:hover {
        color: #fff;
    }
}

.picIcon {
    width: 100%;
    height: 121px;
    cursor: pointer;
    -o-object-fit: contain;
    object-fit: contain;
}
</style>