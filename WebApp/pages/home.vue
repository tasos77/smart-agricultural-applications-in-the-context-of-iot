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
  const devices = `myDevices`
</script>

<style scoped></style>
