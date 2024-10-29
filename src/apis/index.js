import { getHelloWorld } from "@/apis/demo";
import { getMessageList, setReadMessage } from "@/apis/message-receiver";
import { getUser } from "@/apis/user";
import { getEvent, createEvent } from "@/apis/event";
import { login } from "@/apis/authentic";
import { getUserInfo, setUserInfo } from "@/apis/userinfo";

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

    /**
     * get '/api/user
     * @deprecated Use `getUserInfo(id)` instead.
     */
    this.getUser = getUser;

    /**
     * get '/api/event
     */
    this.getEvent = getEvent;

    /**
     * post '/api/event
     */
    this.createEvent = createEvent;

    /**
     * post '/api/user/login'
     */
    this.login = login;

    /**
     * get '/api/user/{id}/info'
     */
    this.getUserInfo = getUserInfo;

    /**
     * post '/api/user/modify'
     */
    this.setUserInfo = setUserInfo;
  }
})();
