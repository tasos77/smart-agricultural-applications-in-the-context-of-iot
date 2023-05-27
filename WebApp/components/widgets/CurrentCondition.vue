<template>
  <VCard rounded="xl" class="h-100 w-100" color="color_surface_mixed_200">
    <VRow justify="start" align="center" class="pa-0 ma-0 h-100">
      <VCol>
        <div class="h-25 w-25">
          <client-only>
            <Vue3Lottie :animationLink="rain" :height="100" :width="100" />
          </client-only>
        </div>
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
  import 'vue3-lottie/dist/style.css'

  import rain from '../../assets/animations/rain.json'
</script>

<style scoped></style>
