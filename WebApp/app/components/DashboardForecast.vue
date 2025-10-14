<script setup lang="ts">
  import index from '~/assets/animations/index'
  import tbApi from '~/api/tbApi'
  import moment from 'moment'
  import { useDisplay } from 'vuetify'

  const emit = defineEmits(['openDialog'])
  const display = useDisplay()
  const dialog = ref(false)
  const model = ref(null)
  const mesIndex = ref(0)
  const icons = ref([])
  const temperature = ref([])
  const humidity = ref([])
  const rain = ref([])
  const soilMoisture = ref([])
  const uv = ref([])

  const smBreakpoint = computed(() => {
    return display.smAndDown
  })

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
        temperature.value = response.data.data.temperature
        humidity.value = response.data.data.humidity
        rain.value = response.data.data.rain
        soilMoisture.value = response.data.data.soilMoisture
        uv.value = response.data.data.uv
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
  <div>
    <VCard class="ma-4" color="color_surface_mixed_200">
      <VCardTitle>Forecast (24h)</VCardTitle>
      <v-sheet class="mx-auto" elevation="8" color="color_surface_mixed_300">
        <v-slide-group v-model="model" class="pa-0" mobile-breakpoint="sm" :show-arrows="false">
          <v-slide-group-item v-for="(tempItem, i) in temperature" :key="i">
            <v-card
              rounded="lg"
              elevation="3"
              color="color_surface_mixed_400"
              :class="['ma-4']"
              height="200"
              width="100"
              @click=";[(dialog = true), (mesIndex = i)]"
            >
              <div>
                <div>
                  <client-only>
                    <Vue3Lottie :animation-data="index[`${icons[i]}`]" height="auto" width="auto" />
                  </client-only>
                </div>

                <div class="d-flex flex-column justify-center align-center">
                  <div>Max / Min</div>
                  <div class="d-flex align-baseline justify-center">
                    <span class="text-body-1"
                      ><b>{{ tempItem.range.max + '/' }}</b></span
                    >
                    <span class="text-body-2"
                      ><b>{{ tempItem.range.min }}</b></span
                    >
                  </div>
                  <div class="d-flex justify-center align-center">
                    {{ moment(tempItem.ts).format('dd h A') }}
                  </div>
                </div>
              </div>
            </v-card>
          </v-slide-group-item>
        </v-slide-group>
      </v-sheet>
    </VCard>
    <v-dialog v-model="dialog" width="600">
      <v-card color="color_surface_mixed_300" rounded="lg">
        <v-card-text>
          <div>
            <VRow>
              <VCol cols="12" sm="12" md="6" class="d-flex flex-column justify-center align-center">
                <client-only>
                  <Vue3Lottie
                    :animation-data="index[`${icons[mesIndex]}`]"
                    :height="smBreakpoint ? '150px' : 'auto'"
                    :width="smBreakpoint ? '150px' : 'auto'"
                  />
                </client-only>
                <div class="text-h3">{{ temperature[mesIndex].value }}°C</div>
              </VCol>
              <VCol
                cols="12"
                sm="12"
                md="6"
                class="d-flex flex-column justify-space-evenly align-start"
              >
                <div class="d-flex pa-2">
                  <div class="d-flex justify-center align-center pa-0">
                    <VIcon size="x-large">mdi-water-percent</VIcon>
                  </div>
                  <VCol class="pa-0 ps-2">
                    <div class="text-body-2">Humidity</div>
                    <div class="text-h6">{{ humidity[mesIndex].value }}%</div>
                  </VCol>
                </div>

                <div class="d-flex pa-2">
                  <div class="d-flex justify-center align-center pa-0">
                    <VIcon size="x-large">mdi-weather-pouring</VIcon>
                  </div>
                  <div class="pa-0 ps-2">
                    <div class="text-body-2">Rain</div>
                    <div class="text-h6">{{ rain[mesIndex].value }}%</div>
                  </div>
                </div>

                <div class="d-flex pa-2">
                  <div class="d-flex justify-center align-center pa-0">
                    <VIcon size="x-large">mdi-sprout</VIcon>
                  </div>
                  <VCol class="pa-0 ps-2">
                    <div class="text-caption">Soil Moisture</div>
                    <div class="text-h6">{{ soilMoisture[mesIndex].value }}%</div>
                  </VCol>
                </div>

                <div class="d-flex pa-2">
                  <div class="d-flex justify-center align-center pa-0">
                    <VIcon size="x-large">mdi-sun-wireless</VIcon>
                  </div>
                  <VCol class="pa-0 ps-2" cols="9">
                    <div class="text-body-2">UV</div>
                    <div class="text-h6">{{ uv[mesIndex].value }}%</div>
                  </VCol>
                </div>
              </VCol>
            </VRow>
          </div>
          <div class="d-flex justify-center pt-4">
            {{ moment(temperature[mesIndex].ts).format('dddd hh:mm A') }}
          </div>
        </v-card-text>
        <v-card-actions class="pa-4 pt-0 d-flex justify-end">
          <v-btn color="primary" @click="dialog = false" variant="elevated">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
