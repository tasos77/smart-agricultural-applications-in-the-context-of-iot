<template>
  <VContainer fluid>
    <VRow class="ma-0 pa-0" justify="center">
      <VCol class="ma-0 pa-0" sm="12" md="8">
        <VCard color="color_surface_mixed_200" rounded="lg">
          <VCardTitle> Personal Info </VCardTitle>
          <VCardText>
            <VRow class="ma-0 pa-0">
              <VCol cols="12">
                <v-text-field
                  :model-value="email"
                  label="Email"
                  variant="underlined"
                  disabled
                ></v-text-field>
              </VCol>
            </VRow>
            <VRow class="pa-0 ma-0">
              <VCol md="6" sm="12" xs="12">
                <v-text-field
                  :model-value="firstName"
                  label="First Name"
                  variant="underlined"
                  disabled
                ></v-text-field>
              </VCol>
              <VCol md="6" sm="12" xs="12">
                <v-text-field
                  :model-value="lastName"
                  label="Last Name"
                  variant="underlined"
                  disabled
                ></v-text-field>
              </VCol>
            </VRow>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>
  </VContainer>
</template>

<script setup lang="ts">
  import tbApi from '~/api/tbApi.js'
  import { useTokensAuthStore } from '~/stores/auth'
  definePageMeta({
    layout: 'main'
  })

  const email = ref('')
  const firstName = ref('')
  const lastName = ref('')
  // init store instance
  const authStore = useTokensAuthStore()
  onMounted(() => {
    tbApi
      .getUser(authStore.getLocalToken())
      .then((response) => {
        email.value = response.data.data.email
        firstName.value = response.data.data.firstName
        lastName.value = response.data.data.lastName
      })
      .catch((e) => console.log(e))
  })
</script>

<style scoped></style>
