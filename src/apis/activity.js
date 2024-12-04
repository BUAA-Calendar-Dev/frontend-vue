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

/**
 * 获取活动的一级评论列表
 * @param {number} activityId - 活动ID
 */
export function getComment(activityId) {
  return axios.get(
    process.env.VUE_APP_ROOT_URL + `/api/activity/${activityId}/comments`
  );
}

/**
 * 获取评论的二级回复列表
 * @param {number} commentId - 评论ID
 */
export function getSubComment(commentId) {
  return axios.get(
    process.env.VUE_APP_ROOT_URL + `/api/comment/${commentId}/replies`
  );
}

/**
 * 删除一级评论
 * @param {number} commentId - 评论ID
 */
export function deleteComment(commentId) {
  return axios.post(
    process.env.VUE_APP_ROOT_URL + `/api/comment/${commentId}/delete`
  );
}

/**
 * 删除二级评论
 * @param {number} replyId - 二级评论ID
 */
export function deleteSubComment(replyId) {
  return axios.post(
    process.env.VUE_APP_ROOT_URL + `/api/comment/${replyId}/delete`
  );
}

/**
 * 发表活动评论
 * @param {number} activityId - 活动ID
 * @param {string} content - 评论内容
 */
export function addComment(activityId, content) {
  return axios.post(
    process.env.VUE_APP_ROOT_URL + `/api/activity/${activityId}/comment`,
    { content }
  );
}

/**
 * 发表评论回复
 * @param {number} commentId - 评论ID
 * @param {string} content - 回复内容
 */
export function addSubComment(commentId, content) {
  return axios.post(
    process.env.VUE_APP_ROOT_URL + `/api/comment/${commentId}/reply`,
    { content }
  );
}
