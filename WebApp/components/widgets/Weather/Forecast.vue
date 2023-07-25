<template>
  <VCard rounded="xl" color="color_surface_mixed_200">
    <v-row
      v-for="(forecast, index) in forecasts"
      :key="index"
      class="mx-0 my-5 pa-0"
      align="center"
    >
      <VCol align="center" class="pa-0">
        <ClientOnly>
          <div style="height: 50px; width: 50px">
            <lottie-animation :animation-data="forecast.lottie" :autoplay="true" :loop="true" />
          </div>
        </ClientOnly>
      </VCol>
      <VCol align="center"
        ><span class="text-h5">{{ forecast.maxTemp }}/</span
        ><span class="text-h6">{{ forecast.minTemp }}</span>
      </VCol>
      <VCol align="center" class="text-caption">{{ forecast.date }}</VCol>
      <VCol align="center" class="text-body-2">{{ forecast.day }}</VCol>
    </v-row>
  </VCard>
</template>

<script setup lang="ts">
  import index from '../../../assets/animations/index'

  const forecasts = ref([
    { lottie: index['clear_day'], minTemp: '24C', maxTemp: '30C', date: '15 July', day: 'Tuesday' },
    {
      lottie: index['clear_night'],
      minTemp: '24C',
      maxTemp: '30C',
      date: '15 July',
      day: 'Wednesday'
    },
    { lottie: index['rain'], minTemp: '24C', maxTemp: '30C', date: '15 July', day: 'Thursday' },
    { lottie: index['rain'], minTemp: '24C', maxTemp: '30C', date: '15 July', day: 'Friday' },
    { lottie: index['rain'], minTemp: '24C', maxTemp: '30C', date: '15 July', day: 'Saturday' }
  ])
</script>
