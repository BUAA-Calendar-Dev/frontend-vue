import axios from "axios";

export function getTaskList() {
  return axios.get(process.env.VUE_APP_ROOT_URL + "/api/task/info");
}

export function createTask(data) {
  return axios.post(process.env.VUE_APP_ROOT_URL + "/api/task/create", data);
}
