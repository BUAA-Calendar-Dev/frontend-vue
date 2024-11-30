import { getHelloWorld } from "@/apis/demo";
import { getMessageList, setReadMessage } from "@/apis/message-receiver";
import { getUser } from "@/apis/user";
import { getEvent, createEvent } from "@/apis/event";
import { login, register } from "@/apis/authentic";
import {
  getUserInfo,
  setUserInfo,
  updateAvatar,
  changePassword,
} from "@/apis/userinfo";
import { getTaskList, createTask } from "@/apis/tasks";
import { getTagList, modifyTag, deleteTag, newTag } from "@/apis/tags";
import {
  getActivityList,
  getActivityContent,
  updateActivityJoining,
  updateActivityContent,
  deleteActivity,
  createActivity,
} from "@/apis/activity";
import {
  getClassList,
  getAvailableStudents,
  getAvailableTeachers,
  addStudentsToClass,
  removeStudentsFromClass,
  addTeachersToClass,
  removeTeachersFromClass,
  createClass,
  getClassStudents,
  getClassTeachers,
} from "@/apis/class";

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

          const loginInfoStr = localStorage.getItem("loginInfo");
          if (loginInfoStr) {
            const loginInfo = JSON.parse(loginInfoStr);
            if (loginInfo && loginInfo.token) {
              config.headers["Authorization"] = "JWT " + loginInfo.token;
            }
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

    // 班级相关接口
    /**
     * 获取班级列表
     * get '/api/class/info'
     */
    this.getClassList = getClassList;

    /**
     * 获取可用学生列表
     * get '/api/student/list'
     */
    this.getAvailableStudents = getAvailableStudents;

    /**
     * 获取可用教师列表
     * get '/api/teacher/list'
     */
    this.getAvailableTeachers = getAvailableTeachers;

    /**
     * 批量添加学生到班级
     * post '/api/class/{id}/student'
     */
    this.addStudentsToClass = addStudentsToClass;

    /**
     * 批量从班级移除学生
     * post '/api/class/{id}/student/delete'
     */
    this.removeStudentsFromClass = removeStudentsFromClass;

    /**
     * 批量添加教师到班级
     * post '/api/class/{id}/teacher'
     */
    this.addTeachersToClass = addTeachersToClass;

    /**
     * 批量从班级移除教师
     * post '/api/class/{id}/remove-teachers'
     */
    this.removeTeachersFromClass = removeTeachersFromClass;

    /**
     * 创建新班级
     * post '/api/class/create'
     */
    this.createClass = createClass;

    /**
     * post '/api/task/create'
     */
    this.createTask = createTask;

    /**
     * post '/api/user/avatar'
     */
    this.updateAvatar = updateAvatar;

    /**
     * post '/api/user/reset_password'
     */
    this.changePassword = changePassword;

    /**
     * 获取班级学生列表
     * get '/api/class/{id}/students'
     */
    this.getClassStudents = getClassStudents;

    /**
     * 获取班级教师列表
     * get '/api/class/{id}/teachers'
     */
    this.getClassTeachers = getClassTeachers;
  }
})();
