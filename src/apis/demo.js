import axios from "axios";

export function getHelloWorld() {
  return axios.get(process.env.VUE_APP_ROOT_URL + "/api/hello-world");
}
