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
