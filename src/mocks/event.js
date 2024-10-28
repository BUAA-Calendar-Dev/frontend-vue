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

// 模拟存储事件的数组
var events = [];

// mock 数据
var data = {
  code: 0,
  specialHours: specialHours, // 添加 specialHours 数据
  events: events, // 添加 events 数据
};

// Mock 获取事件的接口
mockjs.mock("/api/event", "get", data);

// Mock 创建事件的接口
mockjs.mock("/api/event/create", "post", (options) => {
  const body = JSON.parse(options.body);
  const newEvent = {
    start: body.start,
    end: body.end,
    title: body.name,
    content: body.content,
  };
  events.push(newEvent); // 将新事件添加到 events 中

  return {
    code: 0,
    message: "Event created successfully",
    event: newEvent,
  };
});
