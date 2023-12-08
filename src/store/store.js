import Vue from "vue";
import Vuex from "vuex";
 
Vue.use(Vuex);
 
const store = new Vuex.Store({
  state() {
      return {
          count: 0,
          num: 1
      }
  },
  mutations: {
      increment(state) {
          state.count++
      },
      changeUid(state, uid) {
        state.uid = uid;
      }
  }
})
export default store