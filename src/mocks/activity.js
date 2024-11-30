import mockjs from "mockjs";

let signed_in_1 = false;
let signed_in_2 = true;

mockjs.mock("/api/activity/public", "get", () => {
  return {
    code: 0,
    activities: [
      {
        id: 1,
        name: "Activity-1",
        time: 1731162619,
        tags: [], // TODO: Waiting for the tags to implemented
        "signed-in": signed_in_1,
      },
      {
        id: 2,
        name: "Activity-2",
        time: 1731162699,
        tags: [], // TODO: Waiting for the tags to implemented
        "signed-in": signed_in_2,
      },
    ],
  };
});

const get_activity_pat = RegExp("^/api/activity/(\\d+)/(\\w+)");

mockjs.mock(get_activity_pat, "get", (options) => {
  const urlParams = options.url.match(get_activity_pat);
  const id = urlParams[1];
  const operator = urlParams[2];

  if (operator == "detail") {
    return {
      code: 0,
      content: `This is the detailed content of id=${id}.`,
    };
  }
});

mockjs.mock(get_activity_pat, "post", (options) => {
  const urlParams = options.url.match(get_activity_pat);
  const id = urlParams[1];
  const operator = urlParams[2];

  if (id == 1) {
    signed_in_1 = operator == "join";
  }

  if (id == 2) {
    signed_in_2 = operator == "join";
  }

  if (operator == "join" || operator == "exit") {
    return {
      code: 0,
    };
  }
});
