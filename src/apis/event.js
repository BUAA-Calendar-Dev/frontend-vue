import axios from "axios";

export function getEvent() {
  return axios.get("/api/event");
}

//post方法应当传入 用户、班级返回当前的DDL，不传班级则返回全部日程
