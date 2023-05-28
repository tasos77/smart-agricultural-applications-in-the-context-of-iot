<template>
  <VCard rounded="xl" class="h-100 w-100" color="color_surface_mixed_200">
    <VRow justify="start" align="center" class="pa-0 ma-0 h-100">
      <VCol>
        <ClientOnly>
          <div style="height: 100px; width: 100px">
            <lottie-animation :animation-data="lottie" :autoplay="true" :loop="true" />
          </div>
        </ClientOnly>
        <div>
          <div class="text-h1">28°C</div>
        </div>
        <VDivider />
        <div>
          <div class="text-h6">24, July 2022 5:01 AM</div>
        </div>
      </VCol>
    </VRow>
  </VCard>
</template>

<script setup lang="ts">
  import index from '../../assets/animations/index'
  const lottie = ref(index['clear_day'])
</script>

<style scoped></style>
