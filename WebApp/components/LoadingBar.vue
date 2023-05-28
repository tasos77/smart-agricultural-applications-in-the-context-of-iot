<template>
  <v-progress-linear v-if="loading" color="color_primary_600" indeterminate></v-progress-linear>
</template>

<script setup lang="ts">
  defineProps({
    loading: {
      type: Boolean,
      default: false
    }
  })
</script>
