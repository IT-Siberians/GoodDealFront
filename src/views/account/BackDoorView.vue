<template>
  <div class="back-door-view">

    <v-container>
      <v-row>
        <v-col cols="0" sm="2" md="3" xl="4"></v-col>
        <v-col cols="12" sm="8" md="6" xl="4">
          <v-card title="Вход для пользователей:" class="text-tabular">
            <v-list lines="one" class="mt-n3 ma-6">
              <v-list-item v-for="user in users" :key="user.id"
                           @click="login(user)"
                           prepend-icon="mdi-account-tie"
                           :title="user.username" />
            </v-list>
          </v-card>
        </v-col>
        <v-col cols="0" sm="2" md="3" xl="4"></v-col>
      </v-row>
    </v-container>

  </div>
</template>

<script>
  import { mapState } from "vuex";

  export default {
    computed: {
      ...mapState([
        "users"
      ])
    },

    methods: {
      login(user) {
        this.$store.commit("loginUser", user);
        this.$router.push('/');
      }
    }
  };
</script>

<style lang="scss">
</style>
