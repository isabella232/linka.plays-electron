import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Home from '../views/Home.vue'
import GameViewer from '../views/GameViewer.vue'
import GameViewerHeader from '../views/GameViewerHeader.vue'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/game/:gameid',
    name: 'Game',
    components: {
      default: GameViewer,
      header: GameViewerHeader
    }

  }
]

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})

export default router
