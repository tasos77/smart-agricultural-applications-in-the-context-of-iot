<template>
  <v-row align="stretch" justify="center" class="mx-3 pa-0 my-2">
    <VCol sm="12" md="4">
      <DeviceInfo />
    </VCol>
    <VCol sm="12" md="8">
      <Forecast />
    </VCol>
  </v-row>
</template>

<script setup lang="ts">
  import Forecast from './widgets/Forecast.vue'
  import DeviceInfo from './widgets/DeviceInfo.vue'
</script>

<style scoped></style>
