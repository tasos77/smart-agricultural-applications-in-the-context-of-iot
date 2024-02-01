<script setup lang="ts">
  import index from '~/assets/animations/index'
  import tbApi from '~/api/tbApi'
  import moment from 'moment'

  const model = ref(null)

  const temperatureValues = ref([])
  const icons = ref([])

  const fillGraphs = async (subtractionStart: number, subtractionEnd: number) => {
    const startTs = moment()
      .subtract(subtractionStart * 24, 'minutes')
      .valueOf()
    const endTs = moment()
      .subtract(subtractionEnd * 24, 'minutes')
      .valueOf()

    await tbApi
      .getForecast(startTs, endTs)
      .then((response) => {
        console.log(response)
        icons.value = response.data.data.icons
        temperatureValues.value = response.data.data.temperature
      })
      .catch((e) => {
        console.log(e)
      })
  }
  onMounted(async () => {
    fillGraphs(1, 0)
  })
</script>

<template>
  <VCard class="ma-4" color="color_surface_mixed_200">
    <VCardTitle>Forecast (24h)</VCardTitle>
    <v-sheet class="mx-auto" elevation="8" color="color_surface_mixed_300">
      <v-slide-group v-model="model" class="pa-0">
        <v-slide-group-item
          v-for="(tempItem, i) in temperatureValues"
          :key="i"
          v-slot="{ isSelected, toggle, selectedClass }"
        >
          <v-card
            rounded="lg"
            elevation="3"
            color="color_surface_mixed_400"
            :class="['ma-4', selectedClass]"
            height="200"
            width="100"
            @click="toggle"
          >
            <div class="d-flex justify-center align-center">
              <div>
                <client-only>
                  <Vue3Lottie :animation-data="index[`${icons[i]}`]" height="50px" width="50px" />
                </client-only>
                <div class="d-flex align-baseline justify-center">
                  <span class="text-body-1">{{ tempItem.range.max }}/</span>
                  <span class="text-body-2">{{ tempItem.range.min }}</span>
                </div>
                <div class="d-flex justify-center align-center">
                  {{ moment(tempItem.ts).format('h A') }}
                </div>
                <!-- <div class="d-flex justify-center align-center">
                  {{ moment(tempItem.ts).format('dddd') }}
                </div> -->
              </div>
            </div>
          </v-card>
        </v-slide-group-item>
      </v-slide-group>
    </v-sheet>
  </VCard>
</template>
