<template>
  <div class="lot-designer-view">

    <v-container>
      <v-row>
        <v-col cols="0" sm="2" md="3"></v-col>
        <v-col cols="12" sm="8" md="6">
          <v-card title="Дизайнер лота" class="text-tabular">
            <v-form @submit.prevent class="pa-2">
              <v-text-field autofocus
                            clearable
                            label="Заголовок"
                            v-model="title" />
              <v-textarea label="Описание"
                          v-model="description" />
              <v-text-field clearable
                            label="Начальная цена лота"
                            v-model.trim="startPrice" />
              <v-text-field class=""
                            clearable
                            label="Минимальный шаг ставки"
                            v-model.trim="bidIncrement" />
              <v-text-field clearable
                            label="Цена мгновенного выкупа"
                            v-model.trim="repurchasePrice" />
              <v-text-field clearable
                            label="Длительность аукциона в часах"
                            v-model.trim="hoursCount" />
            </v-form>
            <v-card-actions class="mr-2 mb-2 mt-n4">
              <v-spacer />
              <v-btn @click="showConfirmationDialog = true"
                     color="primary"
                     :disabled="!isValid"
                     text="Отправить лот на торги"
                     variant="elevated" />
            </v-card-actions>
          </v-card>
        </v-col>
        <v-col cols="0" sm="3" md="4"></v-col>
      </v-row>
    </v-container>

    <v-dialog v-model="showConfirmationDialog"
              width="auto"
              transition="dialog-bottom-transition">
      <v-card text="Вы действительно хотите отправить лот на торги?"
              title="Запрос подтверждения">
        <v-card-actions class="mr-2 mb-2 mt-n2">
          <v-spacer />
          <v-btn @click="showConfirmationDialog = false"
                 text="Отменить"
                 class="ml-2"
                 color="secondary"
                 variant="elevated" />
          <v-btn @click="createTradedLot"
                 text="Отправить лот на торги"
                 class="ml-2"
                 color="primary"
                 variant="elevated" />
        </v-card-actions>
      </v-card>
    </v-dialog>

  </div>
</template>

<script>
  import { mapState } from "vuex";
  import { v4 as getUuid } from "uuid";

  export default {
    components: {

    },

    data() {
      return {
        title: null,
        description: null,
        startPrice: null,
        bidIncrement: null,
        repurchasePrice: null,
        hoursCount: null,

        showConfirmationDialog: false
      };
    },

    created() {

    },

    mounted() {

    },

    computed: {
      ...mapState([
        "userName", "userId", "currentDateTime"
      ]),

      isValidTitle() {
        return this.title && this.title.length >= 3 && this.title.length <= 50;
      },
      isValidDescription() {
        return !!this.description;
      },
      isValidStartPrice() {
        return this.startPrice > 0;
      },
      isValidBidIncrement() {
        return this.bidIncrement > 0;
      },
      isValidRepurchasePrice() {
        if (this.repurchasePrice === null) {
          return true;
        }

        return this.repurchasePrice > this.startPrice + this.bidIncrement;
      },
      isValidHoursCount() {
        return this.hoursCount > 0;
      },

      isValid() {
        return this.isValidTitle
          && this.isValidDescription
          && this.isValidStartPrice
          && this.isValidBidIncrement
          && this.isValidRepurchasePrice
          && this.isValidHoursCount;
      }
    },

    watch: {

    },

    methods: {
      createTradedLot() {
        if (!this.userId) {
          return;
        }

        const request = {
          id: getUuid(),
          sellerId: this.userId,
          title: this.title,
          description: this.description,
          startPrice: this.startPrice,
          bidIncrement: this.bidIncrement,
          repurchasePrice: this.repurchasePrice,
          startDate: this.currentDateTime.setZone("utc"),
          endDate: this.currentDateTime.plus({ hours: this.hoursCount }).setZone("utc")
        };

        this.$store.dispatch("createTradedLot", request)
          .then(() => {
            this.$router.push({ name: 'lotInfoPage', params: { lotId: request.id } });
          });
      },
    }
  };
</script>

<style lang="scss">
</style>
