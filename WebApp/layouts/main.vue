<template>
  <Vapp>
    <VLayout>
      <NavigationDrawer />

      <v-main>
        <slot />
      </v-main>
    </VLayout>
  </Vapp>
</template>

<script setup>
  import NavigationDrawer from '~/components/NavigationDrawer.vue'
</script>
