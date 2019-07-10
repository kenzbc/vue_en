import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

import home from '../views/home.vue'
import post from '../views/post.vue'

import page404 from '../views/404.vue'

let mode = 'history'

export default new VueRouter({
  mode: mode,
	base:'/en/',//开发环境相对路径
  routes: [
    {
      path: '',
      name: 'home',
      component: home,
      meta: {
        title: 'home',
        content: 'twitter'
      }
    },
    {
      path: '/post/:id',
      name: 'post',
      component: post,
      meta: {
        title: 'post',
        content: 'facebook'
      }
    },
    {path: '/404', name: '404', component: page404},
    {path: '*', redirect: '/404'}
  ]
})
