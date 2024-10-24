import { createRouter, createWebHashHistory } from "vue-router";

const routes = [
  {
    path: "/",
    name: "login",
    component: () => import("../views/LoginView.vue"),
  },
  {
    path: "/home",
    name: "home",
    component: () => import("../views/HomeView.vue"),
  },
  {
    path: "/account",
    name: "account",
    component: () => import("../views/AccountView.vue"),
  },
  {
    path: "/register",
    name: "register",
    component: () => import("../views/RegisterView.vue"),
  },
  {
    path: "/admin",
    name: "admin",
    component: () => import("../views/AdminView.vue"),
  },
  {
    path: "/class/manager",
    name: "manager-class",
    component: () => import("../views/ClassManagerView.vue"),
  },
  {
    path: "/activity",
    name: "activity",
    component: () => import("../views/ActivityView.vue"),
  },
  {
    path: "/user",
    name: "user",
    component: () => import("../views/UserView.vue"),
    children: [
      {
        path: "profile",
        name: "profile",
        component: () => import("../views/UserInfo/ProfileView.vue"),
      },
      {
        path: "preference",
        name: "preference",
        component: () => import("../views/UserInfo/PreferenceView.vue"),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
