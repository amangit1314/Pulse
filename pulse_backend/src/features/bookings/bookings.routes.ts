import { Router } from 'express';
import { BookingsController } from './bookings.controller.js';
import { authenticate } from '../../core/middleware/auth.middleware.js';
import { validate } from '../../core/middleware/validation.middleware.js';
import { createBookingSchema, cancelBookingSchema } from './bookings.validation.js';

const router = Router();
const bookingsController = new BookingsController();

// All routes require authentication
router.use(authenticate);

router.post(
    '/',
    validate(createBookingSchema),
    bookingsController.createBooking.bind(bookingsController)
);

router.get('/', bookingsController.getUserBookings.bind(bookingsController));

router.get('/:bookingId', bookingsController.getBooking.bind(bookingsController));

router.post(
    '/:bookingId/confirm',
    bookingsController.confirmBooking.bind(bookingsController)
);

router.post(
    '/:bookingId/cancel',
    validate(cancelBookingSchema),
    bookingsController.cancelBooking.bind(bookingsController)
);

export default router;
