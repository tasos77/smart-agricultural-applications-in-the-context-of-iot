<template>
  <v-row justify="center" align="stretch" class="mx-3 pa-0 my-0 mt-3 h-50">
    <VCol sm="12" md="4">
      <CurrentCondition :timestamp="props.timestamp" :temp="props.temp" />
    </VCol>

    <VCol sm="12" md="8" class="d-flex flex-wrap">
      <Forecast />
    </VCol>
  </v-row>
</template>

<script setup lang="ts">
  import Forecast from './widgets/Weather/Forecast.vue'
  import CurrentCondition from './widgets/Weather/CurrentCondition.vue'

  let props = withDefaults(
    defineProps<{
      timestamp?: number
      temp?: number
    }>(),
    {
      timestamp: 0,
      temp: 0
    }
  )
</script>

<style scoped></style>
