<script setup lang="ts">
  import index from '~/assets/animations/index'
  const model = ref(null)
  const forecasts = ref([
    {
      lottie: index['clear_day'],
      minTemp: '24°C',
      maxTemp: '30°C',
      date: '15 July',
      day: 'Tuesday'
    },
    {
      lottie: index['clear_night'],
      minTemp: '24°C',
      maxTemp: '30°C',
      date: '15 July',
      day: 'Wednesday'
    },
    { lottie: index['rain'], minTemp: '24°C', maxTemp: '30°C', date: '15 July', day: 'Thursday' },
    { lottie: index['rain'], minTemp: '24°C', maxTemp: '30°C', date: '15 July', day: 'Friday' },
    { lottie: index['rain'], minTemp: '24°C', maxTemp: '30°C', date: '15 July', day: 'Saturday' },
    { lottie: index['rain'], minTemp: '24°C', maxTemp: '30°C', date: '15 July', day: 'Saturday' },
    {
      lottie: index['clear_day'],
      minTemp: '24°C',
      maxTemp: '30°C',
      date: '15 July',
      day: 'Tuesday'
    },
    {
      lottie: index['clear_night'],
      minTemp: '24°C',
      maxTemp: '30°C',
      date: '15 July',
      day: 'Wednesday'
    },
    { lottie: index['rain'], minTemp: '24°C', maxTemp: '30°C', date: '15 July', day: 'Thursday' },
    { lottie: index['rain'], minTemp: '24°C', maxTemp: '30°C', date: '15 July', day: 'Friday' },
    { lottie: index['rain'], minTemp: '24°C', maxTemp: '30°C', date: '15 July', day: 'Saturday' },
    { lottie: index['rain'], minTemp: '24°C', maxTemp: '30°C', date: '15 July', day: 'Saturday' },
    {
      lottie: index['clear_day'],
      minTemp: '24°C',
      maxTemp: '30°C',
      date: '15 July',
      day: 'Tuesday'
    },
    {
      lottie: index['clear_night'],
      minTemp: '24°C',
      maxTemp: '30°C',
      date: '15 July',
      day: 'Wednesday'
    },
    { lottie: index['rain'], minTemp: '24°C', maxTemp: '30°C', date: '15 July', day: 'Thursday' },
    { lottie: index['rain'], minTemp: '24°C', maxTemp: '30°C', date: '15 July', day: 'Friday' },
    { lottie: index['rain'], minTemp: '24°C', maxTemp: '30°C', date: '15 July', day: 'Saturday' },
    { lottie: index['rain'], minTemp: '24°C', maxTemp: '30°C', date: '15 July', day: 'Saturday' },
    {
      lottie: index['clear_day'],
      minTemp: '24°C',
      maxTemp: '30°C',
      date: '15 July',
      day: 'Tuesday'
    },
    {
      lottie: index['clear_night'],
      minTemp: '24°C',
      maxTemp: '30°C',
      date: '15 July',
      day: 'Wednesday'
    },
    { lottie: index['rain'], minTemp: '24°C', maxTemp: '30°C', date: '15 July', day: 'Thursday' },
    { lottie: index['rain'], minTemp: '24°C', maxTemp: '30°C', date: '15 July', day: 'Friday' },
    { lottie: index['rain'], minTemp: '24°C', maxTemp: '30°C', date: '15 July', day: 'Saturday' },
    { lottie: index['rain'], minTemp: '24°C', maxTemp: '30°C', date: '15 July', day: 'Saturday' }
  ])
</script>

<template>
  <VCard class="ma-4" color="color_surface_mixed_200">
    <VCardTitle>Forecast (24h)</VCardTitle>
    <v-sheet class="mx-auto" elevation="8" color="color_surface_mixed_300">
      <v-slide-group v-model="model" class="pa-0">
        <v-slide-group-item
          v-for="(forecast, index) in forecasts"
          :key="index"
          v-slot="{ isSelected, toggle, selectedClass }"
        >
          <v-card
            rounded="lg"
            elevation="3"
            color="color_surface_mixed_400"
            :class="['ma-4', selectedClass]"
            height="200"
            width="100"
            @click="toggle"
          >
            <div class="d-flex justify-center align-center">
              <div>
                <client-only>
                  <Vue3Lottie :animation-data="forecast.lottie" height="auto" width="auto" />
                </client-only>
                <div class="d-flex align-baseline justify-center">
                  <span class="text-body-1">{{ forecast.maxTemp }}/</span>
                  <span class="text-body-2">{{ forecast.minTemp }}</span>
                </div>
                <div class="d-flex justify-center align-center">{{ forecast.date }}</div>
                <div class="d-flex justify-center align-center">
                  {{ forecast.day }}
                </div>
              </div>
            </div>

            <div class="d-flex fill-height align-center justify-center">
              <v-scale-transition>
                <v-icon
                  v-if="isSelected"
                  color="white"
                  size="48"
                  icon="mdi-close-circle-outline"
                ></v-icon>
              </v-scale-transition>
            </div>
          </v-card>
        </v-slide-group-item>
      </v-slide-group>
    </v-sheet>
  </VCard>
</template>
