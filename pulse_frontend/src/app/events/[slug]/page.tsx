'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    Calendar, MapPin, Clock, Users, Heart, Share2,
    Ticket, ExternalLink, Video, Building, Star, Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { eventsService } from '@/services/events.service';
import { useAuthStore } from '@/stores/auth.store';
import toast from 'react-hot-toast';
import axios from '@/lib/axios';

export default function EventDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { isAuthenticated, user } = useAuthStore();

    const [event, setEvent] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [bookingData, setBookingData] = useState({
        ticketQuantity: 1,
        attendeeInfo: {
            name: user?.name || '',
            email: user?.email || '',
            phone: '',
        },
    });
    const [bookingLoading, setBookingLoading] = useState(false);

    useEffect(() => {
        loadEvent();
    }, [params.slug]);

    const loadEvent = async () => {
        try {
            setLoading(true);
            const data = await eventsService.getEventBySlug(params.slug as string);
            setEvent(data);
        } catch (error) {
            toast.error('Event not found');
            router.push('/events');
        } finally {
            setLoading(false);
        }
    };

    const handleBookNow = () => {
        if (!isAuthenticated) {
            toast.error('Please login to book');
            router.push(`/login?redirect=/events/${params.slug}`);
            return;
        }

        // If affiliate event, redirect immediately
        if (event.ticketSource === 'AFFILIATE' && event.affiliateUrl) {
            window.open(event.affiliateUrl, '_blank');
            // Track the click
            axios.post(`/bookings`, {
                eventId: event.id,
                ticketQuantity: 1,
            }).catch(() => { });
            return;
        }

        setShowBookingModal(true);
    };

    const handleBooking = async () => {
        try {
            setBookingLoading(true);
            const response = await axios.post('/bookings', {
                eventId: event.id,
                ...bookingData,
            });

            const result = response.data.data;

            // Handle affiliate redirect
            if (result.isAffiliate) {
                window.open(result.affiliateUrl, '_blank');
                toast.success('Redirecting to ticket provider...');
                setShowBookingModal(false);
                return;
            }

            // Handle payment intent (Stripe)
            if (result.paymentIntent) {
                // In a real app, you'd integrate Stripe Elements here
                toast.success('Redirecting to payment...');
                // For now, just show success
                setShowBookingModal(false);
                router.push('/bookings');
                return;
            }

            // Free event - booking confirmed
            if (result.booking) {
                toast.success('🎉 Booking confirmed!');
                setShowBookingModal(false);
                router.push('/bookings');
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Booking failed');
        } finally {
            setBookingLoading(false);
        }
    };

    const toggleWishlist = async () => {
        if (!isAuthenticated) {
            toast.error('Please login first');
            return;
        }

        try {
            if (event.isInWishlist) {
                await axios.delete(`/users/wishlist/${event.id}`);
                toast.success('Removed from wishlist');
            } else {
                await axios.post('/users/wishlist', { eventId: event.id });
                toast.success('Added to wishlist');
            }
            setEvent({ ...event, isInWishlist: !event.isInWishlist });
        } catch (error) {
            toast.error('Failed to update wishlist');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!event) return null;

    const eventDate = new Date(event.startTime);
    const formattedDate = eventDate.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
    });
    const formattedTime = eventDate.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
    });

    return (
        <>
            <div className="min-h-screen bg-background">
                {/* Hero Image */}
                <div className="relative h-96 bg-gradient-primary overflow-hidden">
                    {event.coverImage ? (
                        <>
                            <img
                                src={event.coverImage}
                                alt={event.title}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                        </>
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-9xl">
                            🎉
                        </div>
                    )}

                    {/* Event Type Badge */}
                    <div className="absolute top-6 right-6">
                        <span className="glass-strong px-4 py-2 rounded-full text-sm font-medium">
                            {event.eventType === 'VIRTUAL' && '🎥 Virtual Event'}
                            {event.eventType === 'IN_PERSON' && '📍 In-Person Event'}
                            {event.eventType === 'HYBRID' && '🌐 Hybrid Event'}
                        </span>
                    </div>

                    {/* Floating Actions */}
                    <div className="absolute top-6 left-6 flex gap-2">
                        <Button
                            size="icon"
                            variant="outline"
                            className="glass-strong hover-lift"
                            onClick={toggleWishlist}
                        >
                            <Heart
                                className={`w-5 h-5 ${event.isInWishlist ? 'fill-red-500 text-red-500' : ''}`}
                            />
                        </Button>
                        <Button size="icon" variant="outline" className="glass-strong hover-lift">
                            <Share2 className="w-5 h-5" />
                        </Button>
                    </div>
                </div>

                {/* Content */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Title Card */}
                            <div className="glass-strong rounded-2xl p-8 animate-fade-in-up">
                                <h1 className="text-4xl font-bold mb-4">{event.title}</h1>

                                {event.organization && (
                                    <Link
                                        href={`/organizations/${event.organization.slug}`}
                                        className="flex items-center gap-3 mb-6 hover:opacity-80 transition-opacity w-fit"
                                    >
                                        {event.organization.logo ? (
                                            <img
                                                src={event.organization.logo}
                                                alt={event.organization.name}
                                                className="w-12 h-12 rounded-full"
                                            />
                                        ) : (
                                            <div className="w-12 h-12 rounded-full gradient-accent flex items-center justify-center">
                                                <Building className="w-6 h-6 text-white" />
                                            </div>
                                        )}
                                        <div>
                                            <p className="text-sm text-muted-foreground">Organized by</p>
                                            <p className="font-semibold">{event.organization.name}</p>
                                        </div>
                                    </Link>
                                )}

                                {/* Quick Info */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="flex items-start gap-3">
                                        <Calendar className="w-5 h-5 text-primary mt-1" />
                                        <div>
                                            <p className="font-medium">{formattedDate}</p>
                                            <p className="text-sm text-muted-foreground">{formattedTime}</p>
                                        </div>
                                    </div>

                                    {event.eventType !== 'VIRTUAL' && event.venue && (
                                        <div className="flex items-start gap-3">
                                            <MapPin className="w-5 h-5 text-primary mt-1" />
                                            <div>
                                                <p className="font-medium">{event.venue}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    {event.city}, {event.country}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {event.eventType !== 'IN_PERSON' && (
                                        <div className="flex items-start gap-3">
                                            <Video className="w-5 h-5 text-primary mt-1" />
                                            <div>
                                                <p className="font-medium">Online Event</p>
                                                <p className="text-sm text-muted-foreground">
                                                    Link provided after registration
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {event.maxCapacity && (
                                        <div className="flex items-start gap-3">
                                            <Users className="w-5 h-5 text-primary mt-1" />
                                            <div>
                                                <p className="font-medium">
                                                    {event._count?.bookings || 0} / {event.maxCapacity}
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    {event.maxCapacity - (event._count?.bookings || 0)} spots left
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Description */}
                            <div className="glass-strong rounded-2xl p-8 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                                <h2 className="text-2xl font-bold mb-4">About This Event</h2>
                                <div className="prose prose-invert max-w-none">
                                    <p className="text-muted-foreground whitespace-pre-wrap">
                                        {event.description}
                                    </p>
                                </div>

                                {event.tags && event.tags.length > 0 && (
                                    <div className="mt-6 flex flex-wrap gap-2">
                                        {event.tags.map((tag: string) => (
                                            <span key={tag} className="glass px-3 py-1 rounded-full text-sm">
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Reviews */}
                            {event.reviews && event.reviews.length > 0 && (
                                <div className="glass-strong rounded-2xl p-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                                    <h2 className="text-2xl font-bold mb-6">Reviews</h2>
                                    <div className="space-y-4">
                                        {event.reviews.slice(0, 3).map((review: any) => (
                                            <div key={review.id} className="glass p-4 rounded-xl">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <div className="w-10 h-10 rounded-full gradient-accent flex items-center justify-center text-white font-bold">
                                                        {review.user.name[0]}
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="font-medium">{review.user.name}</p>
                                                        <div className="flex items-center gap-1">
                                                            {Array.from({ length: 5 }).map((_, i) => (
                                                                <Star
                                                                    key={i}
                                                                    className={`w-4 h-4 ${i < review.rating ? 'fill-yellow-500 text-yellow-500' : 'text-gray-600'
                                                                        }`}
                                                                />
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                                <p className="text-sm text-muted-foreground">{review.comment}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Sidebar - Booking Card */}
                        <div className="lg:col-span-1">
                            <div className="glass-strong rounded-2xl p-6 sticky top-20 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                                {event.isFree ? (
                                    <div className="text-center mb-6">
                                        <p className="text-4xl font-bold gradient-accent text-gradient-accent">FREE</p>
                                        <p className="text-sm text-muted-foreground mt-1">No ticket required</p>
                                    </div>
                                ) : (
                                    <div className="text-center mb-6">
                                        <p className="text-sm text-muted-foreground">Starting from</p>
                                        <p className="text-4xl font-bold text-primary">
                                            ${((event.basePrice || 0) / 100).toFixed(2)}
                                        </p>
                                        <p className="text-sm text-muted-foreground">{event.currency}</p>
                                    </div>
                                )}

                                <Button
                                    onClick={handleBookNow}
                                    className="w-full gradient-primary text-white hover:opacity-90 text-lg py-6 mb-4"
                                    disabled={event.status !== 'PUBLISHED'}
                                >
                                    {event.ticketSource === 'AFFILIATE' ? (
                                        <>
                                            <ExternalLink className="w-5 h-5 mr-2" />
                                            Get Tickets
                                        </>
                                    ) : (
                                        <>
                                            <Ticket className="w-5 h-5 mr-2" />
                                            Book Now
                                        </>
                                    )}
                                </Button>

                                {event.ticketSource === 'AFFILIATE' && (
                                    <p className="text-xs text-center text-muted-foreground mb-4">
                                        Tickets provided by external partner
                                    </p>
                                )}

                                <div className="space-y-3 text-sm">
                                    <div className="flex items-center justify-between py-2 border-t border-border">
                                        <span className="text-muted-foreground">Event Status</span>
                                        <span className="font-medium capitalize">{event.status.toLowerCase()}</span>
                                    </div>
                                    <div className="flex items-center justify-between py-2 border-t border-border">
                                        <span className="text-muted-foreground">Views</span>
                                        <span className="font-medium">{event.viewCount || 0}</span>
                                    </div>
                                    {event._count?.bookings > 0 && (
                                        <div className="flex items-center justify-between py-2 border-t border-border">
                                            <span className="text-muted-foreground">Attendees</span>
                                            <span className="font-medium">{event._count.bookings}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Booking Modal */}
            <Dialog open={showBookingModal} onOpenChange={setShowBookingModal}>
                <DialogContent className="glass-strong">
                    <DialogHeader>
                        <DialogTitle>Book Your Spot</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4">
                        <div>
                            <Label>Number of Tickets</Label>
                            <Input
                                type="number"
                                min={1}
                                max={10}
                                value={bookingData.ticketQuantity}
                                onChange={(e) =>
                                    setBookingData({
                                        ...bookingData,
                                        ticketQuantity: parseInt(e.target.value) || 1,
                                    })
                                }
                                className="bg-background"
                            />
                        </div>

                        <div>
                            <Label>Full Name</Label>
                            <Input
                                type="text"
                                value={bookingData.attendeeInfo.name}
                                onChange={(e) =>
                                    setBookingData({
                                        ...bookingData,
                                        attendeeInfo: { ...bookingData.attendeeInfo, name: e.target.value },
                                    })
                                }
                                className="bg-background"
                            />
                        </div>

                        <div>
                            <Label>Email</Label>
                            <Input
                                type="email"
                                value={bookingData.attendeeInfo.email}
                                onChange={(e) =>
                                    setBookingData({
                                        ...bookingData,
                                        attendeeInfo: { ...bookingData.attendeeInfo, email: e.target.value },
                                    })
                                }
                                className="bg-background"
                            />
                        </div>

                        <div>
                            <Label>Phone (Optional)</Label>
                            <Input
                                type="tel"
                                value={bookingData.attendeeInfo.phone}
                                onChange={(e) =>
                                    setBookingData({
                                        ...bookingData,
                                        attendeeInfo: { ...bookingData.attendeeInfo, phone: e.target.value },
                                    })
                                }
                                className="bg-background"
                            />
                        </div>

                        {!event.isFree && (
                            <div className="glass p-4 rounded-xl">
                                <div className="flex items-center justify-between mb-2">
                                    <span>Tickets ({bookingData.ticketQuantity}x)</span>
                                    <span>${((event.basePrice * bookingData.ticketQuantity) / 100).toFixed(2)}</span>
                                </div>
                                <div className="flex items-center justify-between font-bold text-lg pt-2 border-t border-border">
                                    <span>Total</span>
                                    <span className="text-primary">
                                        ${((event.basePrice * bookingData.ticketQuantity) / 100).toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        )}

                        <Button
                            onClick={handleBooking}
                            disabled={bookingLoading}
                            className="w-full gradient-primary text-white"
                        >
                            {bookingLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Processing...
                                </>
                            ) : event.isFree ? (
                                'Confirm Booking'
                            ) : (
                                'Proceed to Payment'
                            )}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
