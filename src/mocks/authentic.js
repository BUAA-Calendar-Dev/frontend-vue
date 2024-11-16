import mockjs from "mockjs";

mockjs.mock("/api/user/login", "post", (options) => {
  const body = JSON.parse(options.body);

  // Teacher: Username: Alice; Password: 123456
  // Student: Username: Bob; Password: 123456
  if (
    (body.username == "AliceBob" &&
      body.password == "16f807d4bc31659ba5926601059fc4ab144cb3df") ||
    (body.username == "Bob" &&
      body.password == "16f807d4bc31659ba5926601059fc4ab144cb3df")
  ) {
    if (body.username == "Alice" && body.authen == 1) {
      return {
        code: 0,
        user_id: 1,
        token: "qwertyuiop",
      };
    } else if (body.username == "Bob" && body.authen == 2) {
      return {
        code: 0,
        user_id: 2,
        token: "qwertyuiop",
      };
    } else {
      return {
        code: 102,
      };
    }
  }
  return {
    code: 101,
  };
});
