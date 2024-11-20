<template>
  <div class="withdrawn-lots-view">

    <v-container>
      <v-row>
        <v-col cols="12"><h2 class="text-primary">Отменённые лоты</h2></v-col>
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
        <v-col cols="12" v-for="lot in withdrawnLots" :key="lot.lotInfo.id">
          <v-card :title="lot.lotInfo.title" :text="lot.lotInfo.description" class="text-tabular">
            <v-card-text class="mt-n5">
              <p><span class="font-weight-bold">Начальная цена:</span> {{lot.lotParams.startingPrice}}</p>
              <p><span class="font-weight-bold">Шаг ставки:</span> {{lot.lotParams.bidIncrement}}</p>
              <p><span class="font-weight-bold">Цена мгновенного выкупа:</span> {{lot.lotParams.repurchasePrice}}</p>
              <p><span class="font-weight-bold">Дата начала торгов:</span> {{getDate(lot.lotParams.startDateTime)}}, <span class="font-weight-bold"> время:</span> {{getTime(lot.lotParams.startDateTime)}}</p>
              <p><span class="font-weight-bold">Дата окончания торгов:</span> {{getDate(lot.lotParams.endDateTime)}}, <span class="font-weight-bold"> время:</span> {{getTime(lot.lotParams.endDateTime)}}</p>
              <p class="my-3"></p>
              <p><span class="font-weight-bold">Дата отмены торгов:</span> {{getDate(lot.dateTime)}}, <span class="font-weight-bold"> время:</span> {{getTime(lot.dateTime)}}</p>
              <p></p>
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
        "userName", "userId", "currentLocale", "withdrawnLots"
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

        this.$store.dispatch("loadWithdrawnLots", { sellerId: this.userId, params: params });
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
