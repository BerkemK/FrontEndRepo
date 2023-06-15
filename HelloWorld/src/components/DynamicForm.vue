<template>
  <h3>{{ title }}</h3>
  <div>
    <input v-model="nameField" placeholder="Name" type="text" ref="nameInput">
    <input v-model="alcGehaltField" placeholder="Alkoholgehalt" type="text" ref="alcGehaltInput">
    <input v-model="mlField" placeholder="Milliliter" type="text" ref="mlInput" @keyup.enter="save()">
    <button type="button" @click="save()">Save</button>
    <input v-model="filterCrit" placeholder="Filterkriterium">
  </div>
  <div>
    <table>
      <thead>
      <tr>
        <th>getrunken</th>
        <th>Name</th>
        <th>Alkoholgehalt</th>
        <th>Milliliter</th>
        <th>nüchtern</th>
      </tr>
      </thead>
      <tbody>
      <tr v-if="items.length === 0">
        <td colspan="2">No products yet</td>
      </tr>
      <tr v-for="item in myFilterFunc(filterCrit)" :key="item.id">
        <td>{{ formatDateForDisplay(item.getrunken) }}</td>
        <td>{{ item.name }}</td>
        <td>{{ item.alcGehalt }}</td>
        <td>{{ item.ml }}</td>
        <td>{{ formatDateForDisplay(item.nuechtern) }}</td>
      </tr>
      <tr>
        <td>{{ nameField }}</td>
        <td>{{ alcGehaltField }}</td>
        <td>{{ mlField }}</td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import moment from 'moment';
export default {
  name: 'DynamicForm',
  props: ['title'],
  data() {
    return {
      items: [],
      nameField: '',
      alcGehaltField: '',
      mlField: '',
      claims: '',
      accessToken: '',
      filterCrit: ''
    }
  },
  methods: {
    myFilterFunc(crit) {
      return this.items.filter(
          it => crit.length < 1 ||
              it.name.toLowerCase().includes(crit.toLowerCase())
      )
    },
    loadThings() {
      //const baseUrl = process.env.VUE_APP_BACKEND_BASE_URL
      //const email = this.claims.email
      //const endpoint = baseUrl + '/drinks' + '?owner=' + email
      const endpoint = 'http://localhost:8080/drinks'
      const requestOptions = {
        method: 'GET',
        redirect: 'follow'
        // headers: {
        //   Authorization: 'Bearer ' + this.accessToken
        // }
      }
      fetch(endpoint, requestOptions)
          .then(response => response.json())
          .then(result => {
            this.items = result.map(drink => ({
              ...drink,
              getrunken: moment(drink.getrunken, 'YYYY-MM-DDTHH:mm:ss').format('YYYY-MM-DD HH:mm:ss'),
              nuechtern: moment(drink.nuechtern, 'YYYY-MM-DDTHH:mm:ss').format('YYYY-MM-DD HH:mm:ss')
            }))
          })
          .catch(error => console.log('error', error))
    },
    formatDateForDisplay(dateString) {
      const formattedDate = moment(dateString).format('DD.MM.YYYY HH:mm:ss');
      return formattedDate;
    },
    save() {
      //const baseUrl = process.env.VUE_APP_BACKEND_BASE_URL
      //const endpoint = baseUrl + '/drinks'
      const endpoint = 'http://localhost:8080/drinks'
      const data = {
        name: this.nameField,
        alcGehalt: this.alcGehaltField,
        ml: this.mlField,
        //owner: this.claims.email
      }
      const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
          // Authorization: 'Bearer ' + this.accessToken
        },
        body: JSON.stringify(data)
      }
      fetch(endpoint, requestOptions)
          .then(response => response.json())
          .then(data => {
            console.log('Success:', data)
          })
          .catch(error => console.log('error', error))
    },
    async setup() {
      if (this.$root.authenticated) {
        this.claims = await this.$auth.getUser()
        // this.accessToken = await this.$auth.getAccessToken()
      }
    }
  },
  async created() {
    await this.setup()
    this.loadThings()
  },
  mounted() {}
}
</script>

<style scoped>
table {
  margin-left: auto;
  margin-right: auto;
}

button {
  color: blue;
}
</style>
