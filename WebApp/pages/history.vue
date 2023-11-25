<script setup lang="ts">
  import moment from 'moment'
  import tbApi from '~/api/tbApi'
  import { useTheme } from 'vuetify'

  definePageMeta({
    layout: 'main'
  })

  const theme = useTheme()
  const activeTab = ref(1)
  const loading = ref(false)
  const tabs = ref([
    moment().subtract(5, 'days').format('MMM DD'),
    moment().subtract(4, 'days').format('MMM DD'),
    moment().subtract(3, 'days').format('MMM DD'),
    moment().subtract(2, 'days').format('MMM DD'),
    'Yesterday',
    'Today'
  ])
  const listOfColors = ref([])
  const createListOfColors = (list: any, color: string) => {
    return list.map(() => {
      return color
    })
  }

  const options = ref({
    chart: {
      offsetY: -10
    },
    xaxis: {
      categories: [],
      labels: {
        style: {
          colors: listOfColors.value
        }
      }
    },
    yaxis: {
      labels: {
        style: {
          colors: listOfColors.value
        }
      }
    },
    grid: {
      show: true,
      xaxis: {
        lines: {
          show: true
        }
      },
      yaxis: {
        lines: {
          show: true
        }
      },
      strokeDashArray: 2
    },
    tooltip: { theme: true }
  })

  const measurements = ref({
    temperature: {
      series: [
        {
          name: 'Temperature',
          data: []
        }
      ]
    },
    humidity: {
      series: [
        {
          name: 'Humidity',
          data: []
        }
      ]
    },
    soilMoisture: {
      series: [
        {
          name: 'Soil Moisture',
          data: []
        }
      ]
    },
    rain: {
      series: [
        {
          name: 'Rain',
          data: []
        }
      ]
    },
    uv: {
      series: [
        {
          name: 'UV',
          data: []
        }
      ]
    }
  })

  onMounted(async () => {
    loading.value = true
    await tbApi
      .getTelemetryRange(moment().subtract(1, 'hour').valueOf(), moment().valueOf())
      .then((response) => {
        options.value.xaxis.categories = response.data.data.temperature
          .slice(0, 20)
          .map((item) => `${moment(item.ts).format('hh:mm A')}`)

        listOfColors.value = createListOfColors(options.value.xaxis.categories, '#FFFFFF')

        measurements.value.temperature.series[0].data = response.data.data.temperature
          .slice(0, 20)
          .map((item) => item.value)

        measurements.value.humidity.series[0].data = response.data.data.humidity
          .slice(0, 20)
          .map((item) => item.value)
        measurements.value.soilMoisture.series[0].data = response.data.data.soilMoisture
          .slice(0, 20)
          .map((item) => item.value)

        measurements.value.rain.series[0].data = response.data.data.rain
          .slice(0, 20)
          .map((item) => item.value)
        measurements.value.uv.series[0].data = response.data.data.uv
          .slice(0, 20)
          .map((item) => item.value)
      })
      .catch((e) => {
        console.log(e)
      })
    loading.value = false
  })
</script>

<template>
  <div>
    <v-progress-linear color="primary" indeterminate v-if="loading"></v-progress-linear>
    <VTabs v-model="activeTab" grow :mandatory="true" show-arrows color="primary">
      <VTab :value="tabs.length - index" v-for="(tab, index) in tabs" :key="index">{{ tab }}</VTab>
    </VTabs>

    <v-row class="pa-4" v-if="!loading">
      <v-col v-for="(measurement, index) in measurements" :key="index" cols="12" md="6" sm="12">
        <v-card rounded="xl" color="color_surface_mixed_200" class="pa-4">
          <v-card-title>{{ measurement.series[0].name }}</v-card-title>
          <v-card-text class="pa-0">
            <div>
              <apexchart
                width="100%"
                height="300"
                type="line"
                :options="options"
                :series="measurement.series"
              ></apexchart>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<style scoped></style>
