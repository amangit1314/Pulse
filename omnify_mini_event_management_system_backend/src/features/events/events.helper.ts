import { ErrorCodes } from "../../core/constants/errorCodes.js";
import { Messages } from "../../core/constants/messages.js";

export class EventHelper {
  static checkCapacity(event: { attendees: any[]; max_capacity: number }) {
    if (event.attendees.length >= event.max_capacity) {
      throw {
        statusCode: 400,
        message: Messages.EVENTS.FULL,
        code: ErrorCodes.EVENT.FULL,
      };
    }
  }

  static checkDuplicate(
    event: { attendees: { email: string }[] },
    email: string
  ) {
    if (event.attendees.some((a) => a.email === email)) {
      throw {
        statusCode: 400,
        message: Messages.REGISTRATION.DUPLICATE,
        code: ErrorCodes.REGISTRATION.DUPLICATE,
      };
    }
  }
}
