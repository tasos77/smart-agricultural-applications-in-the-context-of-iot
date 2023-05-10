<template>
  <v-app>
    <v-main>
      <DismissableSnackbar :snackbar="snackbar" :snackbar-text="snackbarText" @close="closeSnack" />
      <LoadingBar :loading="loading" />
      <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
          <v-col cols="12" sm="8" md="5">
            <v-flex>
              <v-card elevation="5" class="rounded-xl">
                <v-row>
                  <v-col cols="12" md="12">
                    <v-card-title class="display-1">Account activation</v-card-title>
                    <v-card-text>
                      <v-form
                        ref="form"
                        v-model="valid"
                        @submit.prevent="activateUser({ activateToken, password })"
                      >
                        <!----------------------- Password text field ---------------------->
                        <v-text-field
                          id="password"
                          v-model="password"
                          label="Password"
                          name="password"
                          outlined
                          required
                          prepend-inner-icon="mdi-lock"
                          color="primary"
                          :type="showPassword ? 'text' : 'password'"
                          :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                          :disabled="lockInput"
                          :autofocus="true"
                          @keydown.space.prevent
                          @click:append="showPassword = !showPassword"
                          @focus="clearValidation"
                        />
                        <!----------------------- Password text field ---------------------->
                        <v-text-field
                          id="confirmpassword"
                          v-model="confirmPassword"
                          label="Confirm Password"
                          name="confirmpassword"
                          :rules="[passwordConfirmationRules]"
                          outlined
                          required
                          prepend-inner-icon="mdi-lock"
                          color="primary"
                          :type="showPasswordActivation ? 'text' : 'password'"
                          :append-icon="showPasswordActivation ? 'mdi-eye' : 'mdi-eye-off'"
                          :disabled="lockInput"
                          :messages="inputErrorMessage"
                          :error="inputErrorState"
                          @keydown.space.prevent
                          @click:append="showPasswordActivation = !showPasswordActivation"
                          @focus="clearValidation"
                        />

                        <!----------------------- Submit button ---------------------->
                        <v-btn
                          block
                          color="primary"
                          class="mt-3 colorOnPrimary--text"
                          :disabled="!valid"
                          type="submit"
                          >Activate</v-btn
                        >
                      </v-form>
                    </v-card-text>
                  </v-col>
                </v-row>
              </v-card>
            </v-flex>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>
<script setup lang="ts">
  import tbApi from '../../../../api/tbApi'
  import { ActivationInfo } from '~/types/tbApiTypes'
  const route = useRoute()
  const activateToken = ref(route.query.activateToken ? `${route.query.activateToken}` : '')

  // snackbar starting state
  const snackbar = ref(false)
  const snackbarText = ref(``)

  // starting values and rules
  const loading = ref(false)

  const showPassword = ref(false)
  const showPasswordActivation = ref(false)
  const valid = ref(false)
  const lockInput = ref(false)

  const password = ref('')
  const confirmPassword = ref('')

  const inputErrorState = ref(false)
  const inputErrorMessage = ref('')

  const passwordConfirmationRules = computed(() => {
    if (password.value === confirmPassword.value) {
      return true
    } else {
      return " Passwords don't match"
    }
  })

  // <------------------------------------ Methods ----------------------------------->
  const closeSnack = () => {
    snackbar.value = false
  }

  const clearValidation = () => {
    inputErrorMessage.value = ''
    inputErrorState.value = false
  }

  const activateUser = (activationInfo: ActivationInfo) => {
    // start loading bar
    loading.value = true
    // lock submit buttons
    valid.value = !valid.value
    // lock text fields
    lockInput.value = true
    // try activation

    tbApi
      .activateUser(activationInfo)
      .then(() => {
        // stop loading bar
        loading.value = false
        navigateTo('/login')
      })
      .catch((e) => {
        // stop loading bar
        loading.value = false
        // unlock text fields
        lockInput.value = false
        // check if error
        if (e.response.status === 400) {
          inputErrorState.value = true
          inputErrorMessage.value = e.response.data.msg
        } else if (e.response.status === 500) {
          snackbarText.value = e.response.data.msg
          snackbar.value = true
        }

        // empty text fields
        password.value = ''
        confirmPassword.value = ''
      })
  }
</script>
