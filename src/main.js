import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

process.env.VUE_APP_MOCK == "true" && require("@/mocks/index");

import axios from "axios";

const app = createApp(App);

app.config.globalProperties.$axios = axios;
app.use(router).mount("#app");
