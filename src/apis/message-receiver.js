import axios from "axios";

export function getMessageList() {
  return axios.get("/api/message");
}

export function setReadMessage(id) {
  return axios.post(`/api/message/${id}/read`);
}
