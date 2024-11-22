<template>
  <v-app>
    <v-navigation-drawer v-model="drawer"
                         app>
      <v-list dense
              nav>

        <v-list-item link
                     color="primary"
                     :to="{ name: 'mainPage' }"
                     exact>
          <template v-slot:prepend>
            <v-icon>mdi-gavel</v-icon>
          </template>

          <v-list-item-title>Аукцион</v-list-item-title>
        </v-list-item>

        <v-list-item v-if="isUserInfoPage"
                     active
                     color="primary">
          <template v-slot:prepend>
            <v-icon>mdi-card-account-details-outline</v-icon>
          </template>

          <v-list-item-title>Пользователь</v-list-item-title>
        </v-list-item>

        <v-list-item v-if="isLotInfoPage"
                     active
                     color="primary">
          <template v-slot:prepend>
            <v-icon>mdi-panorama-outline</v-icon>
          </template>

          <v-list-item-title>Лот</v-list-item-title>
        </v-list-item>

        <v-list-item v-if="!isAuthorized"
                     link
                     color="primary"
                     :to="{ name: 'loginPage' }"
                     exact>
          <template v-slot:prepend>
            <v-icon>mdi-gate</v-icon>
          </template>

          <v-list-item-title>Парадный вход</v-list-item-title>
        </v-list-item>

        <v-list-item v-if="!isAuthorized"
                     link
                     color="primary"
                     :to="{ name: 'backDoorPage' }"
                     exact>
          <template v-slot:prepend>
            <v-icon>mdi-gate-open</v-icon>
          </template>

          <v-list-item-title>Чёрный ход</v-list-item-title>
        </v-list-item>

        <v-list-item v-if="!isAuthorized"
                     link
                     color="primary"
                     :to="{ name: 'registrationPage' }"
                     exact>
          <template v-slot:prepend>
            <v-icon>mdi-account-plus</v-icon>
          </template>

          <v-list-item-title>Регистрация</v-list-item-title>
        </v-list-item>

        <template v-if="isAuthorized">

          <v-list-item link
                       color="primary"
                       :to="{ name: 'lotDesignerPage' }"
                       exact>
            <template v-slot:prepend>
              <v-icon>mdi-image-edit</v-icon>
            </template>

            <v-list-item-title>Дизайнер лота</v-list-item-title>
          </v-list-item>

          <v-list-item class="mb-n2">
            <v-list-item-title>Торги:</v-list-item-title>
          </v-list-item>

          <v-list-item link
                       color="primary"
                       :to="{ name: 'lotsForPurchasePage' }"
                       exact>
            <template v-slot:prepend>
              <v-icon>mdi-cart-arrow-down</v-icon>
            </template>

            <v-list-item-title>Я покупаю</v-list-item-title>
          </v-list-item>

          <v-list-item link
                       color="primary"
                       :to="{ name: 'lotsForSalePage' }"
                       exact>
            <template v-slot:prepend>
              <v-icon>mdi-cart-arrow-up</v-icon>
            </template>

            <v-list-item-title>Я продаю</v-list-item-title>
          </v-list-item>

          <v-list-item class="mb-n2">
            <v-list-item-title>Архивные лоты:</v-list-item-title>
          </v-list-item>

          <v-list-item link
                       color="primary"
                       :to="{ name: 'boughtLotsPage' }"
                       exact>
            <template v-slot:prepend>
              <v-icon>mdi-script-text</v-icon>
            </template>

            <v-list-item-title>Купленные лоты</v-list-item-title>
          </v-list-item>

          <v-list-item link
                       color="primary"
                       :to="{ name: 'soldLotsPage' }"
                       exact>
            <template v-slot:prepend>
              <v-icon>mdi-playlist-star</v-icon>
            </template>

            <v-list-item-title>Проданные лоты</v-list-item-title>
          </v-list-item>

          <v-list-item link
                       color="primary"
                       :to="{ name: 'withdrawnLotsPage' }"
                       exact>
            <template v-slot:prepend>
              <v-icon>mdi-playlist-remove</v-icon>
            </template>

            <v-list-item-title>Отменённые лоты</v-list-item-title>
          </v-list-item>

          <v-list-item class="mb-n2">
            <v-list-item-title>Пользователь:</v-list-item-title>
          </v-list-item>

          <v-list-item link
                       color="primary"
                       :to="{ name: 'profilePage' }">
            <template v-slot:prepend>
              <v-icon>mdi-account-cog-outline</v-icon>
            </template>

            <v-list-item-title>Профиль</v-list-item-title>
          </v-list-item>

          <v-list-item link
                       color="primary"
                       :to="{ name: 'walletPage' }"
                       exact>
            <template v-slot:prepend>
              <v-icon>mdi-wallet</v-icon>
            </template>

            <v-list-item-title>Кошелёк</v-list-item-title>
          </v-list-item>

          <v-list-item link
                       color="primary"
                       :to="{ name: 'walletHistoryPage' }"
                       exact>
            <template v-slot:prepend>
              <v-icon>mdi-history</v-icon>
            </template>

            <v-list-item-title>История транзакций</v-list-item-title>
          </v-list-item>

        </template>

        <v-list-item link
                     color="primary"
                     :to="{ name: 'aboutPage' }"
                     exact>
          <template v-slot:prepend>
            <v-icon>mdi-information-outline</v-icon>
          </template>

          <v-list-item-title>О нас</v-list-item-title>
        </v-list-item>

      </v-list>
    </v-navigation-drawer>

    <v-app-bar app
               :elevation="7"
               height="80"
               dark>
      <v-app-bar-nav-icon class="my-auto"
                          color="primary"
                          @click.stop="drawer = !drawer"></v-app-bar-nav-icon>

      <div class="d-flex justify-space-between w-100 ml-3 my-0">
        <div class="my-auto">
          <v-app-bar-title>
            <router-link :to="{ name: 'mainPage' }"
                         class="text-decoration-none">
              <div class="text-h5 text-sm-h4 text-primary">Good Deal</div>
              <div class="mt-n1 d-none d-sm-flex text-h6 text-primary">Хорошая сделка ;)</div>
            </router-link>
          </v-app-bar-title>
        </div>

        <div class="my-auto">
          <v-tooltip location="bottom"
                     text="Текущие дата и время">
            <template v-slot:activator="{ props }">
              <div v-bind="props"
                   class="d-flex flex-column flex-sm-row text-h6 text-primary">
                <div class="active-text">
                  {{getDate(currentDateTime)}}
                </div>
                <div class="d-none d-sm-flex">,&nbsp;</div>
                <div class="align-self-center align-self-sm-start">
                  {{getTime(currentDateTime)}}
                </div>
              </div>
            </template>
          </v-tooltip>
        </div>

        <div v-if="isAuthorized"
             class="my-auto">
          <v-menu offset-y left>
            <template v-slot:activator="{ isActive: showMenu, props }">
              <v-btn flat
                     :ripple="true"
                     color="primary"
                     class="text-h6 pl-2 pr-0 mr-4"
                     v-bind="props"
                     @click="showMenu = true">
                {{ userName }} <v-icon dark>mdi-menu-down</v-icon>
              </v-btn>
            </template>

            <v-list>
              <v-list-item @click="selectTheme">
                <template v-slot:prepend>
                  <v-icon>mdi-palette</v-icon>
                </template>

                <v-list-item-title>Выбрать палитру</v-list-item-title>
              </v-list-item>

              <v-list-item @click="logout">
                <template v-slot:prepend>
                  <v-icon>mdi-exit-to-app</v-icon>
                </template>

                <v-list-item-title>Выйти</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </div>
        <div v-else
             class="my-auto">
          <v-list-item v-if="!isLoginPage"
                       link
                       color="primary"
                       :to="{ name: 'loginPage' }"
                       exact>

            <v-list-item-title class="font-weight-medium text-primary">Войти</v-list-item-title>
          </v-list-item>
        </div>
      </div>
    </v-app-bar>

    <v-main>
      <v-container fluid>
        <router-view id="view" />
      </v-container>
    </v-main>
  </v-app>

  <ThemeChanger />

  <MessagesDemonstrator />

  <v-overlay :model-value="isLoading"
             class="align-center justify-center">
    <v-progress-circular indeterminate
                         color="primary"
                         size="128"
                         width="8" />
  </v-overlay>
</template>

<script>
  import { mapState, mapGetters } from "vuex";

  import ThemeChanger from "@/components/ThemeChanger.vue";
  import MessagesDemonstrator from "@/components/MessagesDemonstrator.vue";

  export default {
    name: "App",

    components: {
      ThemeChanger,
      MessagesDemonstrator
    },

    data() {
      return {
        drawer: null,
        showMenu: false
      };
    },

    created() {
      window.setInterval(
        () => this.$store.commit("setCurrentDateTime"),
        10000);
    },

    computed: {
      ...mapGetters(["isLoading", "isAuthorized"]),

      ...mapState([
        "toasts",
        "userName",
        "currentLocale",
        "currentDateTime"
      ]),

      gridName() {
        return this.$vuetify.display.name;
      },

      isXS() {
        return this.gridName === "xs";
      },

      isSM() {
        return this.gridName === "sm";
      },

      isSmallWidth() {
        return this.gridName === "xs"
          || this.gridName === "sm";
      },

      pageName() {
        return this.$route.name;
      },

      isUserInfoPage() {
        return this.pageName === "userInfoPage";
      },

      isLotInfoPage() {
        return this.pageName === "lotInfoPage";
      },

      isLoginPage() {
        return this.pageName === "loginPage" || this.pageName === "backDoorPage";
      },

      colorThemeName() {
        return this.$store.state.userSettings?.colorThemeName;
      }
    },

    watch: {
      colorThemeName(newValue) {
        if (!newValue) {
          return;
        }

        this.$vuetify.theme.global.name = newValue;
      }
    },

    methods: {
      selectTheme() {
        this.$store.commit("setShowThemeDialog", true);
      },

      selectDate() {
        this.$store.commit("setShowDateDialog", true);
      },

      selectDateRange() {
        this.$store.commit("setShowDateRangeDialog", true);
      },

      logout() {
        this.$store.commit("logoutUser");
        this.$router.push('/');
        //window.location.href = "/login";
      },

      getDate(dateTime) {
        return dateTime.setLocale(this.currentLocale).toFormat("d MMMM");
      },

      getDateDay(dateTime) {
        return dateTime.setLocale(this.currentLocale).toFormat("d");
      },

      getDateMonth(dateTime) {
        return dateTime.setLocale(this.currentLocale).toFormat("MMMM");
      },

      getTime(dateTime) {
        return dateTime.setLocale(this.currentLocale).toFormat("HH:mm");
      }
    }
  };
</script>

<style lang="scss">
  .active-text {
    cursor: pointer;
  }
</style>

