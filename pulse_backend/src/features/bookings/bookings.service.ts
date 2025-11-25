import { PrismaClient } from '@prisma/client';
import Stripe from 'stripe';
import { env } from '../../core/config/env.config.js';

const prisma = new PrismaClient();
const stripe = env.STRIPE_SECRET_KEY
    ? new Stripe(env.STRIPE_SECRET_KEY, { apiVersion: '2025-02-24.acacia' })
    : null;

export interface CreateBookingData {
    eventId: string;
    userId: string;
    ticketQuantity: number;
    attendeeInfo?: any;
}

export class BookingsService {
    private generateBookingCode(): string {
        return `PULSE-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
    }

    async createBooking(data: CreateBookingData) {
        // Get event details
        const event = await prisma.event.findUnique({
            where: { id: data.eventId },
        });

        if (!event) {
            throw new Error('Event not found');
        }

        // Check event status
        if (event.status !== 'PUBLISHED') {
            throw new Error('Event is not available for booking');
        }

        // Check capacity
        if (event.maxCapacity) {
            const currentBookings = await prisma.booking.count({
                where: {
                    eventId: data.eventId,
                    status: { in: ['PENDING', 'CONFIRMED'] },
                },
            });

            if (currentBookings + data.ticketQuantity > event.maxCapacity) {
                throw new Error('Not enough tickets available');
            }
        }

        // Calculate pricing
        const ticketPrice = event.isFree ? 0 : (event.basePrice || 0);
        const totalAmount = ticketPrice * data.ticketQuantity;

        // Check if it's an affiliate event
        if (event.ticketSource === 'AFFILIATE') {
            // For affiliate events, track the click and return the redirect URL
            await prisma.event.update({
                where: { id: event.id },
                data: { clickCount: { increment: 1 } },
            });

            return {
                isAffiliate: true,
                affiliateUrl: event.affiliateUrl,
                event: {
                    title: event.title,
                    startTime: event.startTime,
                },
            };
        }

        // Create booking
        const booking = await prisma.booking.create({
            data: {
                userId: data.userId,
                eventId: data.eventId,
                ticketQuantity: data.ticketQuantity,
                ticketPrice,
                totalAmount,
                currency: event.currency,
                status: event.isFree ? 'CONFIRMED' : 'PENDING',
                bookingCode: this.generateBookingCode(),
                attendeeInfo: data.attendeeInfo || {},
            },
            include: {
                event: {
                    select: {
                        id: true,
                        title: true,
                        slug: true,
                        startTime: true,
                        endTime: true,
                        coverImage: true,
                        eventType: true,
                        venue: true,
                        city: true,
                        country: true,
                    },
                },
            },
        });

        // If free event, create notification
        if (event.isFree) {
            await prisma.notification.create({
                data: {
                    userId: data.userId,
                    type: 'BOOKING_CONFIRMED',
                    title: 'Booking Confirmed',
                    message: `Your booking for ${event.title} has been confirmed!`,
                    link: `/bookings/${booking.id}`,
                },
            });

            // Award points
            await prisma.reward.create({
                data: {
                    userId: data.userId,
                    type: 'BOOKING',
                    points: 10,
                    description: `Booked: ${event.title}`,
                },
            });

            await prisma.user.update({
                where: { id: data.userId },
                data: { rewardPoints: { increment: 10 } },
            });
        } else if (stripe) {
            // Create Stripe payment intent for paid events
            const paymentIntent = await stripe.paymentIntents.create({
                amount: totalAmount,
                currency: event.currency.toLowerCase(),
                metadata: {
                    bookingId: booking.id,
                    eventId: event.id,
                    userId: data.userId,
                },
            });

            // Create payment record
            await prisma.payment.create({
                data: {
                    amount: totalAmount,
                    currency: event.currency,
                    status: 'PENDING',
                    type: 'BOOKING',
                    stripePaymentId: paymentIntent.id,
                    organizationId: event.organizationId,
                },
            });

            return {
                booking,
                paymentIntent: {
                    clientSecret: paymentIntent.client_secret,
                },
            };
        }

        return { booking };
    }

    async confirmBooking(bookingId: string, paymentId?: string) {
        const booking = await prisma.booking.update({
            where: { id: bookingId },
            data: {
                status: 'CONFIRMED',
                paymentId,
            },
            include: {
                event: true,
                user: true,
            },
        });

        // Create confirmation notification
        await prisma.notification.create({
            data: {
                userId: booking.userId,
                type: 'BOOKING_CONFIRMED',
                title: 'Booking Confirmed',
                message: `Your booking for ${booking.event.title} has been confirmed!`,
                link: `/bookings/${booking.id}`,
            },
        });

        // Award points
        const points = Math.floor(booking.totalAmount / 100); // 1 point per $1
        await prisma.reward.create({
            data: {
                userId: booking.userId,
                type: 'BOOKING',
                points,
                description: `Booked: ${booking.event.title}`,
            },
        });

        await prisma.user.update({
            where: { id: booking.userId },
            data: { rewardPoints: { increment: points } },
        });

        return booking;
    }

    async cancelBooking(bookingId: string, userId: string) {
        const booking = await prisma.booking.findUnique({
            where: { id: bookingId },
            include: { event: true },
        });

        if (!booking) {
            throw new Error('Booking not found');
        }

        if (booking.userId !== userId) {
            throw new Error('Unauthorized');
        }

        if (booking.status === 'CANCELLED' || booking.status === 'REFUNDED') {
            throw new Error('Booking already cancelled');
        }

        // Check if event has already started
        if (new Date() > booking.event.startTime) {
            throw new Error('Cannot cancel booking for past event');
        }

        // Update booking
        await prisma.booking.update({
            where: { id: bookingId },
            data: {
                status: 'CANCELLED',
                cancelledAt: new Date(),
            },
        });

        // Process refund if paid
        if (booking.paymentId && stripe) {
            const payment = await prisma.payment.findUnique({
                where: { id: booking.paymentId },
            });

            if (payment && payment.stripePaymentId) {
                try {
                    await stripe.refunds.create({
                        payment_intent: payment.stripePaymentId,
                    });

                    await prisma.payment.update({
                        where: { id: payment.id },
                        data: { status: 'REFUNDED' },
                    });

                    await prisma.booking.update({
                        where: { id: bookingId },
                        data: { status: 'REFUNDED' },
                    });
                } catch (error) {
                    console.error('Refund error:', error);
                }
            }
        }

        // Create notification
        await prisma.notification.create({
            data: {
                userId,
                type: 'BOOKING_CANCELLED',
                title: 'Booking Cancelled',
                message: `Your booking for ${booking.event.title} has been cancelled.`,
            },
        });

        return { success: true };
    }

    async getBookingById(bookingId: string) {
        const booking = await prisma.booking.findUnique({
            where: { id: bookingId },
            include: {
                event: {
                    include: {
                        organization: {
                            select: {
                                name: true,
                                email: true,
                            },
                        },
                    },
                },
                payment: true,
            },
        });

        if (!booking) {
            throw new Error('Booking not found');
        }

        return booking;
    }

    async getUserBookings(userId: string) {
        const bookings = await prisma.booking.findMany({
            where: { userId },
            include: {
                event: {
                    select: {
                        id: true,
                        title: true,
                        slug: true,
                        coverImage: true,
                        startTime: true,
                        endTime: true,
                        eventType: true,
                        venue: true,
                        city: true,
                        country: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        return bookings;
    }
}
