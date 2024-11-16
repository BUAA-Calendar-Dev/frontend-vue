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
    path: "/admin",
    name: "admin",
    component: () => import("../views/AdminView.vue"),
  },
  {
    path: "/class/view",
    name: "list-class",
    component: () => import("../views/ClassView.vue"),
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
    children: [
      {
        path: "school",
        name: "school",
        component: () => import("../views/ActivityItem/SchoolActivityView.vue"),
      },
      {
        path: "picked",
        name: "picked",
        component: () => import("../views/ActivityItem/PickedActivityView.vue"),
      },
    ],
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
