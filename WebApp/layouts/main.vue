<template>
  <VApp>
    <NavigationDrawer />
    <VMain>
      <slot />
    </VMain>
  </VApp>
</template>

<script setup>
  import NavigationDrawer from '~/components/NavigationDrawer.vue'
</script>

<style>
  .v-main {
    background-color: #191e26 !important;
  }
</style>
