<template>
    <v-container text-xs-center mt-5 pt-5>
        <v-layout row wrap="">
            <v-flex xs12 sm6 offset-sm3>
                <h1 class="primary--text">Add Post</h1>
            </v-flex>
        </v-layout>
        <v-layout row wrap="">
            <v-flex xs12 sm6 offset-sm3>
                <v-form ref="form" v-model="isFormValid" lazy-validation @submit.prevent="handleAddPost">
                    <!-- Title input -->
                    <v-layout row>
                        <v-flex xs12>
                            <v-text-field :rules="titleRules" v-model="title" label="Post Title" type="text" required />
                        </v-flex>
                    </v-layout>
                    <!-- Image url -->
                    <v-layout row>
                        <v-flex xs12>
                            <v-text-field :rules="imageRules" v-model="imageUrl" label="Image Url" type="text" required />
                        </v-flex>
                    </v-layout>
                    <!-- Image Preview -->
                    <v-layout row>
                        <v-flex xs12>
                            <img :src="imageUrl" height="300px">
                        </v-flex>
                    </v-layout>
                    <!-- Category Select -->
                    <v-layout row>
                        <v-flex xs12>
                            <v-select :rules="categoriesRules" v-model="categories" :items="['Art', 'Education', 'travel', 'Photography', 'Technology']" multiple label="Categories" />
                        </v-flex>
                    </v-layout>
                    <!-- Descripton -->
                    <v-layout row>
                        <v-flex xs12>
                            <v-textarea :rules="descRules" v-model="description" label="Description" />
                        </v-flex>
                    </v-layout>
                    <v-layout row>
                        <v-flex xs12>
                            <v-btn :loading="loading" :disabled="loading || !isFormValid" color="info" type="submit" @click.native="loader = 'loading'">Submit</v-btn>
                        </v-flex>
                    </v-layout>
                </v-form>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
import {mapGetters} from 'vuex'
export default {
  name: "AddPost",
  data(){
      return{
          isFormValid: true,
          title: '',
          imageUrl: '',
          categories: [],
          description: '',
          titleRules: [
              title => !! title || "Title is required",
              title => title.length <= 20 || "Title must have less than 20 characters"
          ],
          imageRules: [
              image => !! image || "Image is required"
          ],
          categoriesRules: [
              categories => !! categories.length > 0 || "At least one category is required"
          ],
          descRules: [
              desc => !! desc  || "Description is required",
              desc => desc.length <= 200 || "Description must have less than 200 characters"
          ]
      }
  },
  computed:{
      ...mapGetters(["user", "loading"])
  },
  methods: {
      handleAddPost(){
          if(this.$refs.form.validate()){
              this.$store.dispatch('addPost',{
                  title: this.title,
                  imageUrl: this.imageUrl,
                  categories: this.categories,
                  description: this.description,
                  creatorId: this.user._id
              })
              this.$router.push('/');
          }
      }
  }
};
</script>

<style>
</style>
