import axios from "axios";
import CryptoJS from "crypto-js";

const crypto = (raw) => {
  return CryptoJS.SHA1(raw + CryptoJS.SHA1(raw) + raw).toString();
};

/**
 * @deprecated No such api in our document!
 */
export function getUser() {
  return axios.get(process.env.VUE_APP_ROOT_URL + "/api/user/info");
}

export function impowerTeacher(userId) {
  return axios.post(`${process.env.VUE_APP_ROOT_URL}/api/user/impower`, {
    userid: userId,
  });
}

export function resetUserPassword(userId, rawPassword) {
  return axios.post(
    `${process.env.VUE_APP_ROOT_URL}/api/user/${userId}/reset-password`,
    {
      password: crypto(rawPassword),
    }
  );
}

/**
 * 获取所有用户列表
 * @returns {Promise} axios请求Promise
 */
export function getAllUsers() {
  return axios.get(`${process.env.VUE_APP_ROOT_URL}/api/user/list`);
}
