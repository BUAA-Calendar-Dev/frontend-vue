# BUAA Calendar（前端） homePage部分

## 依赖下载

目前使用`vue-cal`作为homePage的核心组件，需要使用以下方式来安装依赖。
```
yarn add vue-cal
```

## 构建项目

> **Whisper:** 个人觉得 `npm` 很难用，遂尝试使用 `yarn`，不过首先需要安装一下：
>
> ```
> npm install -g yarn
> ```
>
> Windows 下可能需要一些其他操作。同时，建议 `node` 版本高一些。

> **Whisper:** VS Code 使用插件 `Prettier` 进行自动的代码格式化，使用插件 `ESLint` 进行代码的检查，这两方面不使用官方插件 `Vue Official`。（因为后者似乎会认为 Vue 自动生成的代码有格式问题，并且格式化之后不符合 `ESLint` 的检查。）
> 同时安装这些插件，会因为有多个格式化程序同时存在而报错，可以点一下界面右下角 `Vue` 与 `JavaScript` 左边的 `{}`，然后配置一下这两种语言的格式化程序。

### 安装依赖

```
yarn install
```

### 编译并启动热重载（development 环境）

```
yarn serve
```

### 编译并优化项目（production 环境）

```
yarn build
```

### 检查并修复代码文件

```
yarn lint
```

### 自定义配置

参考： [vue 配置文档](https://cli.vuejs.org/config/)。

## 项目结构

- `@/apis`：向发起 Axios 请求
  - 全部请求封装到 `index.js` 导出的默认类的实例中，并以 `$apis` 加载到 vue 的全局属性中
  - 子模块中，导出相应的请求函数（`export function`），返回 `Promise` 对象
  - 使用时，通过 vue 实例进行，并需要处理返回的内容与错误
    ```js
    this.$apis.getFoo().then((response) => {...}).catch((error) => {...})
    ```
- `@/assets`：放置视图中会用到的资源
- `@/components`：定义 vue 公共组件
- `@/router/index.js`：定义 Hash 路由内容
- `@/views`：定义 vue 视图
- `@/mocks`：在没有后端的情况下伪造返回数据
  - 通过 `mockjs.mock(url, method, return-json)` 简单地进行数据伪造
  - 子模块调用上述函数即可，需要在 `index.js` 中导入相关文件
  - 仅在 development 环境下会启用
