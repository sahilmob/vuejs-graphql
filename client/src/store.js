import Vue from 'vue'
import Vuex from 'vuex'

import { gql } from 'apollo-boost'
import { defaultClient as apolloClient } from './main'
import { stat } from 'fs';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    posts: []
  },
  mutations: {
    setPosts: (state, posts) => {
      state.posts = posts
    }
  },
  actions: {
    getPosts: ({ commit }) => {
      apolloClient
        .query({
          query: gql`
          query {
            getPosts{
              _id
              title
              imageUrl
            }
          }
        `
        }).then(({ data }) => {
          commit('setPosts', data.getPosts)
          console.log(data.getPosts);
        })
        .catch(err => {
          console.log(err);
        })
    }
  },
  getters: {
    posts: (state) => {
      return state.posts
    }
  }
})
