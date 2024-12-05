import axios from "axios";

export function getTaskList() {
  return axios.get(process.env.VUE_APP_ROOT_URL + "/api/task/info");
}

export function createTask(data) {
  return axios.post(process.env.VUE_APP_ROOT_URL + "/api/task/create", data);
}

export function assignTaskToUser(taskId, data) {
  return axios.post(
    `${process.env.VUE_APP_ROOT_URL}/api/task/${taskId}/user`,
    data
  );
}

export function assignTaskToClass(taskId, data) {
  return axios.post(
    `${process.env.VUE_APP_ROOT_URL}/api/task/${taskId}/class`,
    data
  );
}

export function assignTaskToSchool(taskId, data) {
  return axios.post(
    `${process.env.VUE_APP_ROOT_URL}/api/task/${taskId}/school`,
    data
  );
}

export function updateTaskStatus(taskId, data) {
  return axios.post(
    `${process.env.VUE_APP_ROOT_URL}/api/task/${taskId}/percentage`,
    data
  );
}

export function updateTask(taskId, data) {
  return axios.post(
    `${process.env.VUE_APP_ROOT_URL}/api/task/${taskId}/modify`,
    data
  );
}
