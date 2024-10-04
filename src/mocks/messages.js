import mockjs from "mockjs";

mockjs.mock("/api/message", "get", {
  code: 0,
  messages: [
    {
      id: 1,
      title: "msg1",
      from: "admin",
      time: 1728054803,
      content: "This is message 1",
      unread: true,
    },
    {
      id: 2,
      title: "msg2",
      from: "admin",
      time: 1728054803,
      content: "This is message 2",
      unread: false,
    },
    {
      id: 3,
      title: "msg3",
      from: "admin",
      time: 1728054804,
      content: "This is message 3",
      unread: true,
    },
  ],
});
