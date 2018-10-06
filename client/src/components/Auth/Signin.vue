<template>
    <v-container text-xs-center mt-5 pt-5>
        <v-layout row wrap>
            <v-flex xs12 sm6 offset-sm3>
                <h1>Welcome Back!</h1>
            </v-flex>
        </v-layout>
        <!-- Error Alert -->
        <v-layout v-if="error">
            <v-flex xs12 sm6 offset-sm3>
                <form-alert :message="error.message">

                </form-alert>
            </v-flex>
        </v-layout>
        <v-layout row wrap>
            <v-flex xs12 sm6 offset-sm3>
                <v-card color="secondary" dark>
                    <v-container>
                        <v-form v-model="isFormValid" lazy-validation ref="form" @submit.prevent="handleSigninUser">
                            <v-layout row>
                                <v-flex xs12>
                                    <v-text-field :rules="usernameRules" v-model="username" prepend-icon="face" label="Username" type="text" required></v-text-field>
                                </v-flex>
                            </v-layout>
                            <v-layout row>
                                <v-flex xs12>
                                    <v-text-field v-model="password" :rules="passwordRules" prepend-icon="extension" label="Password" type="password" required></v-text-field>
                                </v-flex>
                            </v-layout>
                            <v-layout row>
                                <v-flex xs12>
                                    <v-btn :loading="loading" color="primary" type="submit" :disabled="loading || !isFormValid" @click.native="loader = 'loading'">
                                        Signin
                                        </v-btn>
                                    <h3>
                                        Don't have an account?
                                        <router-link to="/signup">Signup</router-link>
                                    </h3>
                                </v-flex>
                            </v-layout>
                        </v-form>
                    </v-container>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "Signin",
  data() {
    return {
        isFormValid: true,
      username: "",
      password: "",
      usernameRules:[
          //check if user provided username in input
          username => !!username || "Username is requierd",
          //make sure username is less than 10 chars.
          username => username.length < 10 || "Username must be les that 10 characters" 
      ],
      passwordRules: [
          password => !!password || "Paswword is required",
          password => password.length >=8 || "Password must be at least 8 characters"
      ]
    };
  },
  computed: {
    ...mapGetters(["user", "error", "loading"])
  },
  watch: {
    user(value) {
      if (value) {
        this.$router.push("/");
      }
    }
  },
  methods: {
    handleSigninUser() {
        if (this.$refs.form.validate()){
            this.$store.dispatch("signinUser", {
                username: this.username,
                password: this.password
            });
        }       
    }
  }
};
</script>

<style>
.custom-loader {
	animation: loader 1s infinite;
	display: flex;
}
@-moz-keyframes loader {
	from {
		transform: rotate(0);
	}
	to {
		transform: rotate(360deg);
	}
}
@-webkit-keyframes loader {
	from {
		transform: rotate(0);
	}
	to {
		transform: rotate(360deg);
	}
}
@-o-keyframes loader {
	from {
		transform: rotate(0);
	}
	to {
		transform: rotate(360deg);
	}
}
@keyframes loader {
	from {
		transform: rotate(0);
	}
	to {
		transform: rotate(360deg);
	}
}
</style>
