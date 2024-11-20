<template>
  <div class="bought-lots-view">

    <v-container>
      <v-row>
        <v-col cols="12"><h2 class="text-primary">Купленные лоты</h2></v-col>
      </v-row>
      <v-row>
        <v-col cols="12" sm="6">
          <v-text-field v-model="withString"
                        clearable
                        label="Со строкой (фильтрация)" />
        </v-col>
        <v-col cols="12" sm="6">
          <v-text-field v-model="withoutString"
                        clearable
                        label="Без строки (фильтрация)" />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" v-for="lot in boughtLots" :key="lot.lot.id">
          <v-card :title="lot.lot.title" :text="lot.lot.description" class="text-tabular">
            <v-card-text class="mt-n5">
              <p><span class="font-weight-bold">Цена покупки:</span> {{lot.hammerPrice}}</p>
              <p><span class="font-weight-bold">Дата покупки:</span> {{getDate(lot.dateTime)}}</p>
              <p><span class="font-weight-bold">Время покупки:</span> {{getTime(lot.dateTime)}}</p>
              <p class="my-3"></p>
              <p>
                <span class="font-weight-bold">Продавец: </span>
                <router-link class="text-primary"
                             :to="{ name: 'userInfoPage', params: { username: lot.seller.username }}">
                  {{lot.seller.username}}
                </router-link>
              </p>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

  </div>
</template>

<script>
  import { mapState } from "vuex";
  import { DateTime } from "luxon";

  export default {
    components: {

    },

    data() {
      return {
        withString: "",
        withoutString: ""
      };
    },

    created() {

    },

    mounted() {
      this.loadLots(null);
    },

    computed: {
      ...mapState([
        "userName", "userId", "currentLocale", "boughtLots"
      ]),
      filter() {
        if (this.withString === "" && this.withoutString === "") {
          return null;
        }

        const params = {};

        if (this.withString !== "") {
          params.with = this.withString;
        }

        if (this.withoutString !== "") {
          params.without = this.withoutString;
        }

        return params;
      }
    },

    watch: {
      filter(newValue) {
        this.loadLots(newValue);
      }
    },

    methods: {
      loadLots(params) {
        if (!this.userId) {
          return;
        }

        this.$store.dispatch("loadBoughtLots", { buyerId: this.userId, params: params });
      },
      getDate(isoDateTime) {
        return DateTime.fromISO(isoDateTime).setLocale(this.currentLocale).toFormat("yyyy.MM.dd");
      },
      getTime(isoDateTime) {
        return DateTime.fromISO(isoDateTime).setLocale(this.currentLocale).toFormat("HH:mm");
      },
    }
  };
</script>

<style lang="scss">
  .v-card-item .v-card-title,
  .v-data-table-header__content,
  .v-data-table-footer {
    color: rgb(var(--v-theme-primary)) !important;
    font-weight: bold;
  }
</style>
