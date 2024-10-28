import axios from "axios";

export function getEvent() {
  return axios.get("/api/event");
}

export function createEvent(EventStart, EventEnd, EventName, EventContent) {
  return axios.post("/api/event/create", {
    start: EventStart,
    end: EventEnd,
    title: EventName,
    content: EventContent,
  });
}
