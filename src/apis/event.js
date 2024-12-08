import axios from "axios";

export function getEvent() {
  return axios.get(process.env.VUE_APP_ROOT_URL + "/api/event/e");
}

export function createEvent(EventStart, EventEnd, EventName, EventContent) {
  return axios.post(process.env.VUE_APP_ROOT_URL + "/api/event/e/create", {
    start: EventStart,
    end: EventEnd,
    name: EventName,
    content: EventContent,
  });
}

export function modifyEventColor(eventId, color, isTask = false) {
  return axios.post(
    process.env.VUE_APP_ROOT_URL + `/api/event/e/${eventId}/color`,
    {
      color: color,
      "is-task": isTask,
    }
  );
}
