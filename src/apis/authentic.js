import CryptoJS from "crypto-js";
import axios from "axios";

const crypto = (raw) => {
  return CryptoJS.SHA1(raw + CryptoJS.SHA1(raw) + raw).toString();
};

export function login(username, raw_password, login_as) {
  return axios.post(process.env.VUE_APP_ROOT_URL + "/api/user/login", {
    username: username,
    password: crypto(raw_password),
    authen: ["admin", "teacher", "student"].indexOf(login_as),
  });
}

export function register(username, raw_password, login_as, data) {
  if (login_as == "student") {
    return axios.post(process.env.VUE_APP_ROOT_URL + "/api/user/register", {
      username: username,
      password: crypto(raw_password),
      ...data,
    });
  } else {
    console.log("Unimplemented!");
  }
}
