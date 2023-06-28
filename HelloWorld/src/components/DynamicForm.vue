<template>
  <h3>{{ title }}</h3>
  <div>
    <button type="button" @click="deleteAll()">Delete All</button><br>
    <input v-model="nameField" placeholder="Name" type="text" ref="nameInput">
    <input v-model="alcGehaltField" placeholder="Alkoholgehalt" type="text" ref="alcGehaltInput">
    <input v-model="mlField" placeholder="Milliliter" type="text" ref="mlInput" @keyup.enter="save()">
    <button type="button" @click="save()">Save</button><br>
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
        <th></th> <!-- Added column for delete buttons -->
      </tr>
      </thead>
      <tbody>
      <tr v-if="items.length === 0">
        <td colspan="6">No products yet</td>
      </tr>
      <tr v-for="item in myFilterFunc(filterCrit)" :key="item.id">
        <td>{{ formatDateForDisplay(item.getrunken) }}</td>
        <td>{{ item.name }}</td>
        <td>{{ item.alcGehalt }}</td>
        <td>{{ item.ml }}</td>
        <td>{{ formatDateForDisplay(item.nuechtern) }}</td>
        <td>
          <button type="button" @click="deleteItem(item.id)">Delete</button>
        </td>
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
    };
  },
  methods: {
    myFilterFunc(crit) {
      return this.items.filter(
          it =>
              crit.length < 1 ||
              it.name.toLowerCase().includes(crit.toLowerCase())
      );
    },
    loadThings() {
      const endpoint = 'http://localhost:8080/drinks';
      const requestOptions = {
        method: 'GET',
        redirect: 'follow'
      };
      fetch(endpoint, requestOptions)
          .then(response => response.json())
          .then(result => {
            this.items = result.map(drink => ({
              ...drink,
              getrunken: moment(drink.getrunken, 'YYYY-MM-DDTHH:mm:ss').format(
                  'YYYY-MM-DD HH:mm:ss'
              ),
              nuechtern: moment(drink.nuechtern, 'YYYY-MM-DDTHH:mm:ss').format(
                  'YYYY-MM-DD HH:mm:ss'
              )
            }));
          })
          .catch(error => console.log('error', error));
    },
    formatDateForDisplay(dateString) {
      const formattedDate = moment(dateString).format('DD.MM.YYYY HH:mm:ss');
      return formattedDate;
    },
    save() {
      const endpoint = 'http://localhost:8080/drinks';
      const data = {
        name: this.nameField,
        alcGehalt: this.alcGehaltField,
        ml: this.mlField
      };
      const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      };
      fetch(endpoint, requestOptions)
          .then(response => response.json())
          .then(data => {
            console.log('Success:', data);
            setTimeout(function() {
              this.loadThings(); // Refresh the list after deletion
              location.reload();
            }, 2000); // Seite wird nach 2 Sekunden aktualisiert
          })
          .catch(error => console.log('error', error));

    },
    deleteItem(itemId) {
      const endpoint = `http://localhost:8080/drinks/${itemId}`;
      const requestOptions = {
        method: 'DELETE',
        redirect: 'follow'
      };
      fetch(endpoint, requestOptions)
          .then(response => response.json())
          .then(data => {
            console.log('Item deleted:', data);
            this.loadThings(); // Refresh the list after deletion
            location.reload();
          })
          .catch(error => console.log('error', error));
    },
    deleteAll() {
      const endpoint = `http://localhost:8080/drinks`;
      const requestOptions = {
        method: 'DELETE',
        redirect: 'follow'
      };
      fetch(endpoint, requestOptions)
          .then(response => response.json())
          .then(data => {
            console.log('Items deleted:', data);
            this.loadThings(); // Refresh the list after deletion
            location.reload();
          })
          .catch(error => console.log('error', error));
    },
    async setup() {
      if (this.$root.authenticated) {
        this.claims = await this.$auth.getUser();
      }
    }
  },
  async created() {
    await this.setup();
    this.loadThings();
  },
  mounted() {}
};
</script>

<style scoped>
@import "style.css";


</style>