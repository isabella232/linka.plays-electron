import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    points: 0,
    step: 0,
    maxSteps: 10
  },
  getters:{
   points(state){
     return  state.points
    },
   step(state){
     return  state.step
    },
   maxSteps(state){
     return  state.maxSteps
    },
    gameover(state){
      return (state.step+1)>=state.maxSteps
    }
  
  },
  mutations: {
    step(state, value){state.step=value},
    maxSteps(state, value){state.maxSteps=value},
    points(state, value){state.points=value}
  },
  actions: {
  },
  modules: {
  }
})
