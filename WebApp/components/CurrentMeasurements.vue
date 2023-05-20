<template>
  <v-row justify="center" align="center" class="mx-1 pa-0 my-0">
    <VCol sm="12" md="4">
      <CurrentCondition />
    </VCol>
    <VCol sm="12" md="8">
      <VCard rounded="xl">
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
  import CurrentCondition from './widgets/CurrentCondition.vue'
</script>

<style scoped></style>
