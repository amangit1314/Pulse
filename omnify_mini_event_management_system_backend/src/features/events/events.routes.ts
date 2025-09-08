import { Router } from "express";
import { EventsController } from "./events.controller.js";

const router = Router();
const eventsController = new EventsController();

/**
 * @swagger
 * /events:
 *   post:
 *     summary: Create a new event
 *     description: Creates a new event with timezone handling. Times are converted to UTC for storage.
 *     tags: [Events]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateEvent'
 *     responses:
 *       201:
 *         description: Event created successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Event'
 *       400:
 *         description: Invalid input data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post("/", eventsController.createEvent);

/**
 * @swagger
 * /events:
 *   get:
 *     summary: Get all upcoming events
 *     description: Retrieve all upcoming events with optional timezone conversion
 *     tags: [Events]
 *     parameters:
 *       - $ref: '#/components/parameters/Timezone'
 *     responses:
 *       200:
 *         description: List of upcoming events
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Event'
 */
router.get("/", eventsController.getUpcomingEvents);

/**
 * @swagger
 * /events/{event_id}/register:
 *   post:
 *     summary: Register attendee for an event
 *     description: Register a new attendee for an event with capacity and duplicate checks
 *     tags: [Registrations]
 *     parameters:
 *       - $ref: '#/components/parameters/EventId'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterAttendee'
 *     responses:
 *       201:
 *         description: Successfully registered
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Registration'
 *       400:
 *         description: Event is full or email already registered
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               event_full:
 *                 value:
 *                   success: false
 *                   message: "Event is full"
 *                   code: "EVENT_002"
 *               duplicate_email:
 *                 value:
 *                   success: false
 *                   message: "Email already registered for this event"
 *                   code: "REG_001"
 *       404:
 *         description: Event not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post("/:event_id/register", eventsController.registerAttendee);

/**
 * @swagger
 * /events/{event_id}/attendees:
 *   get:
 *     summary: Get event attendees
 *     description: Get paginated list of attendees for a specific event
 *     tags: [Attendees]
 *     parameters:
 *       - $ref: '#/components/parameters/EventId'
 *       - $ref: '#/components/parameters/Page'
 *       - $ref: '#/components/parameters/Limit'
 *     responses:
 *       200:
 *         description: Paginated list of attendees
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/PaginatedResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Registration'
 *       404:
 *         description: Event not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/:event_id/attendees", eventsController.getEventAttendees);

export default router;
