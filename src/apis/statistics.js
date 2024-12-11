import axios from "axios";

/**
 * 获取用户数量
 * @returns {teacher: number, student: number}
 */
export function getUserCount() {
  return axios.get(process.env.VUE_APP_ROOT_URL + "/api/user/count");
}

/**
 * 获取任务数量，每位学生的每个任务算一项？
 * @returns {task: number, done: number}
 */
export function getTaskCount() {
  return axios.get(process.env.VUE_APP_ROOT_URL + "/api/task/count");
}

/**
 * 获取任务完成的各种情况，依次为 已完成、进行中、过期未完成、未开始，数值为数量
 * @returns {completionRate: [number]}
 */
export function getTaskCompletion() {
  return axios.get(process.env.VUE_APP_ROOT_URL + "/api/task/completion");
}

/**
 * 获取【班级】任务完成的各种情况，依次为 已完成、进行中、过期未完成、未开始，数值为数量
 * @returns {completionRate: [number]}
 */
export function getTaskClassCompletion(classId) {
  return axios.get(
    process.env.VUE_APP_ROOT_URL + `/api/task/class/${classId}/completion`
  );
}

/**
 * 获取【个人】任务完成的各种情况，依次为 已完成、进行中、过期未完成、未开始，数值为数量
 * @returns {completionRate: [number]}
 */
export function getTaskSchoolCompletion() {
  return axios.get(process.env.VUE_APP_ROOT_URL + `/api/task/self/completion`);
}

/**
 * 获取各个活动参与人次
 * @returns {activity: [string], join: [number]}
 */
export function getActivityJoining() {
  return axios.get(process.env.VUE_APP_ROOT_URL + "/api/activity/joining");
}

/**
 * 获取近期任务完成率，从当天开始，往前推 7 天，按天统计，最近的在下标最后
 * @returns {completionRate: [number]}
 */
export function getTaskCompletionRateNear() {
  return axios.get(process.env.VUE_APP_ROOT_URL + "/api/task/completion/7days");
}
