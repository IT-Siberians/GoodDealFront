<template>
  <div class="profile-view">

    <v-container>
      <v-row>
        <v-col cols="0" sm="2" md="3"></v-col>
        <v-col cols="12" sm="8" md="6">
          <v-card title="Профиль пользователя" class="text-tabular">
            <v-form @submit.prevent class="pa-2">
              <v-text-field class=""
                            disabled
                            clearable
                            label="Email"
                            v-model="email" />
              <v-text-field class=""
                            disabled
                            clearable
                            label="Логин"
                            v-model="username" />
              <v-text-field class=""
                            autofocus
                            clearable
                            label="Имя"
                            v-model.trim="firstName" />
              <v-text-field class=""
                            clearable
                            label="Фамилия"
                            v-model.trim="lastName" />
              <v-text-field class=""
                            clearable
                            label="Телефон"
                            v-model.trim="phoneNumber" />
              <v-checkbox color="primary" class="my-n4 py-0" v-model="isNamePublished" label="Показывать имя другим пользователям" />
              <v-checkbox color="primary" class="my-n4 py-0" v-model="isEmailPublished" label="Показывать email другим пользователям" />
              <v-checkbox color="primary" class="my-n4 py-0" v-model="isPhoneNumberPublished" label="Показывать телефон другим пользователям" />
            </v-form>
            <v-card-actions class="mr-2 mb-2 mt-n4">
              <v-spacer />
              <v-btn @click="setParameters"
                     class="mr-2"
                     color="secondary"
                     :disabled="!isDifference"
                     text="Отменить"
                     variant="elevated" />
              <v-btn @click="updateProfile"
                     color="primary"
                     :disabled="!isDifference || !isValid"
                     text="Сохранить"
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
  import { mapState } from "vuex";

  export default {
    components: {

    },

    data() {
      return {
        email: null,
        username: null,
        firstName: null,
        lastName: null,
        phoneNumber: null,
        photoUrl: null,
        isEmailPublished: false,
        isNamePublished: false,
        isPhoneNumberPublished: false,
      };
    },

    created() {

    },

    mounted() {
      this.loadProfile();
    },

    computed: {
      ...mapState([
        "userName", "userId", "profile"
      ]),
      isDifference() {
        if (!this.profile) {
          return false;
        }

        return this.firstName !== this.profile.firstName
          || this.lastName !== this.profile.lastName
          || this.phoneNumber !== this.profile.phoneNumber
          || this.isEmailPublished !== this.profile.isEmailPublished
          || this.isNamePublished !== this.profile.isNamePublished
          || this.isPhoneNumberPublished !== this.profile.isPhoneNumberPublished;
      },
      isValid() {
        if (!this.profile) {
          return false;
        }

        return this.isValidName(this.firstName)
          && this.isValidName(this.lastName)
          && this.isValidPhone(this.phoneNumber);
      }
    },

    watch: {
      phoneNumber(newValue) {
        if (newValue === "") {
          this.phoneNumber = null;
        }
      }
    },

    methods: {
      isValidName(name) {
        return name && name.length > 0 && name.length <= 30 && this.isCapital(name);
      },
      isValidPhone(phoneNumber) {
        if (phoneNumber === null) {
          return true;
        }
        if (!phoneNumber || phoneNumber.length < 4) {
          return false;
        }
        if (phoneNumber[0] !== "+") {
          return false;
        }

        const rest = phoneNumber.substring(1);

        return Number(rest) !== NaN;
      },
      isCapital(string) {
        if (!string) {
          return false;
        }

        const firstChar = string[0];

        if (string.length === 1) {
          return this.isUpperCase(firstChar);
        }

        const rest = string.substring(1);

        return this.isUpperCase(firstChar) && this.isLowerCase(rest);
      },
      isUpperCase(string) {
        return /^[A-ZА-Я]+$/.test(string);
      },
      isLowerCase(string) {
        return /^[a-zа-я]+$/.test(string);
      },

      setParameters() {
        if (!this.profile) {
          return;
        }

        this.email = this.profile.email;
        this.username = this.profile.username;
        this.firstName = this.profile.firstName;
        this.lastName = this.profile.lastName;
        this.phoneNumber = this.profile.phoneNumber;
        this.photoUrl = this.profile.photoUrl;
        this.isEmailPublished = this.profile.isEmailPublished;
        this.isNamePublished = this.profile.isNamePublished;
        this.isPhoneNumberPublished = this.profile.isPhoneNumberPublished;
      },

      loadProfile() {
        if (!this.userId) {
          return;
        }

        this.$store.dispatch("loadProfileById", this.userId)
          .then(() => {
            this.setParameters();
          });
      },
      updateProfile() {
        if (!this.userId) {
          return;
        }

        const id = this.userId;
        const request = {
          id: this.userId,
          firstName: this.firstName,
          lastName: this.lastName,
          phoneNumber: this.phoneNumber,
          photoUrl: this.photoUrl,
          isEmailPublished: this.isEmailPublished,
          isNamePublished: this.isNamePublished,
          isPhoneNumberPublished: this.isPhoneNumberPublished
        };

        this.$store.dispatch("updateProfile", { id, request })
          .then(() => {
            this.setParameters();
          });
      }
    }
  };
</script>

<style lang="scss">
</style>
