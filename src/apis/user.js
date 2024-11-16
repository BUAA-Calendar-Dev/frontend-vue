import axios from "axios";

/**
 * @deprecated No such api in our document!
 */
export function getUser() {
  return axios.get(process.env.VUE_APP_ROOT_URL + "/api/user");
}
