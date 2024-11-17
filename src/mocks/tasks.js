import mockjs from "mockjs";

mockjs.mock("/api/tasks", "get", () => {
  return {
    code: 0,
    tasks: [
      {
        "task-id": 1,
        "class-id": 1,
        "task-name": "Task-1",
        "task-time": 1731805803,
        "task-percent": 72,
        tags: [0],
        alarms: [0],
      },
      {
        "task-id": 2,
        "class-id": 1,
        "task-name": "Task-2",
        "task-time": 1731805804,
        "task-percent": 27,
        tags: [0],
        alarms: [0],
      },
    ],
  };
});
