<template>
  <div>
    <Weather />
    <DeviceInfo />
  </div>
</template>

<script setup lang="ts">
  import Weather from '~/components/Weather.vue'
  import DeviceInfo from '~/components/DeviceInfo.vue'
  definePageMeta({
    layout: 'main'
  })

  const socket = new WebSocket('ws://localhost:8080')
  socket.onopen = function (event) {
    console.log('WebSocket connection opened:', event)
  }

  socket.onmessage = function (event) {
    console.log(JSON.parse(event.data))
  }

  socket.onerror = function (error) {
    console.log('WebSocket error:', error)
  }

  socket.onclose = function (event) {
    console.log('WebSocket connection closed:', event.code)
  }
</script>

<style scoped></style>
