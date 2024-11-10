import { dayjs } from "element-plus";

export function formatTimestamp(timestamp, formatter) {
  return dayjs(timestamp * 1000).format(formatter);
}
