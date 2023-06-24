<template>
  <div id="nav">
    <router-link to="/">Home</router-link> |
    <router-link to="/about">About</router-link>
    <br>
    <table>
      <tr>
          <td v-if="dataLoaded">
            {{ canDrive }}
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
    return { canDrive: '', claims: '', dataLoaded: false }
  },
  async created() {
    await this.isAuthenticated();
    this.$auth.authStateManager.subscribe(this.isAuthenticated);
    await this.loadCanDrive();
    this.dataLoaded = true; // Daten sind geladen
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

      try {
        const response = await fetch(endpoint, requestOptions);
        const result = await response.json();
        this.canDrive = result;
      } catch (error) {
        console.log('error', error);
      }
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