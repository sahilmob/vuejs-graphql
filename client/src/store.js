import Vue from 'vue'
import Vuex from 'vuex'

import { defaultClient as apolloClient } from './main'
import { GET_POSTS } from './queries'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    posts: [],
    loading: false
  },
  mutations: {
    setPosts: (state, posts) => {
      state.posts = posts
    },
    setLoading: (state, payload) => {
      state.loading = payload;
    }
  },
  actions: {
    getPosts: ({ commit }) => {
      commit('setLoading', true)
      apolloClient
        .query({
          query: GET_POSTS
        }).then(({ data }) => {
          commit('setPosts', data.getPosts);
          commit('setLoading', false);
          console.log(data.getPosts);
        })
        .catch(err => {
          commit('setLoading', false);
          console.log(err);
        })
    }
  },
  getters: {
    posts: (state) => {
      return state.posts
    },
    loading: (state) => {
      return state.loading
    }
  }
})