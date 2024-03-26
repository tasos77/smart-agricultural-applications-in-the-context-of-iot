<script setup lang="ts">
  import DeviceInfo from '~/components/DeviceInfo.vue'
  import DashboardForecast from '~/components/DashboardForecast.vue'
  interface AlarmData {
    measurement: string
    flag: number
  }

  definePageMeta({
    layout: 'main'
  })

  const timestamp = ref(0)
  const temp = ref(0)
  const currentMeasurements = ref({})
  const alarmList = ref<any>([])

  const snackbar = ref(false)
  const snackbar_text = ref('')
  const timeout = ref(4000)

  const handleAlarmData = (alarmData: AlarmData) => {
    if (
      !alarmList.value.find((item: any) => {
        return item.alarmKey === alarmData.measurement
      }) &&
      alarmData.flag === 1
    ) {
      alarmList.value.push({
        alarmKey: alarmData.measurement,
        alarmTitle: 'Warning',
        alarmText: `High ${alarmData.measurement}`
      })
    }
    if (
      alarmList.value.find((item: any) => {
        return item.alarmKey === alarmData.measurement
      }) &&
      alarmData.flag === 0
    ) {
      alarmList.value = alarmList.value.filter((item: any) => {
        return item.alarmKey !== alarmData.measurement
      })
    }
  }

  const socket = new WebSocket('ws://localhost:8080')
  socket.onopen = function (event) {
    console.log('Telemetry WebSocket connection opened:', event)
  }

  socket.onmessage = function (event) {
    let websocketData = JSON.parse(event.data)

    if (
      websocketData === 'started' ||
      websocketData === 'stopped' ||
      websocketData === 'interrupted'
    ) {
      console.log(websocketData)
      switch (websocketData) {
        case 'started':
          snackbar_text.value = 'Water pump started!'
          snackbar.value = true
          break
        case 'stopped':
          snackbar_text.value = 'Water pump finished!'
          snackbar.value = true
          break
        case 'interrupted':
          snackbar_text.value = 'Water pump interrupted!'
          snackbar.value = true
          break
      }
    }
    if ('timestamp' in websocketData) {
      timestamp.value = websocketData.timestamp
      temp.value = websocketData.temperature
      currentMeasurements.value = websocketData
    } else {
      handleAlarmData(websocketData)
    }
  }

  socket.onerror = function (error) {
    console.log('Telemetry WebSocket error:', error)
  }

  socket.onclose = function (event) {
    console.log('Telemetry WebSocket connection closed:', event.code)
  }
</script>

<template>
  <div>
    <DeviceInfo :currentMeasurements="currentMeasurements" :timestamp="timestamp" :temp="temp" />
    <DashboardForecast @openDialog="dialog = true" />

    <div class="notificationContainer">
      <v-slide-y-transition group>
        <VAlert
          v-if="alarmList.length !== 0"
          v-for="(alarm, index) in alarmList"
          :key="index"
          border="start"
          prominent
          density="compact"
          type="warning"
          :title="alarm.alarmTitle"
          :text="alarm.alarmText"
          class="mt-10 mr-3"
        ></VAlert>
      </v-slide-y-transition>
    </div>

    <v-snackbar v-model="snackbar" :timeout="timeout">
      <div class="text-h6">
        {{ snackbar_text }}
      </div>

      <template v-slot:actions>
        <v-btn color="blue" variant="text" @click="snackbar = false"> Close </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<style scoped>
  .notificationContainer {
    position: fixed;
    top: 10px;
    right: 10px;
    display: grid;
    grid-gap: 0.5em;
    z-index: 99999;
  }
</style>
