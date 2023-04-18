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
        <VCol cols="12" sm="8" md="5">
          <!----------------------Logo --------------------->
          <VRow align="center" justify="center">
            <img class="w-75 mb-4" alt="logo" :src="logo" />
          </VRow>
          <VRow>
            <!------------------------------ Login form ------------------------------->
            <VCard elevation="0" class="rounded-xl w-100" color="colorSurface">
              <VCardTitle class="text-h4 text-colorOnBackground pa-4"
                >Login</VCardTitle
              >
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
                    color="colorPrimary"
                    :disabled="loading"
                    :autofocus="true"
                    validate-on="blur"
                    @keydown.space.prevent
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
                    color="colorPrimary"
                    :disabled="loading"
                    @keydown.space.prevent
                    @click:append-inner="showPass"
                  />
                  <!----------------------- Forgot pass link ---------------------->
                  <ForgotPasswordLink />
                  <VBtn
                    :block="true"
                    color="colorPrimary"
                    class="mt-3 mb-2 text-colorOnPrimary"
                    :disabled="!valid"
                    type="submit"
                    elevation="0"
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
  </VApp>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from "vue";
import { useTheme } from "vuetify";
import { login } from "../api/wxmApi";
import { tokensAuthStore } from "../stores/auth";
import DismissableSnackbar from "../components/DismissableSnackbar.vue";
import SignUpLink from "../components/SignUpLink.vue";
import ForgotPasswordLink from "../components/ForgotPassordLink.vue";
import LoadingBar from "../components/LoadingBar.vue";
import lightLogo from "../../assets/light.svg";
import darkLogo from "../../assets/dark.svg";
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
// <------------------------------------ Computed vars ----------------------------------->
const logo = computed(() => {
  return useTheme().global.name.value === "mainDarkTheme"
    ? darkLogo
    : lightLogo;
});
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
