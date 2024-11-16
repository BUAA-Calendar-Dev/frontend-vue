import axios from "axios";

export function getEvent() {
  return axios.get(process.env.VUE_APP_ROOT_URL + "/api/event");
}

export function createEvent(EventStart, EventEnd, EventName, EventContent) {
  return axios.post(process.env.VUE_APP_ROOT_URL + "/api/event/create", {
    start: EventStart,
    end: EventEnd,
    title: EventName,
    content: EventContent,
  });
}
