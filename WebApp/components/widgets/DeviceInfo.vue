<template>
  <VCard rounded="xl" class="h-100 w-100">
    <VCardTitle>
      <VRow class="pa-0 ma-0" justify="space-between">
        <div>{{ deviceName }}</div>
        <div>{{ deviceStatus }}</div>
      </VRow>
    </VCardTitle>

    <VCardText>
      <VDivider />
      <VCard
        class="mt-4"
        v-for="(deviceCondition, index) in deviceConditions"
        :key="index"
        rounded="lg"
      >
        <VCardText class="pa-0 ma-0">
          <VRow class="pa-0 ma-0" align="center" justify="center">
            <VCol cols="2" class="pa-0 ma-0 d-flex justify-center">
              <VIcon size="xxx-large">{{ deviceCondition.icon }}</VIcon>
            </VCol>
            <VCol cols="10">
              <div>
                <h4>{{ deviceCondition.component }}</h4>
              </div>
              <VRow class="ma-0 pa-0">
                <VProgressLinear
                  color="blue-lighten-3"
                  :model-value="deviceCondition.percValue"
                ></VProgressLinear>
                <div>{{ deviceCondition.percValue }}%</div>
              </VRow>
            </VCol>
          </VRow>
        </VCardText>
      </VCard>

      <VCard class="mt-4" rounded="lg">
        <VCardText class="pa-0 ma-0">
          <VRow class="pa-0 ma-0" align="start" justify="center">
            <VCol cols="2" class="d-flex justify-center">
              <VIcon size="xxx-large">mdi-chip</VIcon>
            </VCol>
            <VCol cols="10">
              <div>
                <h4>Sensors</h4>
              </div>
              <VDivider />
              <VRow
                class="ma-0 pa-0"
                align="center"
                justify="space-between"
                v-for="(sensor, index) in sensorsStatus"
                :key="index"
              >
                <div>
                  <h5>{{ sensor.sensorName }}</h5>
                </div>
                <div>{{ sensor.status }}</div>
              </VRow>

              <!-- <VRow class="ma-0 pa-0">
                <VProgressLinear
                  color="blue-lighten-3"
                  :model-value="deviceCondition.percValue"
                ></VProgressLinear>
                <div>{{ deviceCondition.percValue }}%</div>
              </VRow> -->
            </VCol>
          </VRow>
        </VCardText>
      </VCard>

      <!-- <div>{{ deviceProtocolName }}</div>
      <div>{{ deviceProtocolStatus }}</div>
      <div>{{ deviceProtocolTopics }}</div>
      <div>{{ deviceSensorCondition }}</div> -->
    </VCardText>
  </VCard>
</template>

<script setup lang="ts">
  const deviceName = ref('ESP8266')
  const deviceStatus = ref(true)

  const deviceConditions = ref([
    {
      icon: 'mdi-battery-charging',
      component: 'Battery',
      percValue: 20
    },
    {
      icon: 'mdi-memory',
      component: 'Memory',
      percValue: 50
    }
  ])

  const sensorsStatus = [
    { sensorName: `Temperature`, status: true },
    { sensorName: `Humidiy`, status: true },
    { sensorName: `Soil Moisture`, status: true },
    { sensorName: `UV Index`, status: false }
  ]

  // const deviceProtocolName = ref('MQTT')
  // const deviceProtocolStatus = ref(true)
  // const deviceProtocolTopics = ref([`Forecast`, `Water Supply`])
  // const deviceSensorCondition = ref([
  //   {
  //     sensorName: 'tempSensor',
  //     status: true
  //   },
  //   {
  //     sensorName: 'humiditySensor',
  //     status: true
  //   },
  //   { sensorName: 'soilMoistureSensor', status: false }
  // ])
  // const deviceBatteryLvl = ref('100%')
</script>

<style scoped></style>
