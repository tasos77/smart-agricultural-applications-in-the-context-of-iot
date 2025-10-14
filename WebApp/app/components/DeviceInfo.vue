<script setup lang="ts">
  import CurrentCondition from './widgets/Weather/CurrentCondition.vue'
  import CurrentMeasurement from './widgets/Weather/CurrentMeasurement.vue'

  let props = withDefaults(
    defineProps<{
      currentMeasurements?: Object
    }>(),
    {
      currentMeasurements: () => {
        return {
          timestamp: 0,
          temperature: 0,
          humidity: 0,
          rain: 0,
          soilMoisture: 0,
          uv: 0,
          temp: 0
        }
      }
    }
  )

  const showWaterAlert = computed(() => {
    return props.currentMeasurements.rain < 20 &&
      props.currentMeasurements.humidity < 40 &&
      props.currentMeasurements.soilMoisture < 50
      ? true
      : false
  })
</script>

<template>
  <VCard class="ma-4" color="color_surface_mixed_200">
    <VCardTitle>Current Measurements</VCardTitle>
    <VRow align="stretch" justify="center" class="pa-0 ma-0">
      <VCol sm="12" md="4">
        <CurrentCondition
          :timestamp="props.currentMeasurements.timestamp"
          :temp="props.currentMeasurements.temperature"
          :icon="props.currentMeasurements.icon"
          :showWaterAlert="showWaterAlert"
        />
      </VCol>
      <VCol sm="12" md="8">
        <VCard rounded="xl" color="color_surface_mixed_300">
          <VRow class="ma-0 pa-0">
            <VCol sm="12" md="6" class="pa-0 ma-0">
              <div class="pa-3">
                <CurrentMeasurement
                  :measurementName="'Humidity'"
                  :measurement="props.currentMeasurements.humidity"
                />
              </div>
            </VCol>
            <VCol sm="12" md="6" class="pa-0 ma-0">
              <div class="pa-3">
                <CurrentMeasurement
                  :measurementName="'Soil Moisture'"
                  :measurement="props.currentMeasurements.soilMoisture"
                />
              </div>
            </VCol>
            <VCol sm="12" md="6" class="pa-0 ma-0">
              <div class="pa-3">
                <CurrentMeasurement
                  :measurementName="'UV Index'"
                  :measurement="props.currentMeasurements.uv"
                />
              </div>
            </VCol>
            <VCol sm="12" md="6" class="pa-0 ma-0">
              <div class="pa-3">
                <CurrentMeasurement
                  :measurementName="'Rain'"
                  :measurement="props.currentMeasurements.rain"
                />
              </div>
            </VCol>
          </VRow>
        </VCard>
      </VCol>
    </VRow>
  </VCard>
</template>
