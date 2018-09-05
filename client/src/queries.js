import { gql } from 'apollo-boost'


/* Posts Queries */
export const GET_POSTS = gql`
query {
  getPosts{
    _id
    title
    imageUrl
  }
}
`

/* Users Queries */


/* Posts Mutations */


/* User Mutations */
