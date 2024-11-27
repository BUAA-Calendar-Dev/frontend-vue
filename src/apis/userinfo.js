import axios from "axios";

export function getUserInfo(id) {
  console.log(process.env.VUE_APP_ROOT_URL + `/api/user/${id}/info`);
  return axios.get(process.env.VUE_APP_ROOT_URL + `/api/user/${id}/info`);
}

export function setUserInfo(key, value) {
  return axios.post(
    process.env.VUE_APP_ROOT_URL + "/api/user/modify",
    JSON.stringify({ [key]: value })
  );
}
