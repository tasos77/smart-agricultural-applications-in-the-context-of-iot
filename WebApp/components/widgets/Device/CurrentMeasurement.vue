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

  const series = ref([50])
  const chartOptions = reactive({
    chart: {
      height: 350,
      type: 'radialBar',
      offsetY: -10
    },
    plotOptions: {
      radialBar: {
        startAngle: -135,
        endAngle: 135,
        dataLabels: {
          show: false
        }
      }
    },

    stroke: {
      dashArray: 4
    }
  })

  onUpdated(() => {
    series.value = [props.measurement]
  })
</script>

<template>
  <VCard elevation="0" rounded="xl" color="color_surface_mixed_300">
    <VCardTitle>{{ props.measurementName }}</VCardTitle>
    <VCardText class="w-auto pa-0">
      <VRow class="pa-0 ma-0">
        <VCol>
          <apexchart
            type="radialBar"
            height="auto"
            :options="chartOptions"
            :series="series"
          ></apexchart>
        </VCol>
        <VCol class="d-flex justify-center align-center">
          <div class="text-h3">
            {{ props.measurement }}
          </div>
        </VCol>
      </VRow>
    </VCardText>
  </VCard>
</template>
