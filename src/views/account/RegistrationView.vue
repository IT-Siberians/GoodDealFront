<template>
  <div class="registration-view">

    <v-container>
      <v-row>
        <v-col cols="0" sm="2" md="3"></v-col>
        <v-col cols="12" sm="8" md="6">
          <v-card title="Регистрация пользователя" class="text-tabular">
            <v-form ref="registrationForm"
                    @keyup.enter="registerUser"
                    @submit.prevent
                    class="py-3 px-5">
              <v-text-field autofocus
                            clearable
                            label="Email"
                            autocomplete="email"
                            :rules="emailRules"
                            v-model="email"
                            prepend-icon="mdi-email-outline" />
              <v-text-field clearable
                            label="Логин"
                            autocomplete="username"
                            :rules="loginRules"
                            v-model="username"
                            prepend-icon="mdi-account" />
              <v-text-field clearable
                            label="Имя"
                            :rules="firstNameRules"
                            v-model.trim="firstName"
                            prepend-icon="mdi-rename" />
              <v-text-field clearable
                            label="Фамилия"
                            :rules="lastNameRules"
                            v-model.trim="lastName"
                            prepend-icon="mdi-rename" />

              <v-text-field clearable
                            v-model="password"
                            label="Пароль"
                            autocomplete="new-password"
                            :type="showPassword ? 'text' : 'password'"
                            @click:prepend="showPassword = !showPassword"
                            :prepend-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                            :rules="passwordRules" />
              <v-text-field clearable
                            v-model="passwordConfirmation"
                            label="Подтверждение пароля"
                            autocomplete="new-password"
                            :type="showPasswordConfirmation ? 'text' : 'password'"
                            @click:prepend="showPasswordConfirmation = !showPasswordConfirmation"
                            :prepend-icon="showPasswordConfirmation ? 'mdi-eye' : 'mdi-eye-off'"
                            :rules="passwordConfirmationRules" />
            </v-form>
            <v-card-actions class="mr-2 mb-2 mt-n4">
              <v-spacer />
              <v-btn :to="{ name: 'loginPage' }"
                     color="secondary"
                     text="Отменить"
                     variant="elevated" />
              <v-btn @click="registerUser"
                     class="ml-2"
                     color="primary"
                     :disabled="!isValid"
                     text="Зарегистрировать"
                     variant="elevated" />
            </v-card-actions>
          </v-card>
        </v-col>
        <v-col cols="0" sm="3" md="4"></v-col>
      </v-row>
    </v-container>

    <v-dialog v-model="registeringUser"
              width="auto"
              transition="dialog-bottom-transition">
      <v-card title="Введите код подтверждения отправленный на почту">
        <v-card-text class="pa-4 py-0">
          <v-form @submit.prevent>
            <v-text-field class="mt-4"
                          autofocus
                          clearable
                          label="Код подтверждения"
                          v-model="confirmationCode" />
          </v-form>
        </v-card-text>
        <v-card-actions class="mb-2 mr-2">
          <v-spacer />
          <v-btn color="secondary"
                 variant="elevated"
                 text="Отменить"
                 @click="resetRegisteringUser" />
          <v-btn color="primary"
                 variant="elevated"
                 text="Отправить"
                 :disabled="!confirmationCode"
                 @click="confirmEmail" />
        </v-card-actions>
      </v-card>
    </v-dialog>

  </div>
</template>

<script>
  import { mapState } from "vuex";
  import DataValidator from "@/common/dataValidator";

  export default {
    data() {
      return {
        email: null,
        username: null,
        firstName: null,
        lastName: null,

        password: null,
        passwordConfirmation: null,

        showPassword: false,
        showPasswordConfirmation: false,

        isValidForm: false,

        loginRules: DataValidator.getLoginRules(),
        emailRules: DataValidator.getEmailRules(),
        firstNameRules: DataValidator.getFirstNameRules(),
        lastNameRules: DataValidator.getLastNameRules(),

        passwordOptions: {
          requiredLength: 7,
          requireLowercase: true,
          requireUppercase: true,
          requireDigit: true
        },

        confirmationCode: null
      }
    },

    computed: {
      ...mapState([
        "userName", "userId", "registeringUser"
      ]),

      passwordRules() {
        return DataValidator.getPasswordRules(this.passwordOptions);
      },
      passwordConfirmationRules() {
        return DataValidator.getPasswordConfirmationRules(this.password, this.passwordOptions);
      },

      isComplete() {
        return this.email && this.username && this.firstName && this.lastName && this.password && this.passwordConfirmation;
      },
      isValid() {
        if (this.isComplete) {
          this.validateForm();
        }

        return this.isComplete && this.isValidForm;
      }
    },

    methods: {
      async validateForm() {
        if (!this.$refs.registrationForm) {
          return;
        }

        const { valid } = await this.$refs.registrationForm.validate();

        this.isValidForm = valid;
      },
      registerUser() {
        if (!this.isValid) {
          return;
        }

        const request = {
          email: this.email,
          username: this.username,
          firstName: this.firstName,
          lastName: this.lastName,
          password: this.password
        };

        this.$store.dispatch("registerUser", request);
      },
      confirmEmail() {
        if (!this.registeringUser) {
          return;
        }

        const request = {
          id: this.registeringUser.id,
          newEmail: this.registeringUser.email,
          code: this.confirmationCode
        };

        this.$store.dispatch("confirmEmail", request)
          .then(() => {
            this.resetRegisteringUser();
            this.confirmationCode = null;
            this.$router.push('/login');
          });
      },
      resetRegisteringUser() {
        this.$store.commit("setRegisteringUser", null);
      }
    }
  };
</script>

<style lang="scss">
</style>
