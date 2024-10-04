import { getHelloWorld } from "@/apis/demo";
import { getMessageList, setReadMessage } from "@/apis/message-receiver";

export default new (class {
  constructor() {
    /**
     * 一个请求的 Demo，返回一小段信息
     */
    this.getHelloWorld = getHelloWorld;

    /**
     * get '/api/message'
     */
    this.getMessageList = getMessageList;

    /**
     * post '/api/message/{id}/read
     */
    this.setReadMessage = setReadMessage;
  }
})();
