import axios from "axios";

export function getActivityList() {
  return axios.get("/api/activity/public");
}

export function getActivityContent(id) {
  return axios.get(`/api/activity/${id}/detail`);
}

export function updateActivityJoining(id, operator) {
  return axios.post(`/api/activity/${id}/${operator}`);
}
