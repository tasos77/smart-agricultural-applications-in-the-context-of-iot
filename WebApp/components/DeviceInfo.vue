<template>
  <v-row align="stretch" justify="center" class="mx-3 pa-0 my-2">
    <VCol sm="12" md="4">
      <DeviceInfo />
    </VCol>
    <VCol sm="12" md="8">
      <VCard rounded="xl" color="color_surface_mixed_200">
        <VCardTitle>Current Measurements</VCardTitle>
        <Vrow class="d-flex flex-wrap">
          <VCol sm="12" md="4">
            <CurrentMeasurement :measurementName="'Humidity'" />
          </VCol>
          <VCol sm="12" md="4">
            <CurrentMeasurement :measurementName="'Soil Moisture'" />
          </VCol>
          <VCol sm="12" md="4">
            <CurrentMeasurement :measurementName="'UV Index'" />
          </VCol>
        </Vrow>
      </VCard>
    </VCol>
  </v-row>
</template>

<script setup lang="ts">
  import CurrentMeasurement from './widgets/CurrentMeasurement.vue'
  import DeviceInfo from './widgets/DeviceInfo.vue'
</script>

<style scoped></style>
