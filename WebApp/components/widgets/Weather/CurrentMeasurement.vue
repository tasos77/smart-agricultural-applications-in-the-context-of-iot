<script setup lang="ts">
  let props = withDefaults(
    defineProps<{
      measurementName?: string
      measurement?: number
    }>(),
    {
      measurementName: '',
      measurement: 0
    }
  )
  const calcHumidityLineColor = (measurement: string, value: number) => {
    switch (measurement === 'Humidity') {
      case value >= 0 && value <= 40:
        return '#61DBC3'
      case value > 40 && value <= 60:
        return '#95DA74'
      case value > 60 && value <= 100:
        return '#EB656F'
    }
    switch (measurement === 'Soil Moisture') {
      case value >= 0 && value <= 50:
        return '#61DBC3'
      case value > 50 && value <= 75:
        return '#95DA74'
      case value > 75 && value <= 100:
        return '#EB656F'
    }

    switch (measurement === 'Rain') {
      case value >= 0 && value <= 30:
        return '#61DBC3'
      case value > 30 && value <= 60:
        return '#95DA74'
      case value > 60 && value <= 100:
        return '#EB656F'
    }
    switch (measurement === 'UV') {
      case value >= 0 && value <= 3:
        return '#61DBC3'
      case value > 3 && value <= 7:
        return '#95DA74'
      case value > 7 && value <= 10:
        return '#EB656F'
    }
  }
  const series = ref([0])
  const chartOptions2 = computed(() => {
    return {
      plotOptions: {
        radialBar: {
          hollow: {
            margin: 0,
            size: '70%',
            background: '#fff',
            image: undefined,
            imageOffsetX: 0,
            imageOffsetY: 0,
            position: 'front',
            dropShadow: {
              enabled: true,
              top: 3,
              left: 0,
              blur: 4,
              opacity: 0.24
            }
          },
          track: {
            background: '#fff',
            strokeWidth: '67%',
            margin: 0, // margin is in pixels
            dropShadow: {
              enabled: true,
              top: -3,
              left: 0,
              blur: 4,
              opacity: 0.35
            }
          },

          dataLabels: {
            show: true,
            name: {
              offsetY: -10,
              show: true,
              color: '#888',
              fontSize: '15px'
            },
            value: {
              color: '#111',
              fontSize: '30px',
              show: true
            }
          }
        }
      },
      colors: [calcHumidityLineColor(props.measurementName, props.measurement)],
      fill: {
        type: 'solid'
      },
      stroke: {
        lineCap: 'round'
      },
      labels: [props.measurementName]
    }
  })

  onUpdated(() => {
    series.value = [props.measurement]
  })
</script>

<template>
  <VCard elevation="0" rounded="xl" color="color_surface_mixed_400">
    <VCardText class="w-auto pa-0">
      <VRow class="pa-0 ma-0">
        <VCol class="pa-0">
          <apexchart
            type="radialBar"
            height="400"
            :options="chartOptions2"
            :series="series"
          ></apexchart>
        </VCol>
      </VRow>
    </VCardText>
  </VCard>
</template>
