<template>
  <DismissableSnackbar
    :snackbar="snackbar"
    :snackbar-text="snackbarText"
    @close="closeSnack"
  />
  <LoadingBar v-show="loading" />
  <VContainer fluid class="fill-height">
    <VRow align="center" justify="center">
      <VCol cols="12" sm="8" md="5">
        <VRow>
          <!------------------------------ Login form ------------------------------->
          <VCard class="rounded-xl w-100" elevation="3">
            <VCardTitle class="text-h4 pa-4">Login</VCardTitle>
            <VCardText>
              <VForm ref="form" v-model="valid" @submit.prevent="userLogin">
                <!---------------- Username text field ----------------->
                <VTextField
                  v-model="userInfo.username"
                  variant="outlined"
                  label="Email"
                  :rules="usernameRules"
                  prepend-inner-icon="mdi-email"
                  type="email"
                  :disabled="loading"
                  :autofocus="true"
                  validate-on="blur"
                  @keydown.space.prevent
                  color="primary"
                />
                <!----------------------- Password text field ---------------------->
                <VTextField
                  v-model="userInfo.password"
                  class="pt-3"
                  label="Password"
                  :rules="passwordRules"
                  prepend-inner-icon="mdi-lock"
                  variant="outlined"
                  :type="show ? 'text' : 'password'"
                  :append-inner-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                  :disabled="loading"
                  @keydown.space.prevent
                  @click:append-inner="showPass"
                  color="primary"
                />
                <!----------------------- Submit Button ---------------------->
                <VBtn
                  :block="true"
                  class="mt-3 mb-2"
                  :disabled="!valid"
                  type="submit"
                  elevation="0"
                  color="primary"
                  >SIGN IN</VBtn
                >
              </VForm>
            </VCardText>
          </VCard>
          <VRow justify="center" align="center" class="mt-10">
            <SignUpLink />
          </VRow>
        </VRow>
      </VCol>
    </VRow>
  </VContainer>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { login } from "../api/tbApi";
import { tokensAuthStore } from "../stores/auth";
import DismissableSnackbar from "../components/DismissableSnackbar.vue";
import SignUpLink from "../components/SignUpLink.vue";

import LoadingBar from "../components/LoadingBar.vue";

definePageMeta({
  middleware: "redirect",
});
// init store
const auth = tokensAuthStore();
// snackbar starting state
const snackbar = ref(false);
const snackbarText = ref(``);
// form starting state
const loading = ref(false);
const show = ref(false);
const valid = ref(false);
const userInfo = reactive({
  username: "",
  password: "",
});
const passwordRules = ref([(v) => !!v || "Password is required"]);
const usernameRules = ref([
  (v) => !!v || "E-mail is required",
  (v) =>
    /^(([^<>()[\]\\.,;:\s@']+(\.[^<>()\\[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
      v
    ) || "Invalid email address",
]);

// <------------------------------------ Methods ----------------------------------->
const closeSnack = () => {
  snackbar.value = false;
};
const showPass = () => {
  show.value = !show.value;
};
const userLogin = () => {
  loading.value = true;
  valid.value = !valid.value;

  login(userInfo.username, userInfo.password)
    .then((response) => {
      loading.value = false;
      auth.setLocalTokens(response);
    })
    .then(() => {
      userInfo.username = "";
      userInfo.password = "";
      navigateTo("/devices");
    })
    .catch((e) => {
      loading.value = false;
      userInfo.password = "";
      console.log(e);
      snackbarText.value = e?.response?.data?.message || `Error!`;
      snackbar.value = true;
    });
};
</script>
