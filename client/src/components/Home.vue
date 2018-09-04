<template>
  <v-container>
    <h1>Home</h1>
    <div v-if="$apollo.loading">Loading...</div>
    <ul e-else v-for="post in getPosts" :key="post._id">
      <li>
        {{post.title}} {{post.imageUrl}} {{post.description}}
      </li>
    </ul>
  </v-container>
</template>

<script>
// @ is an alias to /src
import { gql } from "apollo-boost";
export default {
  name: "home",
  data() {
    return {
      posts: []
    };
  },
  apollo: {
    getPosts: {
      query: gql`
        query {
          getPosts {
            _id
            title
            description
            imageUrl
          }
        }
      `
      // result(args) {
      //   console.log(args);
      // },
      // error(err) {
      //   console.log("Error", err);
      // }
    }
  }
};
</script>
