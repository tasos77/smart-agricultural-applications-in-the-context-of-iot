<template>
  <VRow align="stretch" justify="center" class="pa-0 mt-2 mb-0">
    <VCol sm="12" md="4">
      <DeviceState />
    </VCol>
    <VCol sm="12" md="8">
      <VCard rounded="xl" color="color_surface_mixed_200">
        <VCardTitle>Current Measurements</VCardTitle>
        <VRow class="d-flex flex-wrap ma-0 pa-0">
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
                :measurement="props.currentMeasurements.UV"
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
</template>

<script setup lang="ts">
  import CurrentMeasurement from './widgets/Device/CurrentMeasurement.vue'
  import DeviceState from './widgets/Device/DeviceState.vue'

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
          uv: 0
        }
      }
    }
  )
</script>

<style scoped></style>
