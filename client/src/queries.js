import { gql } from "apollo-boost";

/* Posts Queries */
export const GET_POSTS = gql`
	query {
		getPosts {
			_id
			title
			imageUrl
		}
	}
`;

export const GET_POST = gql`
	query($postId: ID!) {
		getPost(postId: $postId) {
			_id
			title
			imageUrl
			categories
			description
			likes
			createdDate
			messages {
				_id
				messageBody
				messageDate
				messageUser {
					_id
					avatar
					username
				}
			}
		}
	}
`;

export const INFINITE_SCROLL_POSTS = gql`
	query($pageNum: Int!, $pageSize: Int!) {
		infiniteScrollPosts(pageNum: $pageNum, pageSize: $pageSize) {
			hasMore
			posts {
				_id
				title
				imageUrl
				categories
				description
				likes
				createdDate
				messages {
					_id
				}
				createdBy {
					_id
					username
					avatar
				}
			}
		}
	}
`;

export const GET_USER_POSTS = gql`
	query($userId: ID!) {
		getUserPosts(userId: $userId) {
			_id
			title
			imageUrl
			description
			categories
			createdDate
			likes
		}
	}
`;

export const SEARCH_POST = gql`
	query($searchTerm: String) {
		searchPost(searchTerm: $searchTerm) {
			_id
			title
			description
			imageUrl
			likes
		}
	}
`;

/* Users Queries */
export const GET_CURRENT_USER = gql`
	query {
		getCurrentUser {
			_id
			username
			email
			avatar
			joinDate
			favorites {
				_id
				title
				imageUrl
			}
		}
	}
`;

/* Posts Mutations */

export const ADD_POST = gql`
	mutation(
		$title: String!
		$imageUrl: String!
		$categories: [String]!
		$description: String!
		$creatorId: ID!
	) {
		addPost(
			title: $title
			imageUrl: $imageUrl
			categories: $categories
			description: $description
			creatorId: $creatorId
		) {
			_id
			title
			categories
			imageUrl
			description
		}
	}
`;

export const ADD_POST_MESSAGE = gql`
	mutation($messageBody: String!, $userId: ID!, $postId: ID!) {
		addPostMessage(
			messageBody: $messageBody
			userId: $userId
			postId: $postId
		) {
			_id
			messageBody
			messageDate
			messageUser {
				_id
				username
				avatar
			}
		}
	}
`;

export const LIKE_POST = gql`
	mutation($postId: ID!, $username: String!) {
		likePost(postId: $postId, username: $username) {
			likes
			favorites {
				_id
				title
				imageUrl
			}
		}
	}
`;

export const UNLIKE_POST = gql`
	mutation($postId: ID!, $username: String!) {
		unlikePost(postId: $postId, username: $username) {
			likes
			favorites {
				_id
				title
				imageUrl
			}
		}
	}
`;

export const UPDATE_USER_POST = gql`
	mutation(
		$postId: ID!
		$userId: ID!
		$title: String!
		$imageUrl: String!
		$categories: [String]!
		$description: String!
	) {
		updateUserPost(
			userId: $userId
			postId: $postId
			title: $title
			imageUrl: $imageUrl
			description: $description
			categories: $categories
		) {
			_id
			title
			description
			categories
			imageUrl
			createdDate
			likes
			createdBy {
				_id
				avatar
			}
		}
	}
`;

/* User Mutations */
export const SIGNIN_USER = gql`
	mutation($username: String!, $password: String!) {
		signinUser(username: $username, password: $password) {
			token
		}
	}
`;
export const SIGNUP_USER = gql`
	mutation($username: String!, $email: String!, $password: String!) {
		signupUser(username: $username, email: $email, password: $password) {
			token
		}
	}
`;
