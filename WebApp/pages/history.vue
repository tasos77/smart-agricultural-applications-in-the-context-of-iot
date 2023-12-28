<script setup lang="ts">
  import moment from 'moment'
  import tbApi from '~/api/tbApi'
  import { useTheme } from 'vuetify'
  import index from '~/assets/animations/index'

  definePageMeta({
    layout: 'main'
  })

  const lottie = ref(index['empty_state_dashboards'])
  const theme = useTheme()
  const activeTab = ref(1)
  const loading = ref(false)
  const noWeatherData = ref(false)
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
      offsetY: -10,
      toolbar: {
        show: false
      },
      zoom: { enabled: false },
      animations: { easing: 'easeinout' }
    },
    dataLabels: {
      style: {
        colors: [...listOfColors.value]
      }
    },
    stroke: {
      width: 3,
      curve: 'smooth'
    },
    colors: [...listOfColors.value],
    tooltip: {
      enabled: true,
      theme: theme.current.value.dark ? 'dark' : 'light'
    },

    xaxis: {
      categories: [],
      labels: {
        style: {
          colors: '#FFFFFF'
        }
      }
    },
    yaxis: {
      labels: {
        style: {
          colors: '#FFFFFF'
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
    }
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

  const fillGraphs = async (subtractionStart: number, subtractionEnd: number) => {
    loading.value = true
    noWeatherData.value = false
    const startTs = moment()
      .subtract(subtractionStart * 24, 'minutes')
      .valueOf()
    const endTs = moment()
      .subtract(subtractionEnd * 24, 'minutes')
      .valueOf()

    await tbApi
      .getHistory(startTs, endTs)
      .then((response) => {
        if (Object.keys(response.data.data).length === 0) {
          noWeatherData.value = true
        }
        options.value.xaxis.categories = response.data.data.temperature.map(
          (item) => `${moment(item.ts).format('hh:mm A')}`
        )

        listOfColors.value = createListOfColors(options.value.xaxis.categories, '#FFFFFF')

        measurements.value.temperature.series[0].data = response.data.data.temperature.map(
          (item) => item.value
        )

        measurements.value.humidity.series[0].data = response.data.data.humidity.map(
          (item) => item.value
        )
        measurements.value.soilMoisture.series[0].data = response.data.data.soilMoisture.map(
          (item) => item.value
        )

        measurements.value.rain.series[0].data = response.data.data.rain.map((item) => item.value)
        measurements.value.uv.series[0].data = response.data.data.uv.map((item) => item.value)
      })
      .catch((e) => {
        console.log(e)
      })
    loading.value = false
  }

  onMounted(async () => {
    fillGraphs(1, 0)
  })
</script>

<template>
  <div>
    <VTabs v-model="activeTab" grow :mandatory="true" show-arrows color="primary">
      <VTab
        :value="tabs.length - index"
        v-for="(tab, index) in tabs"
        :key="index"
        @click="fillGraphs(tabs.length - index, tabs.length - index - 1)"
        >{{ tab }}
      </VTab>
    </VTabs>

    <v-row class="pa-4" v-if="!loading && !noWeatherData">
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
    <div v-if="noWeatherData">
      <client-only>
        <Vue3Lottie :animation-data="lottie" height="200px" width="200px" />
      </client-only>
      <div class="text-h6 d-flex justify-center">No weather data!</div>
    </div>
  </div>
</template>

<style scoped></style>
