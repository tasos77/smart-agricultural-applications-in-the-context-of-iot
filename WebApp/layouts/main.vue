<template>
  <VApp>
    <!----------- Drawer ----------->
    <v-navigation-drawer
      class="rounded-none"
      :permanent="!display.smAndDown ? true : false"
      color="color_surface_mixed_300"
      v-model="drawer"
      :border="false"
      floating
    >
      <!-- Drawer List -->
      <VList color="transparent">
        <VListItem
          prepend-icon="mdi-view-dashboard"
          title="Dashboard"
          @click="navigateTo('/dashboard')"
        ></VListItem>
        <VListItem
          prepend-icon="mdi-chart-line"
          title="History"
          @click="navigateTo('/history')"
        ></VListItem>
        <VListItem
          prepend-icon="mdi-account"
          title="Profile"
          @click="navigateTo('/profile')"
        ></VListItem>
      </VList>

      <!-- Logout Button -->
      <template v-slot:append>
        <div class="pa-2">
          <v-btn block color="color_surface_mixed_400"> Logout </v-btn>
        </div>
      </template>
    </v-navigation-drawer>

    <!----------- App Bar ----------->
    <v-app-bar color="color_surface_mixed_400" prominent>
      <!-- Open Drawer Button -->
      <template v-slot:prepend>
        <VAppBarNavIcon
          v-if="display.smAndDown"
          variant="text"
          @click.stop="drawer = !drawer"
        ></VAppBarNavIcon>
      </template>
      <!-- Drawer Title -->
      <VAppBarTitle>{{ routeName }}</VAppBarTitle>
    </v-app-bar>
    <VMain>
      <slot />
    </VMain>
  </VApp>
</template>

<script setup lang="ts">
  import { useDisplay } from 'vuetify'
  import { computed } from 'vue'
  const display = ref(useDisplay())
  const route = useRoute()
  const routeName = computed(() => {
    return route.name.charAt(0).toUpperCase() + route.name.slice(1)
  })

  const drawer = ref(display.value.smAndDown ? false : true)
</script>

<style>
  .v-main {
    background-color: #191e26 !important;
  }
</style>
