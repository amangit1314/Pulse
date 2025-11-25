import { z } from 'zod';

export const createBookingSchema = z.object({
    body: z.object({
        eventId: z.string().min(1, 'Event ID is required'),
        ticketQuantity: z.number().min(1, 'At least one ticket required').max(10),
        attendeeInfo: z.object({
            name: z.string().min(1),
            email: z.string().email(),
            phone: z.string().optional(),
        }).optional(),
    }),
});

export const cancelBookingSchema = z.object({
    body: z.object({
        reason: z.string().optional(),
    }),
});
