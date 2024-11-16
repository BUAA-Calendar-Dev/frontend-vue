import mockjs from "mockjs";

var userData = [
  {
    username: "Alice",
    password: "16f807d4bc31659ba5926601059fc4ab144cb3df",
    authen: 1,
    user_id: 1,
  },
  {
    username: "Bob",
    password: "16f807d4bc31659ba5926601059fc4ab144cb3df",
    authen: 2,
    user_id: 2,
  },
];

mockjs.mock("/api/user/login", "post", (options) => {
  const body = JSON.parse(options.body);

  // Teacher: Username: Alice; Password: 123456
  // Student: Username: Bob; Password: 123456
  for (var data of userData) {
    if (data.username == body.username) {
      if (data.password != body.password) {
        return {
          code: 101,
        };
      }
      if (data.authen != body.authen) {
        return {
          code: 102,
        };
      }
      return {
        code: 0,
        user_id: data.user_id,
      };
    }
  }
  return {
    code: 101,
  };
});

mockjs.mock("/api/user/register", "post", (options) => {
  const body = JSON.parse(options.body);

  for (var data of userData) {
    if (data.username == body.username) {
      return {
        code: 103,
      };
    }
  }
  console.log(`Register: ${body}`);
  userData.push({
    username: body.username,
    password: body.password,
    authen: 2,
    user_id: userData.length + 1,
  });
  return {
    code: 0,
  };
});
