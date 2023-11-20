<script setup lang="ts">
  import moment from 'moment'
  import tbApi from '~/api/tbApi'
  definePageMeta({
    layout: 'main'
  })

  const activeTab = ref(1)

  const tabs = ref([
    moment().subtract(5, 'days').format('MMM DD'),
    moment().subtract(4, 'days').format('MMM DD'),
    moment().subtract(3, 'days').format('MMM DD'),
    moment().subtract(2, 'days').format('MMM DD'),
    'Yesterday',
    'Today'
  ])

  onMounted(() => {
    tbApi
      .getTelemetryRange(moment().subtract(1, 'hour').valueOf(), moment().valueOf())
      .then((response) => {
        console.log(response.data)
      })
      .catch((e) => {
        console.log(e)
      })

    // console.log(moment().startOf('hour'))
    // console.log(moment())
    // console.log(moment().subtract(1, 'hours'))
    // console.log(moment().valueOf())
    // console.log(moment().subtract(1, 'hour').valueOf())
  })
</script>

<template>
  <VTabs v-model="activeTab" grow :mandatory="true" show-arrows>
    <VTab :value="tabs.length - index" v-for="(tab, index) in tabs" :key="index">{{ tab }}</VTab>
  </VTabs>
</template>

<style scoped></style>
