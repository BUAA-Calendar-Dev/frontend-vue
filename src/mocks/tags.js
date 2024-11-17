import mockjs from "mockjs";

var data = [
  {
    id: 1,
    title: "Tag-1",
    color: "#66ccff",
    fixed: true,
  },
  {
    id: 2,
    title: "Tag-2",
    color: "#a65959",
    fixed: false,
  },
  {
    id: 3,
    title: "Tag-3",
    color: "#e6a819",
    fixed: false,
  },
];

mockjs.mock("/api/tags", "get", () => {
  return {
    code: 0,
    tags: data,
  };
});

const urlDelete = RegExp("/api/tag/(\\d+)");

mockjs.mock(urlDelete, "delete", (options) => {
  const urlParams = options.url.match(urlDelete);
  if (urlParams) {
    const id = urlParams[1];
    data = data.filter((item) => item.id != id);
  }
  return {
    code: 0,
  };
});

const urlModify = RegExp("/api/tag/(\\d+)/modify");

mockjs.mock(urlModify, "post", (options) => {
  const urlParams = options.url.match(urlModify);
  const body = JSON.parse(options.body);
  if (urlParams) {
    const id = urlParams[1];
    for (let index = 0; index < data.length; index++) {
      if (data[index].id == id) {
        data[index].title = body.title;
        data[index].color = body.color;
      }
    }
  }
  return {
    code: 0,
  };
});

mockjs.mock("/api/tag", "put", (options) => {
  const body = JSON.parse(options.body);
  const id = 1 + data.slice(-1)[0].id;
  data.push({
    id: id,
    title: body.title,
    color: body.color,
    fixed: false,
  });
  return {
    code: 0,
    id: id,
  };
});
