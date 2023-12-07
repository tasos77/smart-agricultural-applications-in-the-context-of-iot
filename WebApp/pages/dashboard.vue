<template>
  <div>
    <Weather :timestamp="timestamp" :temp="temp" />
    <DeviceInfo :currentMeasurements="currentMeasurements" />
  </div>
</template>

<script setup lang="ts">
  import Weather from '~/components/Weather.vue'
  import DeviceInfo from '~/components/DeviceInfo.vue'
  definePageMeta({
    layout: 'main'
  })

  const timestamp = ref(0)
  const temp = ref(0)
  const currentMeasurements = ref({})

  const socket = new WebSocket('ws://localhost:8080')
  socket.onopen = function (event) {
    console.log('WebSocket connection opened:', event)
  }

  socket.onmessage = function (event) {
    let apiTelemetries = JSON.parse(event.data)
    console.log(apiTelemetries)
    timestamp.value = apiTelemetries.timestamp
    temp.value = apiTelemetries.temperature
    currentMeasurements.value = apiTelemetries
  }

  socket.onerror = function (error) {
    console.log('WebSocket error:', error)
  }

  socket.onclose = function (event) {
    console.log('WebSocket connection closed:', event.code)
  }
</script>

<style scoped></style>
