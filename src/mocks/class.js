import mockjs from "mockjs";

// eslint-disable-next-line no-unused-vars
mockjs.mock("/api/class", "post", (options) => {
  return {
    code: 0,
    class: [
      {
        id: 1,
        name: "Class-1",
        count: 10,
        teacher: ["Alice", "Kate"],
      },
      {
        id: 2,
        name: "Class-2",
        count: 15,
        teacher: ["Alice"],
      },
      {
        id: 3,
        name: "Class-3",
        count: 20,
        teacher: ["Alice"],
      },
    ],
  };
});
