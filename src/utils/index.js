import { formatTimestamp } from "@/utils/datetime";

export default new (class {
  constructor() {
    /**
     * Format the timestamp into a string.
     *
     * @param timestamp The timestamp in seconds
     * @param formatter The format string setting by the user
     * @returns The formatted string
     */
    this.formatTimestamp = formatTimestamp;
  }
})();
