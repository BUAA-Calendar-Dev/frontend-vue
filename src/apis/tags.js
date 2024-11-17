import axios from "axios";

export function getTagList() {
  return axios.get(process.env.VUE_APP_ROOT_URL + "/api/tags");
}
