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

export function updateActivityContent(id, content) {
  return axios.post(
    process.env.VUE_APP_ROOT_URL + `/api/activity/${id}/modify`,
    content
  );
}

export function deleteActivity(id) {
  return axios.post(
    process.env.VUE_APP_ROOT_URL + `/api/activity/${id}/delete`
  );
}

export function createActivity(activityData) {
  return axios.post(
    process.env.VUE_APP_ROOT_URL + "/api/activity/create",
    activityData
  );
}
