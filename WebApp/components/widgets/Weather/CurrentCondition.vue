<template>
  <VCard rounded="xl" class="h-100 w-100" color="color_surface_mixed_200">
    <VRow justify="start" align="center" class="pa-0 ma-0 h-100">
      <VCol>
        <div class="w-50 h-50">
          <client-only>
            <Vue3Lottie :animation-data="lottie" height="auto" width="auto" />
          </client-only>
        </div>

        <div>
          <div class="text-h1">{{ props.temp }}°C</div>
        </div>
        <VDivider />
        <div>
          <div class="text-h6">{{ cacledTimestamp }}</div>
        </div>
      </VCol>
    </VRow>
  </VCard>
</template>

<script setup lang="ts">
  import moment from 'moment'
  import index from '../../../assets/animations/index'
  import { useDisplay } from 'vuetify'
  const lottie = ref(index['clear_day'])

  const display = useDisplay()

  const props = withDefaults(
    defineProps<{
      timestamp?: number
      temp?: number
    }>(),
    {
      timestamp: 0,
      temp: 0
    }
  )

  const cacledTimestamp = computed(() => {
    return moment(props.timestamp).format('DD MMM, YYYY hh:mm A')
  })
</script>

<style scoped></style>
