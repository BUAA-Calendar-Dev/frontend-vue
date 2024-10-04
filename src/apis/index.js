import { getHelloWorld } from "@/apis/demo";
import { getMessageList } from "@/apis/message-receiver";

export default new (class {
  constructor() {
    /**
     * 一个请求的 Demo，返回一小段信息
     */
    this.getHelloWorld = getHelloWorld;

    /**
     * '/api/message'
     */
    this.getMessageList = getMessageList;
  }
})();
