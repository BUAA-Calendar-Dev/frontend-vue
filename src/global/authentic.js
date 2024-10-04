export class Authentic {
  constructor() {
    this.token = null;
    this.role = "";
  }

  login(token, role) {
    this.token = token;
    this.role = role;
  }

  /**
   * Whether the login status is valid
   */
  isValid() {
    return this.token !== null && this.role in ["student", "teacher", "admin"];
  }

  /**
   * Invalidate the login status
   */
  invalidate() {
    this.token = null;
    this.role = "";
  }

  // If we want the store the login status in the local browser, localStorage can be used.
}
