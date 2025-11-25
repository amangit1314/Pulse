import moment from "moment-timezone";

export class DateUtils {
  static toUTC(date: string, timezone: string): Date {
    return moment.tz(date, timezone).utc().toDate();
  }

  static toUTCFromNormal(date: string, timezone: string): Date {
    return moment.tz(date, "DD-MM-YYYY, hh:mm A", timezone).utc().toDate();
  }

  static isFutureDate(date: Date): boolean {
    const now = moment.utc();
    const target = moment.utc(date);

    // Allow any future date-time (even if same day but later time)
    return target.isAfter(now);
  }

  static toTimezone(date: Date, timezone: string): string {
    return moment(date).tz(timezone).format(); // ISO string in given tz
  }
}
