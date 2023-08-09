<template>
  <VTabs v-model="activeTab" grow :mandatory="true" show-arrows>
    <VTab :value="tabs.length - index" v-for="(tab, index) in tabs" :key="index">{{ tab }}</VTab>
  </VTabs>
</template>

<script setup lang="ts">
  import moment from 'moment'
  definePageMeta({
    layout: 'main'
  })

  const activeTab = ref(1)
  const tabs = [
    moment().subtract(5, 'days').format('MMM DD'),
    moment().subtract(4, 'days').format('MMM DD'),
    moment().subtract(3, 'days').format('MMM DD'),
    moment().subtract(2, 'days').format('MMM DD'),
    'Yesterday',
    'Today'
  ]
</script>

<style scoped></style>
