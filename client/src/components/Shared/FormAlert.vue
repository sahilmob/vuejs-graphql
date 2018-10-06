<template>
  <v-alert type="error" :value="true" dismissible>
    <h3>{{message}}</h3>
  </v-alert>
</template>

<script>
export default {
props: ['message'],

}
</script>

<style>
</style>
