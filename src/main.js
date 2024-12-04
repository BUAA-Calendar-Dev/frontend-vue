import { createApp } from "vue";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import App from "./App.vue";
import router from "./router";
import "github-markdown-css/github-markdown-light.css";

import texmath from "markdown-it-texmath";
import MarkdownIt from "markdown-it";
import { common, createStarryNight } from "@wooorm/starry-night";
import { toHtml } from "hast-util-to-html";
import "katex/dist/katex.min.css";

// Use Mock to fake the response in development env
process.env.VUE_APP_MOCK == "true" && require("@/mocks/index");

const app = createApp(App);

const starryNight = await createStarryNight(common);

const md = new MarkdownIt({
  highlight(value, lang) {
    const scope = starryNight.flagToScope(lang);
    return toHtml({
      type: "element",
      tagName: "pre",
      properties: {
        className: scope
          ? [
              "highlight",
              "highlight-" + scope.replace(/^source\./, "").replace(/\./g, "-"),
            ]
          : undefined,
      },
      children: scope
        ? /** @type {Array<ElementContent>} */ (
            starryNight.highlight(value, scope).children
          )
        : [{ type: "text", value }],
    });
  },
  html: true,
  breaks: true,
  linkify: true,
});

md.use(texmath, {
  engine: require("katex"),
  delimiters: "dollars", // 使用 $...$ 作为行内公式，$$...$$ 作为块级公式
  katexOptions: {
    macros: {}, // 可以在这里定义自定义宏
    throwOnError: false, // 遇到错误时不抛出异常
    displayMode: false, // 默认使用行内模式
  },
});

app.config.globalProperties.$md = md;
app.config.globalProperties.$var = require("@/global/index").default;
app.config.globalProperties.$apis = require("@/apis/index").default;
app.config.globalProperties.$utils = require("@/utils/index").default;
app.use(router).use(ElementPlus);

// 添加自定义样式
const style = document.createElement("style");
style.textContent = `
/* 调整所有 KaTeX 公式的基础大小 */
.katex {
  font-size: 1.3em !important;
}

/* 调整行内公式大小 */
.katex-inline {
  font-size: 1.2em !important;
}

/* 调整块级公式大小 */
.katex-display {
  font-size: 1.4em !important;
  margin: 1em 0 !important;
}

/* 确保公式容器能够正确显示 */
.katex-display > .katex {
  display: flex !important;
  justify-content: center;
  width: 100%;
}

/* 处理长公式的换行问题 */
.katex-display > .katex > .katex-html {
  overflow-x: auto;
  overflow-y: hidden;
  max-width: 100%;
  padding: 0.5em 0;
}
`;
document.head.appendChild(style);

app.mount("#app");
