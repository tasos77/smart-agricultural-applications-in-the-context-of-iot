<template>
  <v-row align="stretch" justify="center" class="pa-0 ma-0">
    <VCol sm="12" md="4">
      <CurrentCondition :timestamp="props.timestamp" :temp="props.temp" />
    </VCol>
    <VCol sm="12" md="8">
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
