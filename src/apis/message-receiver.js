import axios from "axios";

export function getMessageList() {
  return axios.get("/api/message");
}
