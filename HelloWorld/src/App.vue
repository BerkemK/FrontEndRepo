<template>
  <div id="nav">
    <router-link to="/">Home</router-link> |
    <router-link to="/about">About</router-link>
  </div>
  <div>can drive {{canDrive}}</div>
  <router-view/>


</template>

<script>
import moment from "moment/moment";

export default {
  name: 'app',
  data: function () {
    return { authenticated: false, canDrive: null }
  },
  async created() {
    await this.isAuthenticated();
    this.$auth.authStateManager.subscribe(this.isAuthenticated);
    this.loadCanDrive();
  },
  watch: {
    // Everytime the route changes, check for auth status
    $route: 'isAuthenticated'
  },
  methods: {
    async isAuthenticated () {
      this.authenticated = await this.$auth.isAuthenticated()
    },
    loadCanDrive() {
      //const baseUrl = process.env.VUE_APP_BACKEND_BASE_URL
      //const email = this.claims.email
      //const endpoint = baseUrl + '/canDrive' + '?owner=' + email
      const endpoint = 'http://localhost:8080/canDrive'
      const requestOptions = {
        method: 'GET',
        redirect: 'follow'
        // headers: {
        //   Authorization: 'Bearer ' + this.accessToken
        // }
      }
      fetch(endpoint, requestOptions)
          .then(response => response.json())
          .then(result => { this.canDrive = result;
          })
          .catch(error => console.log('error', error))
    },
    async logout () {
      await this.$auth.signOut()
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
