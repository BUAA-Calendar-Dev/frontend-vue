import axios from "axios";

export function getHelloWorld() {
  return axios.get("/api/hello-world");
}
