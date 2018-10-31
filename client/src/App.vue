<template>
  <v-app style="background: #E3E3EE">
    <v-navigation-drawer app temporary fixed v-model="sideNav">
      <v-toolbar color="secondary" dark flat>
        <v-toolbar-side-icon @click="toggleSideNav"></v-toolbar-side-icon>
        <router-link to="/" tag="span" style="cursor: pointer">VueShare</router-link>
      </v-toolbar>
      <v-divider></v-divider>
      <v-list>
        <v-list-tile ripple v-for="item in sideNavItems" :key="item.title" :to="item.link">
          <v-list-tile-action>
            <v-icon>{{item.icon}}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            {{item.title}}
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile v-if="user" @click="handleSignOut">
          <v-list-tile-action>
            <v-icon>exit_to_app</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            Signout
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar fixed color="primary" dark>
      <v-toolbar-side-icon @click="toggleSideNav"></v-toolbar-side-icon>
      <v-toolbar-title class="hidden-xs-only">
        <router-link to="/" tag="span" style="cursor: pointer">
          <h1 class="title pl-3">VueShare</h1>
        </router-link>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-text-field v-model="searchTerm" @input="handleSearchPosts" flex prepend-icon="search" placeholder="Search posts" color="accent" single-line hide-details></v-text-field>
      <!-- Search result card -->
      <v-card dark v-if="searchResults.length" id="search__card">
        <v-list>
          <v-list-tile @click="goToSearchResult(result._id)" v-for="result in searchResults" :key="result._id">
            <v-list-tile-title>
              {{result.title}} -
              <span class="font-weight-thin">
                {{formatDesription(result.description)}}
              </span>
            </v-list-tile-title>
            <!-- Show icon if user likes result -->
            <v-list-tile-action v-if="checkIfUserFavorite(result._id)">
              <v-icon>favorites</v-icon>
            </v-list-tile-action>
          </v-list-tile>
        </v-list>
      </v-card>
      <v-spacer></v-spacer>
      <v-toolbar-items class="hidden-xs-only">
        <v-btn flat v-for="item in horizontalNavItems" :key="item.title" :to="item.link">
          <v-icon class="hidden-sm-only">{{item.icon}}</v-icon>
          {{item.title}}
        </v-btn>
        <v-btn flat to="/profile" v-if="user">
          <v-icon class="hidden-sm-only" left>account_box</v-icon>
          <v-badge right color="blue darken-2" :class="{'bounce': badgeAnimated}">
            <span slot="badge" v-if="userFavorites.length">{{userFavorites.length}}</span>
            Profile
          </v-badge>
        </v-btn>
        <v-btn flat v-if="user" @click="handleSignOut">
          <v-icon class="hidden-sm-only" left>exit_to_app</v-icon>
          Signout
        </v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <main>
      <v-container class="mt-4">
        <transition name="fade">
          <router-view />
        </transition>
        <!-- Auth Snackbar -->
        <v-snackbar v-model="authSnackBar" color="success" :timeout="5000" bottom left>
          <v-icon class="mr-3">check-circle</v-icon>
          <h3>You are now signed in!</h3>
          <v-btn dark flat @click="authSnackBar = false">Dismiss</v-btn>
        </v-snackbar>
        <!-- Auth Error Snackbar -->
        <v-snackbar v-if="authError" v-model="authErrorSnackBar" color="info" :timeout="5000" bottom left>
          <v-icon class="mr-3">cancel</v-icon>
          <h3>{{authError.message}}</h3>
          <v-btn dark flat to="/signin">Sign in</v-btn>
        </v-snackbar>

      </v-container>
    </main>
  </v-app>
</template>


<script>
import { mapGetters } from "vuex";
export default {
  name: "App",
  data() {
    return {
      searchTerm: '',
      sideNav: false,
      authSnackBar: false,
      authErrorSnackBar: false,
      badgeAnimated: false
    };
  },
  watch: {
    user(newValue, oldValue){
      // if we had no user before, show snak bar
      console.log(oldValue)
      if (oldValue === null){
        this.authSnackBar = true;
      }
    },
    authError(value){
      // if auth error is not null, show auth error snackbar
      if(value !== null){
        this.authErrorSnackBar = true
      }
    },
    userFavorites(value){
      if (value){
        this.badgeAnimated = true;
        setTimeout(()=>(
          this.badgeAnimated = false
        ), 1000)
      }
    }
  },
  methods: {
    handleSearchPosts(){
      this.$store.dispatch('searchPost', {
        searchTerm: this.searchTerm
      })
    },
    handleSignOut() {
      this.$store.dispatch("signoutUser");
    },
    toggleSideNav() {
      this.sideNav = !this.sideNav;
    },
    goToSearchResult(postId){
      this.searchTerm= '';
      this.$router.push(`/posts/${postId}`)
      this.$store.commit('clearSearchResults')
    },
    formatDesription(desc){
      return desc.length > 30 ?  `${desc.slice(0, 30)}...` : desc;
    },
    checkIfUserFavorite(postId){
      return this.userFavorites && this.userFavorites.some(fave =>fave._id === postId)
    }
  },
  computed: {
    ...mapGetters(["user", "authError", "userFavorites", "searchResults"]),
    horizontalNavItems() {
      let items = [
        {
          icon: "chat",
          title: "Posts",
          link: "/posts"
        },
        {
          icon: "lock_open",
          title: "Sign In",
          link: "/signin"
        },
        {
          icon: "create",
          title: "Sign Up",
          link: "/signup"
        }
      ];
      if (this.user) {
        items = [
          {
            icon: "chat",
            title: "Posts",
            link: "/posts"
          }
        ];
      }
      return items;
    },
    sideNavItems() {
      let items = [
        {
          icon: "chat",
          title: "Posts",
          link: "/posts"
        },
        {
          icon: "lock_open",
          title: "Sign In",
          link: "/signin"
        },
        {
          icon: "create",
          title: "Sign Up",
          link: "/signup"
        }
      ];
      if (this.user) {
        items = [
          {
            icon: "chat",
            title: "Posts",
            link: "/posts"
          },
          {
            icon: "stars",
            title: "Create Post",
            link: "post/add"
          },
          {
            icon: "account_box",
            title: "Profile",
            link: "/profile"
          }
        ];
      }
      return items;
    }
  }
};
</script>


<style>
i {
	margin-right: 10px;
}

.fade-enter-active,
.fade-leave-active {
	transition-property: all;
	transition-duration: 0.25s;
}
.fade-enter-active {
	transition-delay: 0.25s;
}

.fade-enter,
.fade-leave-active {
	opacity: 0;
	transform: translateY(-25px);
}

#search__card {
	position: absolute;
	width: 100vw;
	z-index: 10;
	top: 100%;
	left: 0;
}

.bounce {
	animation: bounce 1s both;
}

@keyframes bounce {
	0%,
	20%,
	53%,
	80%,
	100% {
		transform: translate3d(0, 0, 0);
	}
	40%,
	43% {
		transform: translate3d(0, -20px, 0);
	}
	70% {
		transform: translate3d(0, -10px, 0);
	}
	90% {
		transform: translate3d(0, -4px, 0);
	}
}
</style>
