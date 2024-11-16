import mockjs from "mockjs";

var data = {
  1: {
    username: "Alice",
    email: "alice@buaa.edu.cn",
    phone: "13123456789",
    avatar: mockjs.Random.image("200x200"),
  },
  2: {
    username: "Bob",
    email: "bob@buaa.edu.cn",
    phone: "13123456789",
    avatar: mockjs.Random.image("200x200"),
  },
};

const get_user_info_pat = RegExp("/api/user/(\\d+)/info");

mockjs.mock(get_user_info_pat, "get", (options) => {
  const urlParams = options.url.match(get_user_info_pat);
  if (urlParams) {
    const id = urlParams[1];
    return {
      code: 0,
      ...data[id],
    };
  }
  return {
    code: 902,
  };
});

mockjs.mock("/api/user/modify", "post", (options) => {
  const body = JSON.parse(options.body);

  ["avatar", "email", "phone"].forEach((key) => {
    if (body[key]) {
      data["1"][key] = body[key];
    }
  });

  return {
    code: 0,
  };
});
