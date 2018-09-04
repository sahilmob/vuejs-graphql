<template>
  <v-container>
    <h1>Home</h1>
    <!-- <div v-if="$apollo.loading">Loading...</div>
    <ul e-else v-for="post in getPosts" :key="post._id">
      <li>
        {{post.title}} {{post.imageUrl}} {{post.description}}
      </li>
    </ul> -->
    <ApolloQuery :query="getPostsQuery">
      <template slot-scope="{result: {loading, error, data}}">
        <div v-if="loading">Loading...</div>
        <div v-else-if="error">{{error.message}}</div>
        <ul v-else v-for="post in data.getPosts" :key="post._id">
          {{post.title}} {{post.imageUrl}} {{post.likes}}
        </ul>
      </template>
    </ApolloQuery>
  </v-container>
</template>

<script>
// @ is an alias to /src
import { gql } from "apollo-boost";
export default {
  name: "home",
  data() {
    return {
      getPostsQuery: gql`
        query {
          getPosts {
            _id
            title
            description
            imageUrl
            likes
          }
        }
      `
    };
  }
  // apollo: {
  //   getPosts: {
  //     query: gql`
  //       query {
  //         getPosts {
  //           _id
  //           title
  //           description
  //           imageUrl
  //         }
  //       }
  //     `
  // result(args) {
  //   console.log(args);
  // },
  // error(err) {
  //   console.log("Error", err);
  // }
  // }
  // }
};
</script>
