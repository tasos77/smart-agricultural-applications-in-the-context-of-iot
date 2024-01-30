<script setup lang="ts">
  import moment from 'moment'
  import index from '../../../assets/animations/index'

  const props = withDefaults(
    defineProps<{
      timestamp?: number
      temp?: number
      icon?: string
    }>(),
    {
      timestamp: 0,
      temp: 0,
      icon: 'not_available'
    }
  )

  const cacledTimestamp = computed(() => {
    return moment(props.timestamp).format('DD MMM, YYYY hh:mm A')
  })
</script>

<style scoped></style>

<template>
  <VCard rounded="xl" class="h-100 w-100" color="color_surface_mixed_300">
    <VRow justify="start" align="center" class="pa-0 ma-0 h-100">
      <VCol>
        <div>
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
      </VCol>
    </VRow>
  </VCard>
</template>
