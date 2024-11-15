import { formatTimestamp } from "@/utils/datetime";
import { popupMessage, handleHttpException } from "@/utils/popup";

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

    /**
     * Popup messages.
     *
     * @param type The message type: 'success' | 'warning' | 'info' | 'error'
     * @param title The message title
     * @param content The message body
     * @param duration The display time, default 3000
     */
    this.popupMessage = popupMessage;

    /**
     * Show the http failure message.
     *
     * @param error The error from the `.catch`
     */
    this.handleHttpException = handleHttpException;
  }
})();
