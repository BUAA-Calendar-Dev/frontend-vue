import mockjs from "mockjs";

mockjs.mock("/api/hello-world", "get", {
  code: 0,
  msg: "Hello, world! (Mocked)",
});
