<template>
  <v-app>
    <v-main>
      <LoadingBar :loading="loading" />
      <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
          <v-col cols="12" sm="8" md="5">
            <v-flex>
              <v-card elevation="5" class="rounded-xl">
                <v-row>
                  <v-col cols="12" md="12">
                    <v-card-title class="display-1"
                      >Account activation</v-card-title
                    >
                    <v-card-text>
                      <v-form
                        ref="form"
                        v-model="valid"
                        @submit.prevent="activateUser"
                      >
                        <!----------------------- Password text field ---------------------->
                        <v-text-field
                          id="password"
                          v-model="userInfo.password"
                          label="Password"
                          name="password"
                          outlined
                          required
                          prepend-inner-icon="mdi-lock"
                          color="primary"
                          :type="showPassword ? 'text' : 'password'"
                          :append-icon="
                            showPassword ? 'mdi-eye' : 'mdi-eye-off'
                          "
                          :disabled="lockInput"
                          :autofocus="true"
                          @keydown.space.prevent
                          @click:append="showPassword = !showPassword"
                          @focus="clearValidation"
                        />
                        <!----------------------- Password text field ---------------------->
                        <v-text-field
                          id="confirmpassword"
                          v-model="userInfo.confirmPassword"
                          label="Confirm Password"
                          name="confirmpassword"
                          :rules="[passwordConfirmationRules]"
                          outlined
                          required
                          prepend-inner-icon="mdi-lock"
                          color="primary"
                          :type="showPasswordActivation ? 'text' : 'password'"
                          :append-icon="
                            showPasswordActivation ? 'mdi-eye' : 'mdi-eye-off'
                          "
                          :disabled="lockInput"
                          :messages="inputErrorMessage"
                          :error="inputErrorState"
                          @keydown.space.prevent
                          @click:append="
                            showPasswordActivation = !showPasswordActivation
                          "
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
<script>
import LoadingBar from "../../../../components/LoadingBar.vue";
export default {
  name: "LoginForm",
  components: {
    LoadingBar,
  },
  data: () => ({
    // starting values and rules
    loading: false,
    showPassword: false,
    showPasswordActivation: false,
    valid: false,
    lockInput: false,
    userInfo: {
      confirmPassword: "",
      password: "",
    },
    inputErrorState: false,
    inputErrorMessage: "",
  }),
  computed: {
    passwordConfirmationRules() {
      if (this.userInfo.password === this.userInfo.confirmPassword) {
        return true;
      } else {
        return " Passwords don't match";
      }
    },
  },

  methods: {
    getQueryToken() {
      return this.$route.query.activateToken;
    },
    clearValidation() {
      this.inputErrorMessage = "";
      this.inputErrorState = false;
      this.$refs.form.resetValidation();
    },
    // <------------------ Login process ------------------>
    activateUser() {
      // start loading bar
      this.loading = true;
      // lock submit buttons
      this.valid = !this.valid;
      // lock text fields
      this.lockInput = true;
      // try activation
      this.$axios
        .post("api/v1/auth/activate", {
          activationToken: this.getQueryToken(),
          password: this.userInfo.confirmPassword,
        })
        .then(() => {
          // stop loading bar
          this.loading = false;
          this.$router.push("/login");
        })
        .catch((e) => {
          // stop loading bar
          this.loading = false;
          // unlock text fields
          this.lockInput = false;
          // check if error
          if (e.response.status === 400) {
            this.inputErrorState = true;
            this.inputErrorMessage = e.response.data.message;
          } else if (e.response.status === 500) {
            // notify user
            this.$notifier.showMessage({
              content: e.response.data.message,
              color: "",
            });
          }
          // empty text fields
          this.userInfo.password = "";
          this.userInfo.confirmPassword = "";
        });
    },
  },
};
</script>
