<template>
  <div>
    <h4>
      Don't have an account?
      <span style="cursor: pointer" @click="goToRegistration"> SIGN UP </span>
    </h4>
  </div>
</template>

<script setup lang="ts">
const goToRegistration = () => {
  navigateTo("/registration");
};
</script>
