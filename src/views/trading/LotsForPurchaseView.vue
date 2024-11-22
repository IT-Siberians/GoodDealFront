<template>
  <div class="lots-for-purchase-view">

    <v-container>
      <v-row>
        <v-col cols="12" sm="9" md="10" xl="11"><h2 class="text-primary">Я покупаю</h2></v-col>
        <v-col cols="12" sm="3" md="2" xl="1">
          <v-btn @click="loadLots"
                 class="w-100"
                 color="primary"
                 text="Обновить"
                 variant="elevated" />
        </v-col>
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
      <v-row v-if="filteredLots">
        <v-col cols="12" sm="6" md="4" lg="3" xl="2"
               v-for="lot in filteredLots" :key="lot.lot.id">
          <v-card class="py-3 px-4 text-h6 text-decoration-none"
                  :to="{ name: 'lotInfoPage', params: { lotId: lot.lot.id }}">
            <p>
              {{lot.lot.title}}
            </p>
            <p>
              <v-chip v-if="lot.lot.lastBid.customerId === userId"
                      variant="elevated"
                      color="success">
                Ваша ставка: {{lot.price}} ₽
              </v-chip>
              <v-chip v-else
                      variant="elevated"
                      color="error">
                Чужая ставка: {{lot.price}} ₽
              </v-chip>
            </p>
            <p class="mt-2">
              <v-chip variant="elevated">
                {{lot.lot.sellerUsername}}
              </v-chip>
            </p>
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
        "userName", "userId", "currentLocale", "selectedCustomer"
      ]),

      userLots() {
        if (!this.selectedCustomer) {
          return [];
        }

        return this.selectedCustomer.observedAuctionLots;
      },

      lotsAndPrices() {
        return this.userLots.map(e => ({
          lot: e,
          price: !e.lastBid ? e.startPrice : e.lastBid.amount
        }));
      },

      filteredLots() {
        let lots = this.lotsAndPrices;

        if (this.withString) {
          const withStr = this.withString.toLowerCase();
          lots = lots.filter(e => e.lot.title.toLowerCase().includes(withStr));
        }

        if (this.withoutString) {
          const without = this.withoutString.toLowerCase();
          lots = lots.filter(e => !e.lot.title.toLowerCase().includes(without));
        }

        return lots;
      }
    },

    watch: {

    },

    methods: {
      loadLots() {
        if (!this.userId) {
          return;
        }

        this.$store.dispatch("loadSelectedCustomer", this.userId);
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
