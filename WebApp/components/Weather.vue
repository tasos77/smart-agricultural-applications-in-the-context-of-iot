<template>
  <v-row justify="center" align="stretch" class="mx-3 pa-0 my-0 mt-3 h-50">
    <VCol sm="12" md="4">
      <CurrentCondition />
    </VCol>

    <VCol sm="12" md="8" class="d-flex flex-wrap">
      <Forecast />
    </VCol>
  </v-row>
</template>

<script setup lang="ts">
  import Forecast from './widgets/Forecast.vue'
  import CurrentCondition from './widgets/CurrentCondition.vue'
</script>

<style scoped></style>
