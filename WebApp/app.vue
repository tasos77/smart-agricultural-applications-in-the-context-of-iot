<template>
  <VContainer fluid>
    <VRow justify="center" align="center">
      <VCol md="6">
        <v-card title="Card title" subtitle="Subtitle" variant="elevated">
          <VCardText>{{ template }}</VCardText>
          <v-card-actions>
            <v-btn>Click me</v-btn>
          </v-card-actions>
        </v-card>
      </VCol>
    </VRow>
  </VContainer>
</template>

<script setup lang="ts">
import { ref } from "vue";
const template = ref(
  "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Harum minus, corrupti possimus sapiente quaerat optio earum enim exercitationem nulla, reprehenderit dolorem explicabo in autem aliquam! Ipsum debitis eos voluptates sapiente."
);
</script>
