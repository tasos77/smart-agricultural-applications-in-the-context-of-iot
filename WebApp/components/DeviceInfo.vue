<template>
  <v-row align="stretch" justify="center" class="mx-3 pa-0 mt-2 mb-0">
    <VCol sm="12" md="4">
      <DeviceState />
    </VCol>
    <VCol sm="12" md="8">
      <VCard rounded="xl" color="color_surface_mixed_200">
        <VCardTitle>Current Measurements</VCardTitle>
        <Vrow class="d-flex flex-wrap">
          <VCol sm="12" md="6">
            <CurrentMeasurement :measurementName="'Humidity'" />
          </VCol>
          <VCol sm="12" md="6">
            <CurrentMeasurement :measurementName="'Soil Moisture'" />
          </VCol>
          <VCol sm="12" md="6">
            <CurrentMeasurement :measurementName="'UV Index'" />
          </VCol>
          <VCol sm="12" md="6">
            <CurrentMeasurement :measurementName="'Rain'" />
          </VCol>
        </Vrow>
      </VCard>
    </VCol>
  </v-row>
</template>

<script setup lang="ts">
  import CurrentMeasurement from './widgets/Device/CurrentMeasurement.vue'
  import DeviceState from './widgets/Device/DeviceState.vue'
</script>

<style scoped></style>
