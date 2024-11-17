import axios from "axios";

export function getTagList() {
  return axios.get(process.env.VUE_APP_ROOT_URL + "/api/tags");
}

export function modifyTag(id, title, color) {
  return axios.post(process.env.VUE_APP_ROOT_URL + `/api/tag/${id}/modify`, {
    title: title,
    color: color,
  });
}

export function deleteTag(id) {
  return axios.delete(process.env.VUE_APP_ROOT_URL + `/api/tag/${id}`);
}

export function newTag(title, color) {
  return axios.put(process.env.VUE_APP_ROOT_URL + `/api/tag`, {
    title: title,
    color: color,
  });
}
