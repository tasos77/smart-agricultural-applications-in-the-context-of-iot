<template>
  <div>
    <h4>
      Don't have an account?
      <span style="cursor: pointer" @click="goToRegistration" class="text-color_primary_600">
        SIGN UP
      </span>
    </h4>
  </div>
</template>

<script setup lang="ts">
  const goToRegistration = () => {
    navigateTo('/registration')
  }
</script>
