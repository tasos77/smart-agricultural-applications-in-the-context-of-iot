<template>
  <v-row align="stretch" justify="center" class="mx-3 pa-0 my-0">
    <VCol sm="12" md="4" class="d-flex justify-start align-center">
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
