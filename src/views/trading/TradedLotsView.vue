<template>
  <div class="traded-lots-view">

    <v-container>
      <v-row>
        <v-col cols="12"><h2 class="text-primary">Продаваемые лоты</h2></v-col>
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
      <v-row v-if="tradedLots">
        <v-col cols="12" sm="6" md="4" lg="3" xl="2"
               v-for="lot in filteredLots" :key="lot.id">
          <v-card class="py-3 px-4 text-h6 text-decoration-none"
                  :to="{ name: 'lotInfoPage', params: { lotId: lot.id }}">
            {{lot.title}}
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
      this.loadLots();
    },

    computed: {
      ...mapState([
        "userName", "userId", "currentLocale", "tradedLots"
      ]),

      filteredLots() {
        let lots = this.tradedLots;

        if (this.withString) {
          const withStr = this.withString.toLowerCase();
          lots = lots.filter(e => e.title.toLowerCase().includes(withStr));
        }

        if (this.withoutString) {
          const without = this.withoutString.toLowerCase();
          lots = lots.filter(e => !e.title.toLowerCase().includes(without));
        }

        return lots;
      }
    },

    watch: {

    },

    methods: {
      loadLots() {
        this.$store.dispatch("loadTradedLots");
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
