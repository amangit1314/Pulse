// src/features/events/events.service.ts

import { prisma } from "../../core/config/prisma.js";
import { ErrorCodes } from "../../core/constants/errorCodes.js";
import { Messages } from "../../core/constants/messages.js";
import { DateUtils } from "../../core/utils/DateUtils.js";
import { IdGenerator } from "../../core/utils/IdGenerator.js";
import { Event } from "@prisma/client";

interface CreateEventDto {
  name: string;
  location: string;
  latitude?: string;
  longitude?: string;
  startTime: string;
  endTime: string;
  timezone: string;
  maxCapacity: number;
}

export class EventsService {
  async createEvent(dto: CreateEventDto) {
    const startUTC = new Date(dto.startTime);
    const endUTC = new Date(dto.endTime);

    if (!DateUtils.isFutureDate(startUTC)) {
      throw {
        statusCode: 400,
        message: Messages.EVENTS.START_IN_FUTURE,
        code: ErrorCodes.GENERAL.VALIDATION,
      };
    }

    if (endUTC <= startUTC) {
      throw {
        statusCode: 400,
        message: Messages.EVENTS.END_AFTER_START,
        code: ErrorCodes.GENERAL.VALIDATION,
      };
    }

    const eventId = IdGenerator.generateEventId();

    const event = await prisma.event.create({
      data: {
        id: eventId,
        name: dto.name,
        slug: dto.name.toLowerCase().replace(/\s+/g, "-") + "-" + eventId,
        location: dto.location,
        latitude: dto.latitude,
        longitude: dto.longitude,
        startTime: startUTC,
        endTime: endUTC,
        maxCapacity: dto.maxCapacity,
      },
    });

    return { message: Messages.EVENTS.CREATED, data: event };
  }

  // async getUpcomingEvents(timezone?: string) {
  //   const now = new Date();

  //   const events = await prisma.event.findMany({
  //     where: {
  //       startTime: { gt: now },
  //     },
  //     orderBy: { startTime: "asc" },
  //   });

  //   // Convert to requested timezone if provided
  //   const converted = events.map((event: Event) => ({
  //     ...event,
  //     startTime: timezone
  //       ? DateUtils.toTimezone(event.startTime, timezone)
  //       : event.startTime,
  //     endTime: timezone
  //       ? DateUtils.toTimezone(event.endTime, timezone)
  //       : event.endTime,
  //   }));

  //   return { message: Messages.EVENTS.LIST, data: converted };
  // }
  async getUpcomingEvents(timezone?: string, page = 1, limit = 10) {
    const now = new Date();

    const [events, total] = await Promise.all([
      prisma.event.findMany({
        where: { startTime: { gt: now } },
        orderBy: { startTime: "asc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.event.count({
        where: { startTime: { gt: now } },
      }),
    ]);

    // Convert to requested timezone if provided
    const converted = events.map((event: Event) => ({
      ...event,
      startTime: timezone
        ? DateUtils.toTimezone(event.startTime, timezone)
        : event.startTime,
      endTime: timezone
        ? DateUtils.toTimezone(event.endTime, timezone)
        : event.endTime,
    }));

    return {
      message: Messages.EVENTS.LIST,
      data: converted,
      pagination: { page, limit, total },
    };
  }

  /**
   * 
   * postman success response:
   * {
    "success": true,
    "message": "Attendee registered successfully",
    "data": {
        "id": "event_OLWL1E_attendee_5wBPrb",
        "name": "james",
        "email": "james@gmail.com",
        "eventId": "event_OLWL1E"
    }
}
   */
  async registerAttendee(
    eventId: string,
    attendee: { name: string; email: string }
  ) {
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: { attendees: true },
    });

    if (!event) {
      throw {
        statusCode: 404,
        message: Messages.EVENTS.NOT_FOUND,
        code: ErrorCodes.EVENT.NOT_FOUND,
      };
    }

    if (event.attendees.length >= event.maxCapacity) {
      throw {
        statusCode: 400,
        message: Messages.EVENTS.FULL,
        code: ErrorCodes.EVENT.FULL,
      };
    }

    interface Attendee {
      id: string;
      name: string;
      email: string;
      eventId: string;
    }

    interface EventWithAttendees {
      id: string;
      name: string;
      slug: string;
      location: string;
      latitude?: string;
      longitude?: string;
      startTime: Date;
      endTime: Date;
      maxCapacity: number;
      attendees: Attendee[];
    }

    const alreadyRegistered: boolean = (
      event as EventWithAttendees
    ).attendees.some(
      (a: Attendee) => a.email.toLowerCase() === attendee.email.toLowerCase()
    );
    if (alreadyRegistered) {
      throw {
        statusCode: 400,
        message: Messages.REGISTRATION.DUPLICATE,
        code: ErrorCodes.REGISTRATION.DUPLICATE,
      };
    }

    const attendeeId = IdGenerator.generateAttendeeId(eventId);

    const newRegistration = await prisma.attendee.create({
      data: {
        id: attendeeId,
        name: attendee.name,
        email: attendee.email,
        eventId: eventId,
      },
    });

    return { message: Messages.REGISTRATION.SUCCESS, data: newRegistration };
  }

  /**
   * 
   * postman response: {
    "success": true,
    "message": "Event attendees fetched successfully",
    "data": {
        "attendees": [
            {
                "id": "event_OLWL1E_attendee_5wBPrb",
                "name": "james",
                "email": "james@gmail.com",
                "eventId": "event_OLWL1E"
            }
        ],
        "pagination": {
            "page": 1,
            "limit": 10,
            "total": 1
        }
    }
}
   */
  async getEventAttendees(eventId: string, page = 1, limit = 10) {
    const event = await prisma.event.findUnique({ where: { id: eventId } });

    if (!event) {
      throw {
        statusCode: 404,
        message: Messages.EVENTS.NOT_FOUND,
        code: ErrorCodes.EVENT.NOT_FOUND,
      };
    }

    const [attendees, total] = await Promise.all([
      prisma.attendee.findMany({
        where: { eventId },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { name: "asc" },
      }),
      prisma.attendee.count({ where: { eventId } }),
    ]);

    return {
      message: Messages.ATTENDEES.LIST,
      data: attendees,
      pagination: { page, limit, total },
    };
  }
}
