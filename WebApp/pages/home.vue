<template>
  <div>
    <CurrentMeasurements />
    <AdditionalInfo />
  </div>
</template>

<script setup lang="ts">
  import CurrentMeasurements from '~/components/CurrentMeasurements.vue'
  import AdditionalInfo from '~/components/AdditionalInfo.vue'
  definePageMeta({
    layout: 'main'
  })
  const devices = `myDevices`
</script>

<style scoped></style>
