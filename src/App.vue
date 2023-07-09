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
          <img v-if="canDrive === 'darf nicht Auto fahren'" src="src/assets/kreuz.jpg" alt="Hier sollte ein rotes Kreuz zu sehen sein">
          <img v-else src="src/assets/haken.jpg" alt="hier sollte ein grüner Haken zu sehen sein">
        </td>
      </tr>
    </table>
    <table>
      <tr>
        <td colspan="2">
          <h3 v-if="hours > 0">{{ hours }} Stunden</h3>
        </td>
        <td colspan="2">
          <h3 v-if="minutes > 0">{{ minutes }} Minuten</h3>
        </td>
        <td colspan="2">
          <h3 v-if="seconds > 0">{{ seconds }} Sekunden</h3>
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
      hours: 0,
      minutes: 0,
      seconds: 0
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
        const countdownTimer = setInterval(() => {
          this.countdownSeconds--;
          if (this.countdownSeconds === 0) {
            clearInterval(countdownTimer);
          }
          this.hours = Math.floor(this.countdownSeconds / 3600);
          this.minutes = Math.floor((this.countdownSeconds % 3600) / 60);
          this.seconds = this.countdownSeconds % 60;
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
