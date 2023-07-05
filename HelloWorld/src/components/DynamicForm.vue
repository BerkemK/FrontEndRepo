<template>
  <h3>{{ title }}</h3>
  <div>
    <button type="button" @click="deleteAll()" :style="{ color: canDrive === 'darf nicht Auto fahren' ? 'red' : 'green' }"
    >Delete All</button><br>
    <input v-model="nameField" placeholder="Name" type="text" ref="nameInput">
    <input v-model="alcGehaltField" placeholder="Alkoholgehalt" type="text" ref="alcGehaltInput">
    <input v-model="mlField" placeholder="Milliliter" type="text" ref="mlInput" @keyup.enter="save()">
    <button type="button" @click="save()" :style="{ color: canDrive === 'darf nicht Auto fahren' ? 'red' : 'green' }"
    >Save</button><br>
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
          <button type="button" @click="deleteItem(item.id)" :style="{ color: canDrive === 'darf nicht Auto fahren' ? 'red' : 'green' }"
          >Delete</button>
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
      filterCrit: '',
      canDrive: ''
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
    loadDrinks() {
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
          .then(response => {
            console.log('Success:', data);
              this.loadDrinks();
              location.reload();
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
          .then(response => {
            console.log('Items deleted:', itemId);
            // Remove the item from the local array
            this.items = this.items.filter(item => item.id !== itemId);
            this.loadDrinks();
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
          .then(response => {
            console.log('Items deleted');
            this.loadDrinks();
            location.reload();
            this.items = [];
          })
          .catch(error => console.log('error', error));
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
    async setup() {
      if (this.$root.authenticated) {
        this.claims = await this.$auth.getUser();
      }
    }
  },
  async created() {
    await this.setup();
    this.loadDrinks();
    this.loadCanDrive();
  },
  mounted() {}
};
</script>

<style scoped>
@import "style.css";


</style>
