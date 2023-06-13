<template>
  <div id="home" class="home">
    <DynamicForm title="Let's talk to the backend!"/>
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
  created () { this.setup() },
  methods: {
    async setup () {
      if (this.$root.authenticated) { this.claims = await this.$auth.getUser() }
    }
  }
}
</script>
