<template>
  <div class="wallet-view">

    <v-container>
      <v-row>
        <v-col cols="0" sm="2" md="3"></v-col>
        <v-col cols="12" sm="8" md="6">
          <v-card title="Кошелёк" class="text-tabular">
            <v-list lines="one" class="mt-n3">
              <v-list-item :title="'Все деньги: ' + allMoney" />
              <v-list-item :title="'Свободные деньги: ' + freeMoney" />
              <v-list-item :title="'Зарезервированные деньги: ' + frozenMoney" />
            </v-list>
            <v-card-actions class="mr-2 mb-2 mt-n2">
              <v-spacer />
              <v-btn @click="showPutDialog"
                     class="mr-2"
                     color="primary"
                     text="Пополнить"
                     variant="elevated" />
              <v-btn @click="showWithdrawDialog"
                     color="primary"
                     text="Вывести"
                     variant="elevated" />
            </v-card-actions>
          </v-card>
        </v-col>
        <v-col cols="0" sm="2" md="3"></v-col>
      </v-row>
    </v-container>

    <v-dialog v-model="showDialog"
              min-width="300"
              width="600"
              transition="dialog-bottom-transition">
      <v-card class="text-primary ma-0">
        <v-card-title>
          <span v-if="putMoney">Пополнить баланс</span>
          <span v-else>Вывести деньги</span>
        </v-card-title>

        <v-card-text class="pa-4 py-0">
          <v-form @submit.prevent>
            <v-text-field class="mt-4"
                          autofocus
                          clearable
                          label="Сумма"
                          v-model="money" />
          </v-form>
        </v-card-text>

        <v-card-actions class="mb-2 mr-2">
          <v-spacer />
          <v-btn color="secondary"
                 variant="elevated"
                 @click="showDialog = false">Отменить</v-btn>
          <v-btn color="primary"
                 variant="elevated"
                 :disabled="!isValidMoney"
                 @click="moveMoney">
            <span v-if="putMoney">Пополнить</span>
            <span v-else>Вывести</span>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </div>
</template>

<script>
  import { mapState } from "vuex";

  export default {
    components: {

    },

    data() {
      return {
        money: 0,
        showDialog: false,
        putMoney: false
      };
    },

    created() {

    },

    mounted() {
      this.loadBalance();
    },

    computed: {
      ...mapState([
        "userName", "userId", "walletBalance"
      ]),

      isValidMoney() {
        return this.money > 0;
      },

      allMoney() {
        return this.walletBalance.allMoney !== undefined ? this.walletBalance.allMoney : "?";

      },
      freeMoney() {
        return this.walletBalance.freeMoney !== undefined ? this.walletBalance.freeMoney : "?";

      },
      frozenMoney() {
        return this.walletBalance.frozenMoney !== undefined ? this.walletBalance.frozenMoney : "?";

      }
    },

    watch: {
      money(newValue) {
        var number = Number(newValue);

        this.money = isNaN(number) ? 0 : number;
      }
    },

    methods: {
      loadBalance() {
        if (!this.userId) {
          return;
        }

        this.$store.dispatch("loadWalletBalance", this.userId);
      },
      showPutDialog() {
        this.putMoney = true;
        this.showDialog = true;
        this.money = 0;
      },
      showWithdrawDialog() {
        this.putMoney = false;
        this.showDialog = true;
        this.money = 0;
      },
      moveMoney() {
        if (!this.isValidMoney) {
          return;
        }

        const request = {
          ownerId: this.userId,
          money: this.money
        };

        const moveType = this.putMoney ? "putMoneyInWallet" : "withdrawMoneyFromWallet";

        this.$store.dispatch(moveType, request)
          .then(() => {
            this.showDialog = false;
            this.loadBalance();
          });
      }
    }
  };
</script>

<style lang="scss">
</style>
