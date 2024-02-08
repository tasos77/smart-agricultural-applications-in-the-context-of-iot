<script setup lang="ts">
  import moment from 'moment'
  import index from '../../../assets/animations/index'
  import tbApi from '~/api/tbApi'
  const props = withDefaults(
    defineProps<{
      timestamp?: number
      temp?: number
      icon?: string
      showWaterAlert?: boolean
    }>(),
    {
      timestamp: 0,
      temp: 0,
      icon: 'not_available',
      showWaterAlert: false
    }
  )

  const cacledTimestamp = computed(() => {
    return moment(props.timestamp).format('DD MMM, YYYY hh:mm A')
  })

  const startWatering = () => {
    tbApi
      .updateTBWateringAttr()
      .then((response) => {
        console.log(response.data)
      })
      .catch((e) => {
        console.log(e)
      })
  }
</script>

<template>
  <VCard rounded="xl" class="h-100 w-100" color="color_surface_mixed_300">
    <VRow justify="start" align="start" class="pa-0 ma-0 h-100">
      <VCol class="h-100 d-flex flex-column justify-space-between">
        <div>
          <div class="pa-6">
            <client-only>
              <Vue3Lottie :animation-data="index[`${props.icon}`]" height="auto" width="auto" />
            </client-only>
          </div>

          <div>
            <div class="text-h2">{{ props.temp }}°C</div>
          </div>
          <VDivider />
          <div>
            <div class="text-h6">{{ cacledTimestamp }}</div>
          </div>
        </div>
        <div>
          <div class="pa-4" v-if="showWaterAlert">
            <v-alert
              rounded="lg"
              type="info"
              title="Caution!"
              text="Low humidity, soil moisture and rain levels"
              variant="tonal"
              prominent
            ></v-alert>
          </div>

          <div class="align-end pa-4">
            <VBtn
              block
              class="text-none"
              color="primary"
              rounded="lg"
              elevation="0"
              @click="startWatering"
              >Water Now</VBtn
            >
          </div>
        </div>
      </VCol>
    </VRow>
  </VCard>
</template>
