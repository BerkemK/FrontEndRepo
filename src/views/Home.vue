<template>
  <div id="home" class="home">
    <h1 class="page-title">Alkoholrechner</h1>
    <DynamicForm title="Was haben Sie heute getrunken?" />
  </div>
</template>

<script>
// @ is an alias to /src
import DynamicForm from '@/components/DynamicForm.vue'

export default {
  name: 'Home',
  components: {
    DynamicForm
  },
  data: function () {
    return {
      claims: ''
    }
  },
  created() {
    this.setup()
  },
  methods: {
    async setup() {
      if (this.$root.authenticated) {
        this.claims = await this.$auth.getUser()
      }
    }
  }
}
</script>

<style>
.page-title {
  text-align: center;
}
</style>
