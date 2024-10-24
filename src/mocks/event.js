import mockjs from "mockjs";

// 定义 specialHours 数据
var specialHours = {
  1: {
    from: 8 * 60,
    to: 17 * 60,
    class: "doctor-1",
    label: "Doctor 1 Full day shift",
  },
  2: {
    from: 9 * 60,
    to: 18 * 60,
    class: "doctor-2",
    label: "Doctor 2 Full day shift",
  },
};

// 将 specialHours 放入 mock 数据
var data = {
  code: 0,
  specialHours: specialHours, // 添加 specialHours 数据
};

mockjs.mock("/api/event", "get", data);
