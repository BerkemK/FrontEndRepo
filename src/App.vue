<template>
  <div id="nav">
    <router-link to="/">Home</router-link> |
    <router-link to="/about">About</router-link>
    <br>
    <table>
      <tr>
        <td :style="{ color: canDrive === 'darf nicht Auto fahren' ? 'red' : 'green' }">
          <h1>{{ canDrive }}</h1>
        </td>
        <td>
          <img v-if="canDrive === 'darf nicht Auto fahren'" src="src/components/bilder/kreuz.jpg" alt="Hier sollte ein rotes Kreuz zu sehen sein">
          <img v-else src="src/components/bilder/haken.jpg" alt="hier sollte ein grüner Haken zu sehen sein">
        </td>
      </tr>
      <tr>
        <td colspan="2">
          <h2 v-if="countdownSeconds > 0">Countdown: {{ countdownSeconds }} Sekunden</h2>
        </td>
      </tr>
    </table>
  </div>
  <router-view/>
</template>

<script>
export default {
  name: 'app',
  data() {
    return {
      canDrive: '',
      countdownSeconds: 0,
      claims: ''
    };
  },
  created() {
    this.loadCanDrive();
    this.loadCountdown();
  },
  methods: {
    loadCanDrive() {
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
    loadCountdown() {
      const endpoint = 'http://localhost:8080/countdown';
      const requestOptions = {
        method: 'GET',
        redirect: 'follow'
      };
      fetch(endpoint, requestOptions)
          .then(response => response.text())
          .then(result => {
            this.countdownSeconds = result;
            this.startCountdown(); // Starte den Countdown nach dem Laden des Countdown-Werts
          })
          .catch(error => console.log('error', error));
    },
    startCountdown() {
      if (this.countdownSeconds > 0) {
        const countdownInterval = setInterval(() => {
          this.countdownSeconds--;
          if (this.countdownSeconds === 0) {
            clearInterval(countdownInterval);
          }
        }, 1000);
      }
    }
  }
};
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
