<template>
  <div>
    <h4>
      Already a user?
      <span style="cursor: pointer" @click="goToLogin" class="text-color_primary_600">
        SIGN IN
      </span>
    </h4>
  </div>
</template>

<script setup lang="ts">
  const goToLogin = () => {
    navigateTo('/')
  }
</script>
