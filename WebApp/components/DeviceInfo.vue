<template>
  <VRow align="stretch" justify="center" class="mx-3 pa-0 mt-2 mb-0">
    <VCol sm="12" md="4">
      <DeviceState />
    </VCol>
    <VCol sm="12" md="8">
      <VCard rounded="xl" color="color_surface_mixed_200">
        <VCardTitle>Current Measurements</VCardTitle>
        <VRow class="d-flex flex-wrap">
          <VCol sm="12" md="6">
            <CurrentMeasurement
              :measurementName="'Humidity'"
              :measurement="props.currentMeasurements.humidity"
            />
          </VCol>
          <VCol sm="12" md="6">
            <CurrentMeasurement
              :measurementName="'Soil Moisture'"
              :measurement="props.currentMeasurements.soilMoisture"
            />
          </VCol>
          <VCol sm="12" md="6">
            <CurrentMeasurement
              :measurementName="'UV Index'"
              :measurement="props.currentMeasurements.UV"
            />
          </VCol>
          <VCol sm="12" md="6">
            <CurrentMeasurement
              :measurementName="'Rain'"
              :measurement="props.currentMeasurements.rain"
            />
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
