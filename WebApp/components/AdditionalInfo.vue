<template>
  <v-row align="center" justify="center" class="mx-1">
    <VCol sm="12" md="4">
      <DeviceInfo />
    </VCol>
    <VCol sm="12" md="8">
      <VCard rounded="xl">
        <Forecast />
      </VCard>
    </VCol>
  </v-row>
</template>

<script setup lang="ts">
  import Forecast from './widgets/Forecast.vue'
  import DeviceInfo from './widgets/DeviceInfo.vue'
</script>

<style scoped></style>
