<template>
  <v-container v-if="getPost" class="mt-3" flexbox center>
    <v-layout row wrap>
      <v-flex xs12>
        <v-card hover>
          <v-card-title>
            <h1>
              {{getPost.title}}
            </h1>
            <v-btn @click="handleToggleLike" large icon v-if="user">
              <v-icon large :color="checkIfPostLiked(this.postId) ? 'red' : 'grey'">
                favorite
              </v-icon>
            </v-btn>
            <h3 class="ml-3 font-weight-thin">
              {{getPost.likes}}
            </h3>
            <v-spacer></v-spacer>
            <v-icon @click="goToPreviousPage" color="info" large>arrow_back</v-icon>
          </v-card-title>
          <v-tooltip right>
            <span>Click to enlagre image</span>
            <v-img @click="toggleImageDialog" slot="activator" :src="getPost.imageUrl" id="post__image"></v-img>
          </v-tooltip>

          <!-- Enlarged post image dialog-->
          <v-dialog v-model="dialog">
            <v-card>
              <v-img :src="getPost.imageUrl" height="80vh">
              </v-img>
            </v-card>
          </v-dialog>
          <v-card-text>
            <span v-for="(category, index) in getPost.categories" :key="index">
              <v-chip class="mb-3" color="accent" text-col="white">{{category}}</v-chip>
            </span>
            <h3>{{getPost.description}}</h3>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>

    <!-- Messages sction -->
    <div class="mt-3">
      <v-layout class="mb-3" v-if="user">
        <v-flex xs12>
          <v-form v-model="isFormValid" lazy-validation ref="form" @submit.prevent="handleAddPostMessage">
            <v-layout row>
              <v-flex xs12>
                <v-text-field :rules="messageRules" v-model="messageBody" @click:append-outer="handleAddPostMessage" clearable :append-outer-icon="messageBody && 'send'" label="Add Message" type="text" prepend-icon="email" requierd>
                </v-text-field>
              </v-flex>
            </v-layout>
          </v-form>
        </v-flex>
      </v-layout>

      <!-- Messages -->
      <v-layout row wrap>
        <v-flex xs12>
          <v-list subheader two-line>
            <v-subheader>Messages ({{getPost.messages.length}})</v-subheader>
            <template v-for="message in getPost.messages">
              <v-divider :key="message._id"></v-divider>
              <v-list-tile avatar inset :key="message.title">
                <v-list-tile-avatar>
                  <img :src="message.messageUser.avatar">
                </v-list-tile-avatar>
                <v-list-tile-content>
                  <v-list-tile-title>
                    {{message.messageBody}}
                  </v-list-tile-title>
                  <v-list-tile-sub-title>
                    {{message.messageUser.username}}
                    <span class="grey--text text-lighten-1 hidden-xs-only">
                      {{message.messageDate | formatDate}}
                    </span>
                  </v-list-tile-sub-title>
                </v-list-tile-content>
                <v-list-tile-action class="hidden-xs-only">
                  <v-icon :color="checkIfOwnMessage(message) ? 'accent': 'greg'">chat_bubble</v-icon>
                </v-list-tile-action>
              </v-list-tile>
            </template>
          </v-list>
        </v-flex>
      </v-layout>
    </div>
  </v-container>
</template>

<script>
import moment from 'moment'
import {mapGetters} from 'vuex'
import {GET_POST, ADD_POST_MESSAGE, GET_POSTS, LIKE_POST, UNLIKE_POST} from '../../queries'
export default {
  name: "Post",
  props: ['postId'],
  data() {
    return{
      postLiked: false,
      dialog: false,
      messageBody: "",
      isFormValid: true,
      messageRules:[
        message => !!message || "Message is required",
        message => message.length < 100 || "Message must be less than 100 characters"
        ]
    }
  },
  methods: {
    checkIfPostLiked(postId){
      if (this.userFavorites && this.userFavorites.some(fave => fave._id === postId)){
        this.postLiked = true
        return true
      }else{
        this.postLiked = false
        return false
      }
    },
    handleAddPostMessage(){
      if (this.$refs.form.validate()){
      const variables = {
        messageBody: this.messageBody,
        userId : this.user._id,
        postId: this.postId
      }
      this.$apollo.mutate({
        mutation: ADD_POST_MESSAGE,
        variables,
        update: (cache, {data: {addPostMessage}})=>{
          const data= cache.readQuery({
            query: GET_POST,
            variables:{
              postId: this.postId
        }
          })
          data.getPost.messages.unshift(addPostMessage)
          cache.writeQuery({
            query: GET_POST,
            variables: {postId: this.postId},
            data
          })
        }
      }).then(({data}) =>{
        // it could be this.messageBody = '' but since it is a form, iw wil be invalid after changing messageBody to empty string, so we must reset the form by the following
        this.$refs.form.reset()
        // console.log(data.addPostMessage)
      }).catch(err=>{
        console.log(err)
      })
      }
    },
    goToPreviousPage(){
      this.$router.go(-1);
    },
    toggleImageDialog(){
      if (window.innerWidth > 500){
        this.dialog = !this.dialog;
      }
    },
    checkIfOwnMessage(message){
      return this.user && this.user._id && message.messageUser._id
    },
    handleLikePost(){
      const variables = {
        postId: this.postId,
        username: this.user.username
      }
      this.$apollo.mutate({
        mutation: LIKE_POST,
        variables,
        update: (cache, {data: {likePost}})=>{
          const data = cache.readQuery({
            query: GET_POST,
            variables: {postId: this.postId}
          })
          data.getPost.likes += 1;
          cache.writeQuery({
            query: GET_POST,
            variables: {postId: this.postId},
            data
          })
        }
      }).then(({data})=>{
        // console.log('user', this.user)
        // console.log("like post", data.likePost)
        const updatedUser = {...this.user, favorites: data.likePost.favorites};
        this.$store.commit('setUser', updatedUser);
      }).catch(err =>{
        console.log(err)
      })
    },
    handleUnlikePost(){
      const variables = {
        postId: this.postId,
        username: this.user.username
      }
      this.$apollo.mutate({
        mutation: UNLIKE_POST,
        variables,
        update: (cache, {data: {unlikePost}})=>{
          const data = cache.readQuery({
            query: GET_POST,
            variables: {postId: this.postId}
          })
          data.getPost.likes -= 1;
          cache.writeQuery({
            query: GET_POST,
            variables: {postId: this.postId},
            data
          })
        }
      }).then(({data})=>{
        // console.log('user', this.user)
        // console.log("like post", data.likePost)
        const updatedUser = {...this.user, favorites: data.unlikePost.favorites};
        this.$store.commit('setUser', updatedUser);
      }).catch(err =>{
        console.log(err)
      })
    },
    handleToggleLike(){
      if (this.postLiked){
        this.handleUnlikePost();
        this.checkIfPostLiked(this.postId)
      }else{
        this.handleLikePost();
        this.checkIfPostLiked(this.postId)
      }
    }
  },
  apollo: {
    getPost: {
      query: GET_POST,
      variables(){
        return{
          postId: this.postId
        }
      } 
    }
  },
  computed:{
    ...mapGetters(['user', 'userFavorites'])
  },
    filters: {
      formatDate: (date) =>{
          return moment(new Date(date)).fromNow();
      }
  }
}
</script>

<style scoped>
#post__iamge {
	height: 400px !important ;
}
</style>
