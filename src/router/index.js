import { createRouter, createWebHistory } from 'vue-router'
import store from '@/store'
import { $MsgWarn } from '@/utils/Message'
const appMain = () => import('../components/app-Main.vue')
const Layout = () => import('../views/Layout.vue')
const songDetail = () => import('../components/app-songDetail.vue')
const userDetail = () => import('../components/app-userDetail.vue')
const singerDetail = () => import('../components/app-singerDetail.vue')
const videoPaly = () => import('../components/asider/videoPlay.vue')
const videoDetail = () => import('../components/asider/videoDetail.vue')
const followList = () => import('../components/follow/follow.vue')
const topicRanking = () => import('../components/follow/topicRanking.vue')
const privacyFm = () => import('../components/privacyFm/privacyFm.vue')
const searchDetail = () => import('../components/search/searchDetail.vue')
const albumDetail = () => import('../components/singer/albumDetail.vue')
const recentPlays = () => import('../components/app-recentPlays.vue')
const MyCollection = () => import('../components/app-MyCollection.vue')
const careList = () => import('../components/follow/careList.vue')
const userDynamic = () => import('../components/follow/userDynamic.vue')
const localLoad = () => import('../components/localLoad/localLoad.vue')
const routes = [
  {
    path: '/',
    name: 'Layout',
    component: Layout,
    children: [
      { path: '/', component: appMain },
      { path: '/songDetail/:id', component: songDetail },
      { path: '/songDetail/userDetail/:id', component: userDetail },
      { path: '/singerDetail/:id', component: singerDetail },
      { path: '/videoPlay/:id', component: videoPaly },
      { path: '/videoPlay/videoDetail/:id', component: videoDetail },
      { path: '/follow/:id', component: followList },
      { path: '/follow/topicRanking/:id', component: topicRanking },
      { path: '/privacy/:id', component: privacyFm },
      { path: '/search/:id', component: searchDetail },
      { path: '/albumDetail/:id', component: albumDetail },
      { path: '/recentPlays', component: recentPlays },
      { path: '/MyCollection', component: MyCollection },
      { path: '/care/:id', component: careList },
      { path: '/userDynamic/:id', component: userDynamic },
      { path: '/localLoad', component: localLoad }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  // 跳转到页面顶部
  scrollBehavior() {
    return { left: 0, top: 0 }
  }
})
const { cookie } = store.state.user.profile
// 路由前置守卫
router.beforeEach((to, from, next) => {
  if (to.path.startsWith('/follow') || to.path.startsWith('/videoPlay') || to.path.startsWith('/care') || to.path.startsWith('/userDynamic') || to.path.startsWith('/privacy') || to.path === '/recentPlays' || to.path === '/MyCollection' || to.path === '/localLoad') {
    if (cookie) {
      next()
    } else {
      $MsgWarn('亲 需要登录才可以访问哦~')
    }
  } else {
    next()
  }
})
export default router
