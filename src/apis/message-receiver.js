import axios from "axios";

export function getMessageList() {
  return axios.get(process.env.VUE_APP_ROOT_URL + "/api/message");
}

export function setReadMessage(id) {
  return axios.post(process.env.VUE_APP_ROOT_URL + `/api/message/${id}/read`);
}
