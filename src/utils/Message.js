import { ElMessage } from 'element-plus'

export const $MsgSucc = (value) => {
    ElMessage({
        message: value,
        type: 'success'
    })
}
export const $MsgWarn = (value) => {
    ElMessage({
        message: value,
        type: 'warning'
    })
}
export const $MsgErr = (value) => {
    ElMessage.error(value)
}