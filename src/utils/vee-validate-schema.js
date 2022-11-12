export default {

    checkName(rule, value, callback) {
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
    },
    validatePass(rule, value, callback) {
        if (value === '') {
            callback(new Error('请输入密码'))
        } else {
            // if (ruleForm.checkpass !== '') {
            //     ruleForm.validateField('checkpass')
            // }
            // callback()
        }
    }
}