import { createApp } from "vue";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import App from "./App.vue";
import router from "./router";

// Use Mock to fake the response in development env
process.env.VUE_APP_MOCK == "true" && require("@/mocks/index");

const app = createApp(App);

app.config.globalProperties.$var = require("@/global/index").default;
app.config.globalProperties.$apis = require("@/apis/index").default;
app.config.globalProperties.$utils = require("@/utils/index").default;
app.use(router).use(ElementPlus);
app.mount("#app");
