import { createStore } from "vuex";
import { DateTime } from "luxon";

import WalletService from "@/services/walletService";
import ArchiveService from "@/services/archiveService";
import ProfileService from "@/services/profileService";
import TradingService from "@/services/tradingService";
import AuthenticationService from "@/services/authenticationService";

function addToast(state, message, variant) {
  let title;
  let timeout;
  let color;

  if (variant === "error") {
    title = "Фатальная ошибка";
    timeout = -1;
    color = "error";
  } else if (variant === "warning") {
    title = "Ошибка";
    timeout = -1;
    color = "warning";
  } else if (variant === "success") {
    title = "Оповещение";
    timeout = 2000;
    color = "success";
  } else {
    return;
  }

  state.toasts.push({
    title,
    message,
    variant,
    timeout,
    color
  });

  state.toasts = state.toasts.slice();
}

export default createStore({
  modules: {

  },

  state: {
    // Services:

    walletService: new WalletService(),
    archiveService: new ArchiveService(),
    profileService: new ProfileService(),
    tradingService: new TradingService(),
    authenticationService: new AuthenticationService(),

    // All:

    loadingsCount: 0,
    toasts: [],
    currentLocale: "ru",
    currentDateTime: DateTime.now(),

    // Test users:

    users: [
      { username: "AlexA", id: "11111111-5717-4562-b3fc-111100001111" },
      { username: "BorisB", id: "11111111-5717-4562-b3fc-111100002222" },
      { username: "CarinC", id: "11111111-5717-4562-b3fc-111100003333" },
      { username: "DenisD", id: "11111111-5717-4562-b3fc-111100004444" },

      { username: "vostric", id: "3fa85f64-5717-4562-b3fc-2c961f62afa6" },
      { username: "mike_nsk", id: "4ca85f64-5717-4562-b3fc-2c961f62afa6" },
      { username: "yana", id: "5da85f64-5717-4562-b3fc-2c961f62afa6" },
    ],

    // Account:

    userId: null, //"11111111-5717-4562-b3fc-111100004444", //window.GoodDeal.UserId,
    userName: null, //"mike", //window.GoodDeal.UserName,

    // Authentication:

    registeringUser: null,

    // Profile:

    profile: null,
    selectedUserProfile: null,

    // Archive:

    boughtLots: [],
    soldLots: [],
    withdrawnLots: [],

    // Wallet:

    walletBalance: {},
    walletTransactions: [],

    // Trading:

    tradedLots: [],
    selectedTradedLot: null,
    selectedCustomer: null,
  },

  getters: {
    isAuthorized: state => {
      return state.userId !== null;
    },
    isLoading: state => {
      return state.loadingsCount > 0;
    }
  },

  mutations: {
    // All:

    loginUser(state, user) {
      state.userId = user.id;
      state.userName = user.username;
    },

    logoutUser(state) {
      state.userId = null;
      state.userName = null;
    },

    setToasts(state, newValue) {
      state.toasts = newValue;
    },

    success(state, message) {
      addToast(state, message, "success");
    },

    error(state, reason) {
      if (!reason.response) {
        addToast(state, reason.message, "error");
        return;
      }

      const data = reason.response.data;
      const messages = [];

      if (typeof data === "string") {
        messages.push(data);
      } else if (data.errorMessage) {
        messages.push(data.errorMessage);
      } else if (data.errors) {
        for (const key in data.errors) {
          data.errors[key].forEach(message => messages.push(message));
        }
      } else {
        messages.push(reason.message);
      }

      const errorType = reason.status >= 500 ? "error" : "warning";

      messages.forEach(message => addToast(state, message, errorType));
    },

    warning(state, data) {
      addToast(state, data, "warning");
    },

    setCurrentLocale(state, newValue) {
      state.currentLocale = newValue;
    },

    setCurrentDateTime(state, newValue) {
      if (newValue !== undefined) {
        state.currentDateTime = newValue;
      } else {
        state.currentDateTime = DateTime.now();
      }
    },

    setShowThemeDialog(state, newValue) {
      state.showThemeDialog = newValue;
    },

    startLoading(state) {
      ++state.loadingsCount;
    },

    stopLoading(state) {
      state.loadingsCount = Math.max(state.loadingsCount - 1, 0);
    },

    // Authentication:

    setRegisteringUser(state, newValue) {
      state.registeringUser = newValue;
    },

    // Profile:

    setProfile(state, newValue) {
      state.profile = newValue;
    },

    setSelectedUserProfile(state, newValue) {
      state.selectedUserProfile = newValue;
    },

    // Archive:

    setBoughtLots(state, newValue) {
      state.boughtLots = newValue;
    },

    setSoldLots(state, newValue) {
      state.soldLots = newValue;
    },

    setWithdrawnLots(state, newValue) {
      state.withdrawnLots = newValue;
    },

    // Wallet:

    setWalletBalance(state, newValue) {
      state.walletBalance = newValue;
    },

    setWalletTransactions(state, newValue) {
      state.walletTransactions = newValue;
    },

    // Trading:

    setTradedLots(state, newValue) {
      state.tradedLots = newValue;
    },

    setSelectedTradedLot(state, newValue) {
      state.selectedTradedLot = newValue;
    },

    setSelectedCustomer(state, newValue) {
      state.selectedCustomer = newValue;
    },
  },

  actions: {
    // Authentication:

    registerUser({ state, commit }, request) {
      commit("startLoading");
      return state.authenticationService
        .registerUser(request)
        .then(response => commit("setRegisteringUser", response.data))
        .catch(reason => commit("error", reason))
        .finally(() => commit("stopLoading"));
    },

    confirmEmail({ state, commit }, request) {
      commit("startLoading");
      return state.authenticationService
        .confirmEmail(request)
        .catch(reason => commit("error", reason))
        .finally(() => commit("stopLoading"));
    },

    login({ state, commit }, request) {
      commit("startLoading");
      return state.authenticationService
        .login(request)
        .then(response => commit("loginUser", { id: response.data.data, username: request.login }))
        .catch(reason => commit("error", reason))
        .finally(() => commit("stopLoading"));
    },

    logout({ state, commit }, request) {
      commit("startLoading");
      return state.authenticationService
        .logout(request)
        .then(() => commit("logoutUser"))
        .catch(reason => commit("error", reason))
        .finally(() => commit("stopLoading"));
    },

    // Profile:

    loadProfileById({ state, commit }, id) {
      commit("startLoading");
      return state.profileService
        .getProfileById(id)
        .then(response => commit("setProfile", response.data))
        .catch(reason => commit("error", reason))
        .finally(() => commit("stopLoading"));
    },

    loadProfileByUsername({ state, commit }, username) {
      commit("startLoading");
      return state.profileService
        .getProfileByUsername(username)
        .then(response => commit("setSelectedUserProfile", response.data))
        .catch(reason => commit("error", reason))
        .finally(() => commit("stopLoading"));
    },

    updateProfile({ state, commit }, { id, request }) {
      commit("startLoading");
      return state.profileService
        .updateProfile(id, request)
        .then(response => commit("setProfile", response.data))
        .catch(reason => commit("error", reason))
        .finally(() => commit("stopLoading"));
    },

    deleteProfile({ state, commit }, id) {
      commit("startLoading");
      return state.profileService
        .deleteProfile(id)
        .catch(reason => commit("error", reason))
        .finally(() => commit("stopLoading"));
    },

    // Archive:

    loadBoughtLots({ state, commit }, { buyerId, params }) {
      commit("startLoading");
      return state.archiveService.getBoughtLots(buyerId, params)
        .then(response => commit("setBoughtLots", response.data.result.items))
        .catch(reason => commit("error", reason))
        .finally(() => commit("stopLoading"));
    },

    loadSoldLots({ state, commit }, { sellerId, params }) {
      commit("startLoading");
      return state.archiveService.getSoldLots(sellerId, params)
        .then(response => commit("setSoldLots", response.data.result.items))
        .catch(reason => commit("error", reason))
        .finally(() => commit("stopLoading"));
    },

    loadWithdrawnLots({ state, commit }, { sellerId, params }) {
      commit("startLoading");
      return state.archiveService.getWithdrawnLots(sellerId, params)
        .then(response => commit("setWithdrawnLots", response.data.result.items))
        .catch(reason => commit("error", reason))
        .finally(() => commit("stopLoading"));
    },

    // Wallet:

    loadWalletBalance({ state, commit }, ownerId) {
      commit("startLoading");
      return state.walletService.getWalletBalance(ownerId)
        .then(response => commit("setWalletBalance", response.data.result))
        .catch(reason => commit("error", reason))
        .finally(() => commit("stopLoading"));
    },

    loadWalletTransactions({ state, commit }, ownerId) {
      commit("startLoading");
      return state.walletService.getWalletTransactions(ownerId)
        .then(response => commit("setWalletTransactions", response.data.result.items))
        .catch(reason => commit("error", reason))
        .finally(() => commit("stopLoading"));
    },

    putMoneyInWallet({ state, commit }, request) {
      commit("startLoading");
      return state.walletService
        .putMoneyInWallet(request)
        .then(response => {
          commit("success", response.data.message);
          return Promise.resolve(response);
        })
        .catch(reason => commit("error", reason))
        .finally(() => commit("stopLoading"));
    },

    withdrawMoneyFromWallet({ state, commit }, request) {
      commit("startLoading");
      return state.walletService
        .withdrawMoneyFromWallet(request)
        .then(response => {
          commit("success", response.data.message);
          return Promise.resolve(response);
        })
        .catch(reason => commit("error", reason))
        .finally(() => commit("stopLoading"));
    },

    // Trading:

    loadTradedLots({ state, commit }) {
      commit("startLoading");
      return state.tradingService
        .getTradedLots()
        .then(response => commit("setTradedLots", response.data))
        .catch(reason => commit("error", reason))
        .finally(() => commit("stopLoading"));
    },

    loadSelectedTradedLot({ state, commit }, id) {
      commit("startLoading");
      return state.tradingService
        .getTradedLotById(id)
        .then(response => commit("setSelectedTradedLot", response.data))
        .catch(reason => commit("error", reason))
        .finally(() => commit("stopLoading"));
    },

    loadSelectedCustomer({ state, commit }, id) {
      commit("startLoading");
      return state.tradingService
        .getCustomerById(id)
        .then(response => commit("setSelectedCustomer", response.data))
        .catch(reason => commit("error", reason))
        .finally(() => commit("stopLoading"));
    },

    createBid({ state, commit }, request) {
      commit("startLoading");
      return state.tradingService
        .createBid(request)
        .catch(reason => commit("error", reason))
        .finally(() => commit("stopLoading"));
    },

    createTradedLot({ state, commit }, request) {
      commit("startLoading");
      return state.tradingService
        .createTradedLot(request)
        .catch(reason => commit("error", reason))
        .finally(() => commit("stopLoading"));
    },

    cancelTradedLot({ state, commit }, request) {
      commit("startLoading");
      return state.tradingService
        .cancelTradedLot(request)
        .catch(reason => commit("error", reason))
        .finally(() => commit("stopLoading"));
    },
  }
});
