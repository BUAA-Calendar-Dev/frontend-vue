import axios from "axios";

export function getTagList() {
  return axios.get(process.env.VUE_APP_ROOT_URL + "/api/tag");
}

export function modifyTag(id, title, color) {
  return axios.post(process.env.VUE_APP_ROOT_URL + `/api/tag/${id}/modify`, {
    title: title,
    color: color,
  });
}

export function deleteTag(id) {
  return axios.post(process.env.VUE_APP_ROOT_URL + `/api/tag/${id}/delete`);
}

export function newTag(title, color) {
  return axios.put(process.env.VUE_APP_ROOT_URL + `/api/tag`, {
    title: title,
    color: color,
  });
}
