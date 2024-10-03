import { getHelloWorld } from "@/apis/demo";

export default new (class {
  constructor() {
    /**
     * 一个请求的 Demo，返回一小段信息
     */
    this.getHelloWorld = getHelloWorld;
  }
})();
