<template>
  <div>
    <h4>
      Already a user?
      <span style="cursor: pointer" @click="goToLogin"> SIGN IN </span>
    </h4>
  </div>
</template>

<script setup lang="ts">
const goToLogin = () => {
  navigateTo("/");
};
</script>
