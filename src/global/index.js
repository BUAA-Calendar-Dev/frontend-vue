import { Authentic } from "./authentic";

export default new (class {
  constructor() {
    this.auth = new Authentic();

    this.timeFormatter = "YYYY 年 MM 月 DD 日 HH:mm:ss";
  }
})();
