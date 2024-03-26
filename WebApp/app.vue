<script lang="ts" setup>
  import wxmApi from '~/api/tbApi'

  const config = useRuntimeConfig().public

  console.log(config.middlewareServerUrl)

  onBeforeMount(() => {
    // wxmApi.setupAxios(config.middlewareServerUrl)
  })
</script>

<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<style>
  html {
    overflow: hidden !important;
    scrollbar-width: none;
    -ms-overflow-style: none;
  }

  html::-webkit-scrollbar {
    width: 0;
    height: 0;
  }
</style>
