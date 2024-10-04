import { Authentic } from "./authentic";

export default new (class {
  constructor() {
    this.auth = new Authentic();
  }
})();
