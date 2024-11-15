import { ElNotification } from "element-plus";

export function popupMessage(type, title, content, duration = 3000) {
  ElNotification({
    title: title,
    message: content,
    type: type,
    duration: duration,
  });
}

export function handleHttpException(error) {
  popupMessage("error", "Requests failed!", error, 5000);
}
