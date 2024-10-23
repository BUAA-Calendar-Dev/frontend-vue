import mockjs from "mockjs";

mockjs.mock("/api/user/login", "post", (options) => {
  console.log(options.body);
  return {
    code: 0,
    user_id: options.body["authen"] == 2 ? 2 : 1,
    token: "qwertyuiop",
  };
});
