import Vue from "vue";
import Vuex from "vuex";
import router from "./router";
import { defaultClient as apolloClient } from "./main";
import {
	GET_CURRENT_USER,
	GET_POSTS,
	SIGNIN_USER,
	SIGNUP_USER,
	ADD_POST
} from "./queries";
import { check } from "graphql-anywhere";

Vue.use(Vuex);

export default new Vuex.Store({
	state: {
		posts: [],
		user: null,
		loading: false,
		error: null,
		authError: null
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
		setAuthError: (state, payload) => {
			state.authError = payload;
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
		addPost: ({ commit }, payload) => {
			commit("setLoading", true);
			apolloClient
				.mutate({
					mutation: ADD_POST,
					variables: payload,
					update: (cache, { data: { addPost } }) => {
						//Read the query you want to update
						const data = cache.readQuery({ query: GET_POSTS });
						// Create updated data
						data.getPosts.unshift(addPost);
						//Write update data back to query
						cache.writeQuery({
							query: GET_POSTS,
							data
						});
					},
					//Optimistic response ensures data is added immediately to the ui
					optimisticResponse: {
						__typename: "Mutation",
						addPost: {
							__typename: "Post",
							_id: -1,
							...payload
						}
					}
				})
				.then(({ data }) => {
					commit("setLoading", false);
					console.log(data.addPost);
				})
				.catch(err => {
					commit("setLoading", false);
					console.log(err);
				});
		},
		signinUser: ({ commit }, payload) => {
			//the below line is to set the token to an empty string before signin muatation to prevent any errors(if malformed token)
			commit("clearError");
			commit("setLoading", true);

			localStorage.setItem("token", "");
			apolloClient
				.mutate({
					mutation: SIGNIN_USER,
					variables: payload
				})
				.then(({ data }) => {
					commit("setLoading", false);
					localStorage.setItem("token", data.signinUser.token);
					router.go();
				})
				.catch(err => {
					commit("setLoading", false);
					commit("setError", err);
				});
		},
		signupUser: ({ commit }, payload) => {
			commit("clearError");
			commit("setLoading", true);

			apolloClient
				.mutate({
					mutation: SIGNUP_USER,
					variables: payload
				})
				.then(({ data }) => {
					commit("setLoading", false);
					localStorage.setItem("token", data.signupUser.token);
					//to make sure created method is run in main.js (and alse we ran getCurrentUser), refresh the page by using router.go()
					router.go();
				})
				.catch(err => {
					commit("setLoading", false);
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
		},
		authError: state => {
			return state.authError;
		}
	}
});
