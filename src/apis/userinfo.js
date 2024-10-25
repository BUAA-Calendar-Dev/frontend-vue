import axios from "axios";

export function getUserInfo(id) {
  return axios.get(`/api/user/${id}/info`);
}

export function setUserInfo(key, value) {
  return axios.post("/api/user/modify", JSON.stringify({ [key]: value }));
}
