import { createRouter } from "vue-router/auto";

import LoginView from "@/views/LoginView.vue";

import LotDesignerView from "@/views/designer/LotDesignerView.vue";

import TradedLotsView from "@/views/trading/TradedLotsView.vue";
import LotInfoView from "@/views/trading/LotInfoView.vue";

import ProfileView from "@/views/profile/ProfileView.vue";
import UserInfoView from "@/views/profile/UserInfoView.vue";

import BoughtLotsView from "@/views/archive/BoughtLotsView.vue";
import SoldLotsView from "@/views/archive/SoldLotsView.vue";
import WithdrawnLotsView from "@/views/archive/WithdrawnLotsView.vue";

import WalletView from "@/views/wallet/WalletView.vue";
import WalletHistoryView from "@/views/wallet/WalletHistoryView.vue";

const routes = [
  {
    path: "/",
    name: "mainPage",
    component: TradedLotsView,
    meta: {
      pageTitle: "Аукцион"
    }
  },
  {
    path: "/lotInfo/:lotId",
    name: "lotInfoPage",
    component: LotInfoView,
    meta: {
      pageTitle: "Параметры лота",
    },
    props: route => ({
      lotId: String(route.params.lotId)
    })
  },
  {
    path: "/userInfo/:username",
    name: "userInfoPage",
    component: UserInfoView,
    meta: {
      pageTitle: "Данные пользователя",
    },
    props: route => ({
      username: String(route.params.username)
    })
  },
  {
    path: "/login",
    name: "loginPage",
    component: LoginView,
    meta: {
      pageTitle: "Вход"
    }
  },
  {
    path: "/lotDesigner",
    name: "lotDesignerPage",
    component: LotDesignerView,
    meta: {
      pageTitle: "Дизайнер лота"
    }
  },
  {
    path: "/boughtLots",
    name: "boughtLotsPage",
    component: BoughtLotsView,
    meta: {
      pageTitle: "Купленные лоты"
    }
  },
  {
    path: "/soldLots",
    name: "soldLotsPage",
    component: SoldLotsView,
    meta: {
      pageTitle: "Проданные лоты"
    }
  },
  {
    path: "/withdrawnLots",
    name: "withdrawnLotsPage",
    component: WithdrawnLotsView,
    meta: {
      pageTitle: "Отменённые лоты"
    }
  },
  {
    path: "/profile",
    name: "profilePage",
    component: ProfileView,
    meta: {
      pageTitle: "Профиль пользователя"
    }
  },
  {
    path: "/wallet",
    name: "walletPage",
    component: WalletView,
    meta: {
      pageTitle: "Кошелёк"
    }
  },
  {
    path: "/wallet/history",
    name: "walletHistoryPage",
    component: WalletHistoryView,
    meta: {
      pageTitle: "Транзакции"
    }
  },
];

export default function (history, store) {
  const router = createRouter({
    history,
    routes
  });

  router.beforeEach((to, from, next) => {
    if (!store.getters.isAuthorized
      && !to.path.startsWith("/lotInfo")
      && !to.path.startsWith("/userInfo")
      && to.path !== "/"
      && to.path !== "/login") {
      next("/login");
    } else if (to.path === "/login" && store.getters.isAuthorized) {
      next("/");
    } else {
      next();
    }
  });

  return router;
}
