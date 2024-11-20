<template>
  <div class="login-view">

    <v-container>
      <v-row>
        <v-col cols="0" sm="2" md="3"></v-col>
        <v-col cols="12" sm="8" md="6">
          <v-card title="Вход" class="text-tabular">
            <v-form ref="registrationForm"
                    @keyup.enter="login"
                    @submit.prevent
                    class="py-3 px-5">
              <v-text-field clearable
                            label="Логин"
                            autocomplete="username"
                            :rules="loginRules"
                            v-model="username"
                            prepend-icon="mdi-account" />
              <v-text-field clearable
                            v-model="password"
                            label="Пароль"
                            autocomplete="new-password"
                            :type="showPassword ? 'text' : 'password'"
                            @click:prepend="showPassword = !showPassword"
                            :prepend-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'" />
            </v-form>
            <v-card-actions class="mr-2 mb-2 mt-n4">
              <v-spacer />
              <v-btn @click="clear"
                     color="secondary"
                     text="Очистить"
                     variant="elevated" />
              <v-btn @click="login"
                     class="ml-2"
                     color="primary"
                     :disabled="!isValid"
                     text="Войти"
                     variant="elevated" />
            </v-card-actions>
          </v-card>
        </v-col>
        <v-col cols="0" sm="3" md="4"></v-col>
      </v-row>
    </v-container>

  </div>
</template>

<script>
  import { mapGetters } from "vuex";
  import DataValidator from "@/common/dataValidator";

  export default {
    data() {
      return {
        username: null,
        password: null,

        showPassword: false,

        loginRules: DataValidator.getLoginRules(),
      };
    },

    computed: {
      ...mapGetters(["isAuthorized"]),

      isValid() {
        return this.username && this.password;
      }
    },

    watch: {
      isAuthorized(newValue) {
        if (newValue === true) {
          this.$router.push('/');
        }
      }
    },

    methods: {
      clear() {
        this.username = null;
        this.password = null;
      },
      login() {
        if (!this.isValid) {
          return;
        }

        const request = {
          "login": this.username,
          "password": this.password
        };

        this.$store.dispatch("login", request);
      },
    }
  };
</script>

<style lang="scss">
</style>
