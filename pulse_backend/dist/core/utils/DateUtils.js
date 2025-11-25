import moment from "moment-timezone";
export class DateUtils {
    static toUTC(date, timezone) {
        return moment.tz(date, timezone).utc().toDate();
    }
    static toUTCFromNormal(date, timezone) {
        return moment.tz(date, "DD-MM-YYYY, hh:mm A", timezone).utc().toDate();
    }
    static isFutureDate(date) {
        const now = moment.utc();
        const target = moment.utc(date);
        // Allow any future date-time (even if same day but later time)
        return target.isAfter(now);
    }
    static toTimezone(date, timezone) {
        return moment(date).tz(timezone).format(); // ISO string in given tz
    }
}
