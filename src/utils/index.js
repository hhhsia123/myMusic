// 扩展vue原有的功能：全局组件，自定义指令，挂载原型方法，注意：没有全局过滤器。
// 这就是插件
// vue2.0插件写法要素：导出一个对象，有install函数，默认传入了Vue构造函数，Vue基础之上扩展
// vue3.0插件写法要素：导出一个对象，有install函数，默认传入了app应用实例，app基础之上扩展
// 图片无法加载出来的默认图片
import defaultImg from '../assets/imagges/图未加载.png'

// ui样式
// import XtxSkeleton from './xtx-skeleton.vue'
// // 轮播图
// import XtxCarousel from './xtx-carousel.vue'
// // 查看全部
// import XtxMore from './xtx-more.vue'
// // 面包屑导航
// import XtxBreadItem from './xtx-bread-item.vue'
// import XtxBread from './xtx-bread.vue'
// ---------------------------------------------------------
// 导入library文件夹下的所有组件
// 批量导入需要使用一个函数 require.context(dir,deep,matching)
// 参数：1. 目录  2. 是否加载子目录  3. 加载的正则匹配
// const importFn = require.context('./', false, /\.vue$/)
// console.dir(importFn.keys()) 文件名称数组
export default {
    install(app) {
        // 在app上进行扩展，app提供 component directive 函数
        // 如果要挂载原型 app.config.globalProperties 方式
        // app.component(XtxSkeleton.name, XtxSkeleton)
        // app.component(XtxCarousel.name, XtxCarousel)
        // app.component(XtxMore.name, XtxMore)
        // app.component(XtxBreadItem.name, XtxBreadItem)
        // app.component(XtxBread.name, XtxBread)
        // 批量注册全局组件
        // importFn.keys().forEach(key => {
        //     // 导入组件
        //     const component = importFn(key).default
        //     // 注册组件
        //     app.component(component.name, component)
        // })
        // 定义懒加载指令
        defineDirective(app)
    }
}
const defineDirective = (app) => {
    // 图片懒加载指令
    app.directive('lazyload', {
        mounted(el, binding) {
            const observer = new IntersectionObserver(([{ isIntersecting }]) => {
                if (isIntersecting) {
                    // 停止观察dom
                    observer.unobserve(el)
                    // 图片无法加载出来的默认图片
                    el.onerror = () => {
                        el.src = defaultImg
                    }
                    // 把指令的值设置给el的scr属性,指令的值就是binding.value
                    el.src = binding.value
                }
            }, {
                threshold: 0.01
            })
            // 开启观察dom
            observer.observe(el)
        }
    })
}
