export class IdGenerator {
  private static generateRandomString(length = 6): string {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  static generateEventId(): string {
    return `event_${this.generateRandomString(6)}`;
  }

  static generateAttendeeId(eventId: string): string {
    // remove leading "event_" if present
    const cleanEventId = eventId.startsWith("event_")
      ? eventId.substring(6)
      : eventId;

    return `event_${cleanEventId}_attendee_${this.generateRandomString(6)}`;
  }
}
