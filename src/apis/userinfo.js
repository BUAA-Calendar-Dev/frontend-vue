import axios from "axios";
import CryptoJS from "crypto-js";

// 复用 authentic.js 中的加密函数
const crypto = (raw) => {
  return CryptoJS.SHA1(raw + CryptoJS.SHA1(raw) + raw).toString();
};

export function getUserInfo(id) {
  return axios.get(process.env.VUE_APP_ROOT_URL + `/api/user/${id}/info`);
}

export function setUserInfo(key, value) {
  return axios.post(
    process.env.VUE_APP_ROOT_URL + "/api/user/modify",
    JSON.stringify({ [key]: value })
  );
}

export function updateAvatar(file) {
  const formData = new FormData();
  formData.append("img", file);

  return axios.post(
    process.env.VUE_APP_ROOT_URL + "/api/user/avatar",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
}

export function changePassword(data) {
  return axios.post(process.env.VUE_APP_ROOT_URL + "/api/user/reset_password", {
    "old-password": crypto(data["old-password"]),
    "new-password": crypto(data["new-password"]),
  });
}
