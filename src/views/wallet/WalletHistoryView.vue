<template>
  <div class="wallet-history-view">
    <v-container>
      <v-row>
        <v-col cols="12"><h2 class="text-primary">История транзакций</h2></v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-data-table :items="walletTransactions" :headers="headers" />
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
        headers: [
          {
            title: 'Дата',
            key: "date",
            sortable: true,
            value: item => this.getDateTime(item.dateTime)
          },
          {
            title: 'Тип',
            key: "typeName",
            sortable: true,
            value: item => this.getTypeName(item.type)
          },
          { title: 'Пополнение', value: 'transferMoney', sortable: true },
          { title: 'Разморозка', value: 'freezingMoney', sortable: true },
          { title: 'Лот', value: 'lot.title', sortable: true },
          {
            title: 'Баланс кошелька',
            align: 'center',
            children: [
              { title: 'Всего', value: 'balance.allMoney', sortable: true },
              { title: 'Свободно', value: 'balance.freeMoney', sortable: true },
              { title: 'Зарезервированно', value: 'balance.frozenMoney', sortable: true },
            ],
          },
        ]
      };
    },

    created() {

    },

    mounted() {
      this.loadTransactions();
    },

    computed: {
      ...mapState([
        "userName", "userId", "currentLocale", "walletTransactions"
      ]),
    },

    watch: {

    },

    methods: {
      loadTransactions() {
        if (!this.userId) {
          return;
        }

        this.$store.dispatch("loadWalletTransactions", this.userId);
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
      getTypeName(type) {
        switch (type) {
          case 0: return "Пополнение";
          case 1: return "Снятие";
          case 2: return "Оплата покупки";
          case 3: return "Получение оплаты";
          case 4: return "Заморозка";
          case 5: return "Разморозка";
          default: return "?";
        }
      }
    }
  };
</script>

<style lang="scss">
</style>
