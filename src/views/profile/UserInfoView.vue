<template>
  <div class="user-info-view">

    <v-container>
      <v-row>
        <v-col cols="0" sm="2" md="3"></v-col>
        <v-col cols="12" sm="8" md="6">
          <v-card title="Данные пользователя"
                  disabled>
            <div class="pa-2" v-if="selectedUserProfile">
              <v-text-field label="Логин"
                            v-if="selectedUserProfile.username"
                            v-model="selectedUserProfile.username" />
              <v-text-field label="Email"
                            v-if="selectedUserProfile.email"
                            v-model="selectedUserProfile.email" />
              <v-text-field label="Имя"
                            v-if="selectedUserProfile.firstName"
                            v-model.trim="selectedUserProfile.firstName" />
              <v-text-field label="Фамилия"
                            v-if="selectedUserProfile.lastName"
                            v-model.trim="selectedUserProfile.lastName" />
              <v-text-field label="Телефон"
                            v-if="selectedUserProfile.phoneNumber"
                            v-model.trim="selectedUserProfile.phoneNumber" />
            </div>
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
    props: {
      username: {
        type: String,
        required: true
      }
    },

    components: {

    },

    data() {
      return {
      };
    },

    created() {

    },

    mounted() {
      this.loadProfile();
    },

    computed: {
      ...mapState([
        "userName", "userId", "selectedUserProfile"
      ])
    },

    watch: {

    },

    methods: {
      loadProfile() {
        if (!this.username) {
          return;
        }

        this.$store.dispatch("loadProfileByUsername", this.username);
      }
    }
  };
</script>

<style lang="scss">
</style>
