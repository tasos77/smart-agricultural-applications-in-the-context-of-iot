<template>
  <VCard class="h-100" rounded="xl">
    <VCardTitle>
      <div>{{ deviceName }}</div>
      <div>{{ deviceStatus }}</div></VCardTitle
    >
    <VCardText>
      <div>{{ deviceProtocolName }}</div>
      <div>{{ deviceProtocolStatus }}</div>
      <div>{{ deviceProtocolTopics }}</div>
      <div>{{ deviceSensorCondition }}</div>
    </VCardText>
  </VCard>
</template>

<script setup lang="ts">
  const deviceName = ref('ESP8266')
  const deviceStatus = ref(true)
  const deviceProtocolName = ref('MQTT')
  const deviceProtocolStatus = ref(true)
  const deviceProtocolTopics = ref([`Forecast`, `Water Supply`])
  const deviceSensorCondition = ref([
    {
      sensorName: 'tempSensor',
      status: true
    },
    {
      sensorName: 'humiditySensor',
      status: true
    },
    { sensorName: 'soilMoistureSensor', status: false }
  ])
  const deviceBatteryLvl = ref('100%')
</script>

<style scoped></style>
