<template>
  <VSnackbar v-model="props.snackbar" :timeout="-1" color="color_surface_mixed_200">
    {{ props.snackbarText }}
    <template #actions>
      <VBtn class="text-none" color="color_primary_600" @click="closeSnackbar"> Dismiss </VBtn>
    </template>
  </VSnackbar>
</template>

<script setup lang="ts">
  import { defineEmits } from 'vue'
  const emit = defineEmits(['close'])

  const props = defineProps<{
    snackbar: boolean
    snackbarText: string
  }>()

  const closeSnackbar = () => {
    emit('close')
  }
</script>

<style scoped></style>
