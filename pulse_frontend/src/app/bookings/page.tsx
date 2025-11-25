'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, MapPin, Ticket, DollarSign, Clock, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/stores/auth.store';
import axios from '@/lib/axios';
import toast from 'react-hot-toast';

export default function BookingsPage() {
    const router = useRouter();
    const { isAuthenticated } = useAuthStore();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login?redirect=/bookings');
            return;
        }
        loadBookings();
    }, [isAuthenticated]);

    const loadBookings = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/users/bookings');
            setBookings(response.data.data);
        } catch (error) {
            toast.error('Failed to load bookings');
        } finally {
            setLoading(false);
        }
    };

    const handleCancelBooking = async (bookingId: string) => {
        if (!confirm('Are you sure you want to cancel this booking?')) return;

        try {
            await axios.post(`/bookings/${bookingId}/cancel`);
            toast.success('Booking cancelled successfully');
            loadBookings();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to cancel booking');
        }
    };

    const upcomingBookings = bookings.filter(
        (b: any) => new Date(b.event.startTime) > new Date() && b.status !== 'CANCELLED'
    );
    const pastBookings = bookings.filter(
        (b: any) => new Date(b.event.startTime) <= new Date() || b.status === 'CANCELLED'
    );

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <div className="gradient-primary py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-4xl font-bold text-white mb-2">My Bookings</h1>
                    <p className="text-white/90">Manage your event bookings</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {loading ? (
                    <div className="text-center py-20">Loading...</div>
                ) : bookings.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="text-6xl mb-4">🎫</div>
                        <h3 className="text-2xl font-bold mb-2">No bookings yet</h3>
                        <p className="text-muted-foreground mb-6">
                            Start exploring events and book your first experience
                        </p>
                        <Button
                            onClick={() => router.push('/events')}
                            className="gradient-primary text-white"
                        >
                            Browse Events
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-12">
                        {/* Upcoming Bookings */}
                        {upcomingBookings.length > 0 && (
                            <section>
                                <h2 className="text-2xl font-bold mb-6">Upcoming Events</h2>
                                <div className="grid gap-6">
                                    {upcomingBookings.map((booking: any) => (
                                        <BookingCard
                                            key={booking.id}
                                            booking={booking}
                                            onCancel={handleCancelBooking}
                                            isUpcoming
                                        />
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Past Bookings */}
                        {pastBookings.length > 0 && (
                            <section>
                                <h2 className="text-2xl font-bold mb-6">Past Events</h2>
                                <div className="grid gap-6">
                                    {pastBookings.map((booking: any) => (
                                        <BookingCard key={booking.id} booking={booking} isUpcoming={false} />
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

function BookingCard({
    booking,
    onCancel,
    isUpcoming,
}: {
    booking: any;
    onCancel?: (id: string) => void;
    isUpcoming: boolean;
}) {
    const router = useRouter();
    const eventDate = new Date(booking.event.startTime);
    const formattedDate = eventDate.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
    });
    const formattedTime = eventDate.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
    });

    const statusColors = {
        PENDING: 'text-yellow-500',
        CONFIRMED: 'text-green-500',
        CANCELLED: 'text-red-500',
        REFUNDED: 'text-blue-500',
    };

    return (
        <div className="glass rounded-xl p-6 hover-lift">
            <div className="flex flex-col sm:flex-row gap-6">
                {/* Event Image */}
                <div
                    className="w-full sm:w-48 h-32 rounded-lg bg-gradient-accent overflow-hidden cursor-pointer"
                    onClick={() => router.push(`/events/${booking.event.slug}`)}
                >
                    {booking.event.coverImage ? (
                        <img
                            src={booking.event.coverImage}
                            alt={booking.event.title}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-4xl">
                            🎉
                        </div>
                    )}
                </div>

                {/* Booking Info */}
                <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between">
                        <div>
                            <h3
                                className="font-bold text-xl mb-1 cursor-pointer hover:text-primary transition-colors"
                                onClick={() => router.push(`/events/${booking.event.slug}`)}
                            >
                                {booking.event.title}
                            </h3>
                            <p className={`text-sm font-medium ${statusColors[booking.status as keyof typeof statusColors]}`}>
                                {booking.status}
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-muted-foreground">Booking Code</p>
                            <p className="font-mono font-bold">{booking.bookingCode}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Calendar className="w-4 h-4" />
                            <span>
                                {formattedDate} • {formattedTime}
                            </span>
                        </div>

                        {booking.event.city && (
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <MapPin className="w-4 h-4" />
                                <span>
                                    {booking.event.city}, {booking.event.country}
                                </span>
                            </div>
                        )}

                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Ticket className="w-4 h-4" />
                            <span>{booking.ticketQuantity} Ticket(s)</span>
                        </div>

                        <div className="flex items-center gap-2 text-muted-foreground">
                            <DollarSign className="w-4 h-4" />
                            <span>
                                {booking.totalAmount === 0
                                    ? 'FREE'
                                    : `$${(booking.totalAmount / 100).toFixed(2)}`}
                            </span>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-3 pt-3">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => router.push(`/events/${booking.event.slug}`)}
                            className="glass"
                        >
                            <ExternalLink className="w-4 h-4 mr-2" />
                            View Event
                        </Button>

                        {isUpcoming && booking.status === 'CONFIRMED' && (
                            <>
                                {booking.event.eventType !== 'IN_PERSON' && (
                                    <Button size="sm" className="gradient-accent text-white">
                                        Join Event
                                    </Button>
                                )}
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => onCancel?.(booking.id)}
                                >
                                    Cancel Booking
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
