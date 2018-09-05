import Vue from 'vue'
import Vuex from 'vuex'

import { defaultClient as apolloClient } from './main'
import { GET_CURRENT_USER, GET_POSTS, SIGNIN_USER } from './queries'

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
    getCurrentUser: ({ commit }) => {
      commit('setLoading', true)
      apolloClient.query({
        query: GET_CURRENT_USER
      })
        .then(({ data }) => {
          commit('setLoading', false)
          console.log(data.getCurrentUser);
        })
        .catch(err => {
          commit('setLoading', false)
          console.log("error from store - getCurrentUser", err)
        })
    },
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
    },
    signinUser: ({ commit }, payload) => {
      apolloClient.mutate({
        mutation: SIGNIN_USER,
        variables: payload
      }).then(({ data }) => {
        localStorage.setItem('token', data.signinUser.token)
      }).catch(err => {
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
