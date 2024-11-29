import { getHelloWorld } from "@/apis/demo";
import { getMessageList, setReadMessage } from "@/apis/message-receiver";
import { getUser } from "@/apis/user";
import { getEvent, createEvent } from "@/apis/event";
import { login, register } from "@/apis/authentic";
import { getUserInfo, setUserInfo } from "@/apis/userinfo";
import { getClassList } from "@/apis/class";
import { getTaskList } from "@/apis/tasks";
import { getTagList, modifyTag, deleteTag, newTag } from "@/apis/tags";
import {
  getActivityList,
  getActivityContent,
  updateActivityJoining,
  updateActivityContent,
  deleteActivity,
  createActivity,
} from "@/apis/activity";

import axios from "axios";

export default new (class {
  constructor() {
    if (process.env.VUE_APP_ROOT_URL != "") {
      axios.defaults.withCredentials = true;
      axios
        .get(process.env.VUE_APP_ROOT_URL + "/api/token/")
        .then((response) => {
          let csrf_token = response.data.token;
          window.sessionStorage.setItem("csrf_token", csrf_token);
        });

      axios.interceptors.request.use(
        function (config) {
          const csrf_token = window.sessionStorage.getItem("csrf_token");
          if (csrf_token && config.method == "post") {
            config.headers["X-CSRFToken"] = csrf_token;
          }

          const user_token = window.sessionStorage.getItem("user_token");
          if (user_token) {
            config.headers["Authorization"] = "JWT " + user_token;
          }

          return config;
        },
        function (error) {
          return Promise.reject(error);
        }
      );
    }

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
     * post '/api/user/register'
     */
    this.register = register;

    /**
     * get '/api/user/{id}/info'
     */
    this.getUserInfo = getUserInfo;

    /**
     * post '/api/user/modify'
     */
    this.setUserInfo = setUserInfo;

    /**
     * get '/api/activity/public'
     */
    this.getActivityList = getActivityList;

    /**
     * get '/api/activity/{id}/detail'
     */
    this.getActivityContent = getActivityContent;

    /**
     * post '/api/activity/{id}/exit'
     *   or
     * post '/api/activity/{id}/join'
     *
     * `operator` shall be 'exit' or 'join'
     */
    this.updateActivityJoining = updateActivityJoining;

    /**
     * get '/api/class'
     */
    this.getClassList = getClassList;

    /**
     * get '/api/tasks'
     */
    this.getTaskList = getTaskList;

    /**
     * get 'api/tags'
     */
    this.getTagList = getTagList;

    /**
     * post '/api/tag/{id}/modify'
     */
    this.modifyTag = modifyTag;

    /**
     * delete '/api/tag/{id}'
     */
    this.deleteTag = deleteTag;

    /**
     * put '/api/tag'
     */
    this.newTag = newTag;

    /**
     * 更新活动内容
     * post '/api/activity/{id}/modify'
     */
    this.updateActivityContent = updateActivityContent;

    /**
     * 删除活动
     * post '/api/activity/{id}/delete'
     */
    this.deleteActivity = deleteActivity;

    /**
     * post '/api/activity/create'
     */
    this.createActivity = createActivity;
  }
})();
