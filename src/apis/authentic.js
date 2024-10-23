import CryptoJS from "crypto-js";
import axios from "axios";

export function login(username, raw_password, login_as) {
  return axios.post("/api/user/login", {
    username: username,
    password: CryptoJS.SHA1(
      raw_password + CryptoJS.SHA1(raw_password) + raw_password
    ).toString(),
    authen: ["admin", "teacher", "student"].indexOf(login_as),
  });
}
