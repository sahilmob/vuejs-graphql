import Vue from "vue";
import Vuex from "vuex";
import router from "./router";
import { defaultClient as apolloClient } from "./main";
import { GET_CURRENT_USER, GET_POSTS, SIGNIN_USER } from "./queries";

Vue.use(Vuex);

export default new Vuex.Store({
	state: {
		posts: [],
		user: null,
		loading: false,
		error: null
	},
	mutations: {
		setPosts: (state, posts) => {
			state.posts = posts;
		},
		setLoading: (state, payload) => {
			state.loading = payload;
		},
		setUser: (state, user) => {
			state.user = user;
		},
		clearUser: state => {
			state.user = null;
		},
		setError: (state, err) => {
			state.error = err;
		},
		clearError: state => {
			state.error = null;
		}
	},
	actions: {
		getCurrentUser: ({ commit }) => {
			commit("setLoading", true);
			apolloClient
				.query({
					query: GET_CURRENT_USER
				})
				.then(({ data }) => {
					commit("setLoading", false);
					console.log(data.getCurrentUser);
					commit("setUser", data.getCurrentUser);
				})
				.catch(err => {
					commit("setLoading", false);
					console.log("error from store - getCurrentUser", err);
				});
		},
		getPosts: ({ commit }) => {
			commit("setLoading", true);
			apolloClient
				.query({
					query: GET_POSTS
				})
				.then(({ data }) => {
					commit("setPosts", data.getPosts);
					commit("setLoading", false);
					console.log(data.getPosts);
				})
				.catch(err => {
					commit("setLoading", false);
					console.log(err);
				});
		},
		signinUser: ({ commit }, payload) => {
			//the below line is to set the token to an empty string before signin muatation to prevent any errors
			commit("clearError");
			localStorage.setItem("token", "");
			apolloClient
				.mutate({
					mutation: SIGNIN_USER,
					variables: payload
				})
				.then(({ data }) => {
					localStorage.setItem("token", data.signinUser.token);
					router.go();
				})
				.catch(err => {
					commit("setError", err);
				});
		},
		signoutUser: async ({ commit }) => {
			commit("clearUser");
			localStorage.setItem("token", "");
			await apolloClient.resetStore();
			router.push("/");
		}
	},
	getters: {
		posts: state => {
			return state.posts;
		},
		loading: state => {
			return state.loading;
		},
		user: state => {
			return state.user;
		},
		error: state => {
			return state.error;
		}
	}
});
