export class Authentic {
  constructor() {
    this.token = null;
    this.role = "";
    this.id = 0;
    this.restoreLoginStatus();
  }

  login(token, role, id) {
    this.token = token;
    this.role = role;
    this.id = id;
    this.saveToLocalStorage();
  }

  /**
   * 保存登录信息到 localStorage
   * @private
   */
  saveToLocalStorage() {
    const loginInfo = {
      token: this.token,
      role: this.role,
      id: this.id,
    };
    localStorage.setItem("loginInfo", JSON.stringify(loginInfo));
  }

  /**
   * 从 localStorage 恢复登录状态
   * @private
   */
  restoreLoginStatus() {
    try {
      const loginInfoStr = localStorage.getItem("loginInfo");
      if (loginInfoStr) {
        const loginInfo = JSON.parse(loginInfoStr);
        this.token = loginInfo.token;
        this.role = loginInfo.role;
        this.id = loginInfo.id;
      }
    } catch (error) {
      console.error("恢复登录状态失败:", error);
      this.invalidate();
    }
  }

  /**
   * 判断登录状态是否有效
   */
  isValid() {
    return (
      this.token !== null &&
      ["student", "teacher", "admin"].indexOf(this.role) !== -1
    );
  }

  /**
   * 使登录状态失效
   */
  invalidate() {
    this.token = null;
    this.role = "";
    this.id = 0;
    localStorage.removeItem("loginInfo");
  }
}
