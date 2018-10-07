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
			createdDate
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
