import mockjs from "mockjs";

var data = {
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
};

mockjs.mock("/api/message", "get", data);

const read_message_pat = RegExp("/api/message/(\\d+)/read");

mockjs.mock(read_message_pat, "post", (options) => {
  const urlParams = options.url.match(read_message_pat);
  if (urlParams) {
    const id = urlParams[1];
    data.messages[id - 1].unread = false;
  }
  return {
    code: 0,
  };
});
