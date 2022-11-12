import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 注册ui插件
import UI from './utils/index'
// 导入elm组件
import ElementPlus from 'element-plus'
// 导入css样式
import 'element-plus/dist/index.css'
// 导入公共样式
import './assets/style/comment.less'
createApp(App).use(store).use(router).use(ElementPlus).use(UI).mount('#app')
