/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

import store from "./store";

import { createWebHistory } from "vue-router";
import createRouter from "./router";
const router = createRouter(createWebHistory(), store);

import { createApp } from "vue";
import App from "./App.vue";
const app = createApp(App);

import vuetify from "./plugins/vuetify";

app.use(router)
  .use(store)
  .use(vuetify)
  .mount("#app");

app.config.globalProperties.$adapter = vuetify.date.adapter;

import axios from "axios";
axios.defaults.headers.post["Content-Type"] = "application/json";
