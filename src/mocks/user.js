import mockjs from "mockjs";

var data = {
  code: 0,
  users: {
    id: 1,
    username: "邱奕铖",
    avatar: require("@/assets/default-avatar.png"),
    password: "abc.123",
  },
};

mockjs.mock("/api/user", "get", data);
