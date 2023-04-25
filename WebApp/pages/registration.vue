<template>
  <VApp>
    <DismissableSnackbar
      :snackbar="snackbar"
      :snackbar-text="snackbarText"
      @close="closeSnack"
    />
    <LoadingBar v-show="loading" />
    <VContainer fluid class="fill-height">
      <VRow align="center" justify="center">
        <VCol cols="12" md="5" sm="8">
          <VRow class="d-flex">
            <VCard elevation="2" class="rounded-xl w-100">
              <VCardTitle class="pa-4 pb-0">
                <VIcon size="small" class="pb-3" @click="goToLogin"
                  >mdi-arrow-left</VIcon
                ><span class="text-h4">Create Account</span></VCardTitle
              >
              <div class="px-4 text-body-2">
                Sign up with your email and your account will be created
                shortly.
              </div>
              <VCardText>
                <VForm
                  ref="form"
                  v-model="valid"
                  @submit.prevent="registrateUser(registrationInfo)"
                >
                  <!------------------------ Email text field ----------------------->
                  <VTextField
                    v-model="registrationInfo.email"
                    variant="outlined"
                    label="Email"
                    :rules="emailRules"
                    prepend-inner-icon="mdi-email"
                    validate-on="blur"
                    type="email"
                    :disabled="loading"
                    :autofocus="true"
                    :error="inputErrorState"
                    :messages="inputErrorMessage"
                    @keydown.space.prevent
                    @focus="clearValidation"
                    color="primary"
                  />
                  <!------------------------ First name text field ----------------------->
                  <VTextField
                    v-model="registrationInfo.firstName"
                    class="pt-3"
                    variant="outlined"
                    label="First Name"
                    prepend-inner-icon="mdi-account"
                    type="text"
                    :rules="nameRules"
                    :disabled="loading"
                    @keydown.space.prevent
                    color="primary"
                  />
                  <!------------------------ Last name text field ----------------------->
                  <VTextField
                    v-model="registrationInfo.lastName"
                    class="pt-3"
                    variant="outlined"
                    label="Last Name"
                    prepend-inner-icon="mdi-account"
                    type="text"
                    :rules="lastNameRules"
                    :disabled="loading"
                    @keydown.space.prevent
                    color="primary"
                  />
                  <!------------------------ Last name text field ----------------------->
                  <VBtn
                    :block="true"
                    class="mt-3 mb-2"
                    :disabled="!valid"
                    type="submit"
                    elevation="0"
                    color="primary"
                  >
                    SIGN UP
                  </VBtn>
                </VForm>
              </VCardText>
            </VCard>
          </VRow>
          <VRow justify="center" align="center" class="mt-10">
            <LoginLink />
          </VRow>
        </VCol>
      </VRow>
    </VContainer>
  </VApp>
</template>

<script setup lang="ts">
import { ref } from "vue";
import LoadingBar from "../components/LoadingBar.vue";
import DismissableSnackbar from "../components/DismissableSnackbar.vue";
import LoginLink from "../components/LoginLink.vue";
import { RegistrationFormData } from "../types/tbApiTypes";
import tbApi from "../api/tbApi";
definePageMeta({
  middleware: "redirect",
});
// snackbar starting state
const snackbar = ref(false);
const snackbarText = ref(``);
// starting values and text field rules
const loading = ref(false);
const valid = ref(false);
const registrationInfo = ref({
  email: "",
  firstName: "",
  lastName: "",
});
const nameRules = ref([(v) => !!v || "Name is required"]);
const lastNameRules = ref([(v) => !!v || "Last name is required"]);
const emailRules = ref([
  (v) => !!v || "E-mail is required",
  (v) =>
    /^(([^<>()[\]\\.,;:\s@']+(\.[^<>()\\[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
      v
    ) || "Invalid email address",
]);
const inputErrorState = ref(false);
const inputErrorMessage = ref("");

// <------------------------------------ Methods ----------------------------------->
const closeSnack = () => {
  snackbar.value = false;
};
const goToLogin = () => {
  navigateTo("/");
};
const clearValidation = () => {
  inputErrorMessage.value = "";
  inputErrorState.value = false;
};

const registrateUser = (registrationInfo: RegistrationFormData) => {
  console.log(registrationInfo);
  tbApi
    .registration(registrationInfo)
    .then((response) => {
      console.log(response);
    })
    .catch((e) => {
      console.log(e);
    });
};
</script>

<style scoped></style>
