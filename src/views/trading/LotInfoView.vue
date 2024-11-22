<template>
  <div class="lot-info-view">

    <v-container>
      <v-row>
        <v-col cols="0" sm="1" md="2" lg="3"></v-col>
        <v-col cols="12" sm="10" md="8" lg="6">
          <v-card v-if="selectedTradedLot">
            <v-card-title v-if="isUserLot"
                          class="text-primary">
              <v-badge inline content="Ваш лот" color="primary" class="ml-n1">{{selectedTradedLot.title}} </v-badge>
            </v-card-title>
            <v-card-title v-else
                          class="text-primary">
              {{selectedTradedLot.title}}
            </v-card-title>

            <v-card-text>
              {{selectedTradedLot.description}}
            </v-card-text>

            <v-list lines="one">
              <v-list-item title="Дата начала торгов:">
                <span class="text-h6 text-secondary">
                  {{getDateTime(selectedTradedLot.startDate)}}
                </span>
              </v-list-item>
              <v-list-item title="Дата окончания торгов:">
                <span class="text-h6 text-secondary">
                  {{getDateTime(selectedTradedLot.endDate)}}
                </span>
              </v-list-item>
              <v-list-item v-if="selectedTradedLot.repurchasePrice"
                           title="Цена мгновенного выкупа:">
                <span class="text-h6 text-secondary">
                  {{selectedTradedLot.repurchasePrice}}
                </span>
              </v-list-item>
              <v-list-item title="Текущая ставка:">
                <div v-if="isUserBid">
                  <v-badge inline content="Ваша ставка" color="primary" class="ml-n1">
                    <span class="text-h6 text-secondary">
                      {{currentBid}}
                    </span>
                  </v-badge>
                </div>
                <div v-else>
                  <span class="text-h6 text-secondary">
                    {{currentBid}} ₽
                  </span>
                </div>
              </v-list-item>
              <v-list-item title="Минимальная следующая ставка:">
                <span class="text-h6 text-secondary">
                  {{nextMinBid}} ₽
                </span>
              </v-list-item>
              <v-list-item title="Продавец:">
                <span class="text-h6 text-secondary">
                  <router-link class="text-primary"
                               :to="{ name: 'userInfoPage', params: { username: selectedTradedLot.sellerUsername }}">
                    {{selectedTradedLot.sellerUsername}}
                  </router-link>
                </span>
              </v-list-item>
            </v-list>

            <v-card-actions class="mr-2 mb-2 mt-n2">
              <v-spacer />
              <v-btn @click="loadLotInfo"
                     class="m1-2"
                     color="secondary"
                     text="Обновить"
                     variant="elevated" />
              <template v-if="isAuthorized && !isUserLot">
                <v-btn @click="createBid(nextMinBid)"
                       :disabled="!canMakeBid"
                       class="ml-2"
                       color="primary"
                       text="Минимальная ставка"
                       variant="elevated" />
                <v-btn @click="showBidDialog = true"
                       :disabled="!canMakeBid"
                       class="ml-2"
                       color="primary"
                       text="Ставка"
                       variant="elevated" />
              </template>
              <template v-else-if="isAuthorized && isUserLot">
                <v-btn @click="showConfirmationDialog = true"
                       class="ml-2"
                       color="primary"
                       text="Отменить"
                       variant="elevated" />
              </template>
            </v-card-actions>
          </v-card>
        </v-col>
        <v-col cols="0" sm="1" md="2" lg="3"></v-col>
      </v-row>
    </v-container>

    <v-dialog v-model="showConfirmationDialog"
              width="auto"
              transition="dialog-bottom-transition">
      <v-card text="Вы действительно хотите отменить лот?"
              title="Запрос подтверждения">
        <v-card-actions class="mr-2 mb-2 mt-n2">
          <v-spacer />
          <v-btn @click="showConfirmationDialog = false"
                 text="Прекратить отмену лота"
                 class="ml-2"
                 color="secondary"
                 variant="elevated" />
          <v-btn @click="cancelTradedLot"
                 text="Выполнить отмену лота"
                 class="ml-2"
                 color="primary"
                 variant="elevated" />
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="showBidDialog"
              width="auto"
              transition="dialog-bottom-transition">
      <v-card title="Задать произвольную ставку выше минимальной">
        <v-card-text class="pa-4 py-0">
          <v-form @submit.prevent>
            <v-text-field class="mt-4"
                          autofocus
                          clearable
                          label="Сумма ставки"
                          v-model="bidMoney" />
          </v-form>
        </v-card-text>
        <v-card-actions class="mb-2 mr-2">
          <v-spacer />
          <v-btn color="secondary"
                 variant="elevated"
                 text="Отменить"
                 @click="showBidDialog = false" />
          <v-btn color="primary"
                 variant="elevated"
                 text="Подтвердить ставку"
                 :disabled="bidMoney < nextMinBid"
                 @click="createBid(bidMoney)" />
        </v-card-actions>
      </v-card>
    </v-dialog>

  </div>
</template>

<script>
  import { mapState, mapGetters } from "vuex";
  import { DateTime } from "luxon";

  export default {
    props: {
      lotId: {
        type: String,
        required: true
      }
    },

    components: {

    },

    data() {
      return {
        showConfirmationDialog: false,
        showBidDialog: false,
        bidMoney: 0
      };
    },

    created() {

    },

    mounted() {
      this.loadLotInfo();
    },

    computed: {
      ...mapState([
        "userName", "userId", "currentLocale", "selectedTradedLot"
      ]),
      ...mapGetters([
        "isLoading", "isAuthorized"
      ]),

      currentBid() {
        if (!this.selectedTradedLot) {
          return 0;
        }
        if (!this.selectedTradedLot.lastBid) {
          return this.selectedTradedLot.startPrice;
        }

        return this.selectedTradedLot.lastBid.amount;
      },
      nextMinBid() {
        if (!this.selectedTradedLot) {
          return 0;
        }

        return this.currentBid + this.selectedTradedLot.bidIncrement;
      },
      isUserLot() {
        if (!this.userId || !this.selectedTradedLot) {
          return false;
        }

        return this.userId === this.selectedTradedLot.sellerId;
      },
      isUserBid() {
        if (!this.userId || !this.selectedTradedLot || !this.selectedTradedLot.lastBid || this.isUserLot) {
          return false;
        }

        return this.userId === this.selectedTradedLot.lastBid.customerId;
      },
      canMakeBid() {
        return this.isAuthorized && !this.isUserLot && !this.isUserBid;
      }
    },

    watch: {

    },

    methods: {
      loadLotInfo() {
        if (!this.lotId) {
          return;
        }

        this.$store.dispatch("loadSelectedTradedLot", this.lotId);
      },
      cancelTradedLot() {
        if (!this.isUserLot) {
          return;
        }

        const request = {
          sellerId: this.userId,
          auctionLotId: this.lotId
        };

        this.$store.dispatch("cancelTradedLot", request)
          .then(() => {
            this.loadLotInfo();
            this.showConfirmationDialog = false;
          });
      },
      createBid(moneyValue) {
        if (moneyValue < this.nextMinBid || this.isUserBid || this.isUserLot) {
          return;
        }

        const request = {
          customerId: this.userId,
          auctionLotId: this.lotId,
          amount: moneyValue
        };

        this.$store.dispatch("createBid", request)
          .then(() => {
            this.loadLotInfo();
            this.showBidDialog = false;
          });
      },

      getDate(isoDateTime) {
        return DateTime.fromISO(isoDateTime).setLocale(this.currentLocale).toFormat("yyyy.MM.dd");
      },
      getTime(isoDateTime) {
        return DateTime.fromISO(isoDateTime).setLocale(this.currentLocale).toFormat("HH:mm");
      },
      getDateTime(isoDateTime) {
        return DateTime.fromISO(isoDateTime).setLocale(this.currentLocale).toFormat("yyyy.MM.dd HH:mm:ss");
      },
    }
  };
</script>

<style lang="scss">
</style>
