<template>
  <h3>{{ title }}</h3>
  <div>
    <button type="button" @click="deleteDatabase()">Delete Database</button>
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
        <th></th>
      </tr>
      </thead>
      <tbody>
      <tr v-if="items.length === 0">
        <td colspan="5">No products yet</td>
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
          it => crit.length < 1 ||
              it.name.toLowerCase().includes(crit.toLowerCase())
      );
    },
    async loadDrinks() {
      const endpoint = 'http://localhost:8080/drinks';
      const requestOptions = {
        method: 'GET',
        redirect: 'follow'
      };
      try {
        const response = await fetch(endpoint, requestOptions);
        const result = await response.json();
        this.items = result.map(drink => ({
          ...drink,
          getrunken: moment(drink.getrunken, 'YYYY-MM-DDTHH:mm:ss').format('YYYY-MM-DD HH:mm:ss'),
          nuechtern: moment(drink.nuechtern, 'YYYY-MM-DDTHH:mm:ss').format('YYYY-MM-DD HH:mm:ss')
        }));
      } catch (error) {
        console.log('error', error);
      }
    },
    formatDateForDisplay(dateString) {
      const formattedDate = moment(dateString).format('DD.MM.YYYY HH:mm:ss');
      return formattedDate;
    },
    async save() {
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
      try {
        const response = await fetch(endpoint, requestOptions);
        const responseData = await response.json();
        console.log('Success:', responseData);
        await this.loadDrinks();
      } catch (error) {
        console.log('error', error);
      }
    },
    async deleteItem(itemId) {
      const endpoint = `http://localhost:8080/drinks/${itemId}`;
      const requestOptions = {
        method: 'DELETE'
      };
      try {
        const response = await fetch(endpoint, requestOptions);
        const responseData = await response.json();
        console.log('Success:', responseData);
        await this.loadDrinks();
      } catch (error) {
        console.log('error', error);
      }
    },
    async deleteDatabase() {
      const endpoint = 'http://localhost:8080/drinks';
      const requestOptions = {
        method: 'DELETE'
      };
      try {
        const response = await fetch(endpoint, requestOptions);
        const responseData = await response.json();
        console.log('Success:', responseData);
        this.items = [];
        await this.loadDrinks();
      } catch (error) {
        console.log('error', error);
      }
    },
    async setup() {
      if (this.$root.authenticated) {
        this.claims = await this.$auth.getUser();
      }
    }
  },
  async created() {
    await this.setup();
    await this.loadDrinks();
  },
  mounted() {}
};
</script>

<style scoped>
@import "./style.css";
table {
  margin-left: auto;
  margin-right: auto;
}

button {
  color: blue;
}
</style>
