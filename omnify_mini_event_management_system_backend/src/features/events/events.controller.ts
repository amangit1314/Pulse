import { Request, Response, NextFunction } from "express";
import { EventsService } from "./events.service.js";
import { ApiResponse } from "../../core/utils/ApiResponse.js";

export class EventsController {
  private eventsService = new EventsService();

  /**
   * Create Event Success:
   * {
    "success": true,
    "message": "Event created successfully",
    "data": {
        "id": "event_EjGLa3",
        "name": "Ultimate Text",
        "slug": "ultimate-text-event_EjGLa3",
        "location": "Mocking Bird, Eminem, USA",
        "latitude": null,
        "longitude": null,
        "maxCapacity": 50,
        "startTime": "2025-09-08T04:45:00.000Z",
        "endTime": "2025-09-08T12:45:00.000Z",
        "createdAt": "2025-09-07T09:32:01.882Z",
        "updatedAt": "2025-09-07T09:32:01.882Z"
    }
} 
   */
  createEvent = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.eventsService.createEvent(req.body);
      res.status(201).json(ApiResponse.success(result.message, result.data));
    } catch (err) {
      next(err);
    }
  };

  /**
   * 
   * Postman success:
   * {
    "success": true,
    "message": "Upcoming events fetched successfully",
    "data": {
        "events": [
            {
                "id": "event_OLWL1E",
                "name": "Mock Interview Package",
                "slug": "mock-interview-package-event_OLWL1E",
                "location": "Mocking Bird, Eminem, USA",
                "latitude": null,
                "longitude": null,
                "maxCapacity": 50,
                "startTime": "2025-09-08T02:45:00.000Z",
                "endTime": "2025-09-08T12:45:00.000Z",
                "createdAt": "2025-09-07T09:10:47.284Z",
                "updatedAt": "2025-09-07T09:10:47.284Z"
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
  getUpcomingEvents = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
      const limit = req.query.limit
        ? parseInt(req.query.limit as string, 10)
        : 10;
      const timezone = req.query.timezone as string | undefined;

      const result = await this.eventsService.getUpcomingEvents(
        timezone,
        page,
        limit
      );

      res.status(200).json(
        ApiResponse.success(result.message, {
          events: result.data,
          pagination: result.pagination,
        })
      );
    } catch (err) {
      next(err);
    }
  };

  registerAttendee = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { event_id } = req.params;
      if (!event_id) {
        return res
          .status(400)
          .json(
            ApiResponse.error("Missing event_id parameter", "EVENT_ID_MISSING")
          );
      }
      const result = await this.eventsService.registerAttendee(
        event_id.toString(),
        req.body
      );
      res.status(201).json(ApiResponse.success(result.message, result.data));
    } catch (err) {
      next(err);
    }
  };

  getEventAttendees = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { page = "1", limit = "10" } = req.query;
      const { event_id } = req.params;
      if (!event_id) {
        return res
          .status(400)
          .json(
            ApiResponse.error("Missing event_id parameter", "EVENT_ID_MISSING")
          );
      }
      const result = await this.eventsService.getEventAttendees(
        event_id,
        Number(page),
        Number(limit)
      );
      res.status(200).json(
        ApiResponse.success(result.message, {
          attendees: result.data,
          pagination: result.pagination,
        })
      );
    } catch (err) {
      next(err);
    }
  };
}
