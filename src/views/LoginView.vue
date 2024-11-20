<template>
  <div class="login-view">

    <v-container>
      <v-row>
        <v-col cols="0" sm="4" md="4" xl="5"></v-col>
        <v-col cols="12" sm="4" md="3" xl="2">
          <v-card title="Пользователи" class="text-tabular">
            <v-list lines="one" class="mt-n3">
              <v-list-item v-for="user in users" :key="user.id"
                           @click="login(user)"
                           :title="user.username" />
            </v-list>
          </v-card>
        </v-col>
        <v-col cols="0" sm="4" md="5" xl="5"></v-col>
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

      };
    },

    created() {

    },

    mounted() {

    },

    computed: {
      ...mapState([
        "userName", "userId", "users"
      ])
    },

    watch: {

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
