import axios from "axios";

export function getClassList() {
  return axios.post(process.env.VUE_APP_ROOT_URL + "/api/class/info");
}
