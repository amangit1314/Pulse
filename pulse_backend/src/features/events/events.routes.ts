import { Router } from 'express';
import { EventsController } from './events.controller.js';
import { authenticate, optionalAuth, authorize } from '../../core/middleware/auth.middleware.js';
import { validate } from '../../core/middleware/validation.middleware.js';
import {
    createEventSchema,
    updateEventSchema,
    searchEventsSchema,
} from './events.validation.js';

const router = Router();
const eventsController = new EventsController();

// Public routes
router.get('/search', validate(searchEventsSchema), eventsController.searchEvents.bind(eventsController));
router.get('/featured', eventsController.getFeaturedEvents.bind(eventsController));
router.get('/trending', eventsController.getTrendingEvents.bind(eventsController));
router.get('/slug/:slug', optionalAuth, eventsController.getEventBySlug.bind(eventsController));
router.get('/:eventId', optionalAuth, eventsController.getEvent.bind(eventsController));

// Protected routes (require authentication)
router.post(
    '/',
    authenticate,
    authorize('ORGANIZER', 'ADMIN'),
    validate(createEventSchema),
    eventsController.createEvent.bind(eventsController)
);

router.put(
    '/:eventId',
    authenticate,
    authorize('ORGANIZER', 'ADMIN'),
    validate(updateEventSchema),
    eventsController.updateEvent.bind(eventsController)
);

router.delete(
    '/:eventId',
    authenticate,
    authorize('ORGANIZER', 'ADMIN'),
    eventsController.deleteEvent.bind(eventsController)
);

export default router;
