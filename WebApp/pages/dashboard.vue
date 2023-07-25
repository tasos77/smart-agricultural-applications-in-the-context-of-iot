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

  let timestamp = ref(0)
  let temp = ref(0)
  let currentMeasurements = ref({})

  const socket = new WebSocket('ws://localhost:8080')
  socket.onopen = function (event) {
    console.log('WebSocket connection opened:', event)
  }

  socket.onmessage = function (event) {
    let apiTelemetries = JSON.parse(event.data)
    timestamp = apiTelemetries.timestamp
    temp = apiTelemetries.temperature
    currentMeasurements = apiTelemetries
  }

  socket.onerror = function (error) {
    console.log('WebSocket error:', error)
  }

  socket.onclose = function (event) {
    console.log('WebSocket connection closed:', event.code)
  }
</script>

<style scoped></style>
