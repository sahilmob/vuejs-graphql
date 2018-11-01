<template>
  <v-container text-xs-center>
    <!-- Loading spinner -->

    <v-layout row>
      <v-dialog v-model="loading" persistent fullscreen>
        <v-container fill-height>
          <v-layout row justify-center align-center>
            <v-progress-circular indeterminate :size="70" :width="7" color="secondary"></v-progress-circular>
          </v-layout>
        </v-container>
      </v-dialog>
    </v-layout>

    <!-- Explore posts button -->
    <v-layout class="mt-2 mb-3" row wrap v-if="!loading">
      <v-flex sx12>
        <v-btn class="secondary" to="/posts" large dark>
          Explore Posts
        </v-btn>
      </v-flex>
    </v-layout>

    <!-- Posts carousel -->
    <v-flex xs12>
      <v-carousel v-if="!loading && posts.length > 0" v-bind="{'cycle': true }" interval="3000">
        <v-carousel-item @click.native="goToPost(post._id)" v-for="post in posts" :key="post._id" :src="post.imageUrl">
          <h1 id="carousel__title">{{post.title}}</h1>
        </v-carousel-item>
      </v-carousel>
    </v-flex>
    <!-- <div v-if="$apollo.loading">Loading...</div>
    <ul e-else v-for="post in getPosts" :key="post._id">
      <li>
        {{post.title}} {{post.imageUrl}} {{post.description}}
      </li>
    </ul> -->
    <!-- <ApolloQuery :query="getPostsQuery">
      <template slot-scope="{result: {loading, error, data}}">
        <div v-if="loading">Loading...</div>
        <div v-else-if="error">{{error.message}}</div>
        <ul v-else v-for="post in data.getPosts" :key="post._id">
          {{post.title}} {{post.imageUrl}} {{post.likes}}
        </ul>
      </template>
    </ApolloQuery> -->
  </v-container>
</template>

<script>
// @ is an alias to /src
import { gql } from "apollo-boost";
import { mapGetters } from "vuex";

export default {
  created() {
    this.handleGetCarouselPosts();
  },
  name: "home",
  data() {
    return {
      // getPostsQuery: gql`
      //   query {
      //     getPosts {
      //       _id
      //       title
      //       description
      //       imageUrl
      //       likes
      //     }
      //   }
      // `
    };
  },
  computed: {
    ...mapGetters(["loading", "posts"])
  },
  methods: {
    handleGetCarouselPosts() {
      this.$store.dispatch("getPosts");
    },
    goToPost(postId){
      this.$router.push(`/posts/${postId}`);
    }
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
  //     `,
  //     result(args) {
  //       console.log(args);
  //     },
  //     error(err) {
  //       console.log("Error", err);
  //     }
  //   }
  // }
};
</script>

<style scoped>
#carousel__title {
	position: absolute;
	cursor: pointer;
	background-color: rgba(0, 0, 0, 0.5);
	color: white;
	border-radius: 5px 5px 0 0;
	padding: 0.5em;
	margin: 0 auto;
	bottom: 50px;
	left: 0;
	right: 0;
}
</style>

