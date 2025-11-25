import { Request, Response } from 'express';
import { BookingsService } from './bookings.service.js';

const bookingsService = new BookingsService();

export class BookingsController {
    async createBooking(req: Request, res: Response): Promise<void> {
        try {
            if (!req.user) {
                res.status(401).json({
                    success: false,
                    message: 'Unauthorized',
                });
                return;
            }

            const result = await bookingsService.createBooking({
                ...req.body,
                userId: req.user.userId,
            });

            res.status(201).json({
                success: true,
                message: 'Booking created successfully',
                data: result,
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error instanceof Error ? error.message : 'Failed to create booking',
            });
        }
    }

    async confirmBooking(req: Request, res: Response): Promise<void> {
        try {
            const { paymentId } = req.body;
            const booking = await bookingsService.confirmBooking(
                req.params.bookingId,
                paymentId
            );

            res.json({
                success: true,
                message: 'Booking confirmed successfully',
                data: booking,
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error instanceof Error ? error.message : 'Failed to confirm booking',
            });
        }
    }

    async cancelBooking(req: Request, res: Response): Promise<void> {
        try {
            if (!req.user) {
                res.status(401).json({
                    success: false,
                    message: 'Unauthorized',
                });
                return;
            }

            const result = await bookingsService.cancelBooking(
                req.params.bookingId,
                req.user.userId
            );

            res.json({
                success: true,
                message: 'Booking cancelled successfully',
                data: result,
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error instanceof Error ? error.message : 'Failed to cancel booking',
            });
        }
    }

    async getBooking(req: Request, res: Response): Promise<void> {
        try {
            const booking = await bookingsService.getBookingById(req.params.bookingId);

            res.json({
                success: true,
                data: booking,
            });
        } catch (error) {
            res.status(404).json({
                success: false,
                message: error instanceof Error ? error.message : 'Booking not found',
            });
        }
    }

    async getUserBookings(req: Request, res: Response): Promise<void> {
        try {
            if (!req.user) {
                res.status(401).json({
                    success: false,
                    message: 'Unauthorized',
                });
                return;
            }

            const bookings = await bookingsService.getUserBookings(req.user.userId);

            res.json({
                success: true,
                data: bookings,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : 'Failed to fetch bookings',
            });
        }
    }
}
