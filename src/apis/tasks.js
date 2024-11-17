import axios from "axios";

export function getTaskList() {
  return axios.get(process.env.VUE_APP_ROOT_URL + "/api/tasks");
}
