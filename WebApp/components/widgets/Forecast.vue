<template>
  <div>
    <v-row
      v-for="(forecast, index) in forecasts"
      :key="index"
      class="mx-0 my-5 pa-0"
      align="center"
    >
      <VCol class="text-h5" align="center">{{ forecast.icon }}</VCol>
      <VCol align="center"
        ><span class="text-h5">{{ forecast.maxTemp }}/</span
        ><span class="text-h6">{{ forecast.minTemp }}</span>
      </VCol>
      <VCol align="center" class="text-caption">{{ forecast.date }}</VCol>
      <VCol align="center" class="text-body-2">{{ forecast.day }}</VCol>
    </v-row>
  </div>
</template>

<script setup lang="ts">
  const forecasts = ref([
    { icon: 'icon', minTemp: '24C', maxTemp: '30C', date: '15 July', day: 'Tuesday' },
    { icon: 'icon', minTemp: '24C', maxTemp: '30C', date: '15 July', day: 'Wednesday' },
    { icon: 'icon', minTemp: '24C', maxTemp: '30C', date: '15 July', day: 'Thursday' },
    { icon: 'icon', minTemp: '24C', maxTemp: '30C', date: '15 July', day: 'Friday' },
    { icon: 'icon', minTemp: '24C', maxTemp: '30C', date: '15 July', day: 'Saturday' }
  ])
</script>
