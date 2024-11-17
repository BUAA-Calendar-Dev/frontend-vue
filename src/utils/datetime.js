import { dayjs } from "element-plus";

export function formatTimestamp(timestamp, formatter) {
  console.log(timestamp);

  return dayjs(timestamp * 1000).format(formatter);
}
