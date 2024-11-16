import axios from "axios";

export function getActivityList() {
  return axios.get(process.env.VUE_APP_ROOT_URL + "/api/activity/public");
}

export function getActivityContent(id) {
  return axios.get(process.env.VUE_APP_ROOT_URL + `/api/activity/${id}/detail`);
}

export function updateActivityJoining(id, operator) {
  return axios.post(
    process.env.VUE_APP_ROOT_URL + `/api/activity/${id}/${operator}`
  );
}
