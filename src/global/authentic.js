export class Authentic {
  constructor() {
    this.token = null;
    this.role = "";
    this.id = 0;
  }

  login(token, role, id) {
    this.token = token;
    this.role = role;
    this.id = id;
    window.sessionStorage.setItem("user_token", token);
  }

  /**
   * Whether the login status is valid
   */
  isValid() {
    return (
      this.token !== null &&
      ["student", "teacher", "admin"].indexOf(this.role) != -1
    );
  }

  /**
   * Invalidate the login status
   */
  invalidate() {
    this.token = null;
    this.role = "";
    window.sessionStorage.setItem("user_token", "");
  }

  // If we want the store the login status in the local browser, localStorage can be used.
}
