<template>
  <div id="nav">
    <router-link to="/">Home</router-link> |
    <router-link to="/about">About</router-link>
    <br>
    <table>
      <tr>
          <td :style="{ color: canDrive === 'darf nicht Auto fahren' ? 'red' : 'green' }">
            <h1> {{ canDrive }} </h1>
          </td>
      </tr>
    </table>


  </div>
  <router-view/>


</template>

<script>
import moment from "moment/moment";

export default {
  name: 'app',
  data() {
    return { canDrive: '', claims: '' }
  },
  async created() {
    this.loadCanDrive();
    await this.isAuthenticated();
    this.$auth.authStateManager.subscribe(this.isAuthenticated);
  },
  watch: {
    // Everytime the route changes, check for auth status
    $route: 'isAuthenticated'
  },
  methods: {
    async isAuthenticated () {
      this.authenticated = await this.$auth.isAuthenticated()
    },
    async loadCanDrive() {
      const endpoint = 'http://localhost:8080/canDrive';
      const requestOptions = {
        method: 'GET',
        redirect: 'follow'
      };
      fetch(endpoint, requestOptions)
          .then(response => response.text())
          .then(result => {
            this.canDrive = result;
          })
          .catch(error => console.log('error', error));
    },

    async logout () {
      await this.$auth.signOut()
    }
  },}
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

table {
  margin-left: auto;
  margin-right: auto;
}
</style>