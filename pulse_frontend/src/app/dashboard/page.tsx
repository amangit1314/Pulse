'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    BarChart3, Calendar, Users, DollarSign, TrendingUp,
    Plus, Settings, Crown, Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/stores/auth.store';
import axios from '@/lib/axios';
import toast from 'react-hot-toast';

export default function DashboardPage() {
    const router = useRouter();
    const { isAuthenticated, user } = useAuthStore();
    const [organization, setOrganization] = useState<any>(null);
    const [analytics, setAnalytics] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login?redirect=/dashboard');
            return;
        }
        if (user?.role !== 'ORGANIZER' && user?.role !== 'ADMIN') {
            toast.error('Access denied. Organizers only.');
            router.push('/');
            return;
        }
        loadDashboard();
    }, [isAuthenticated, user]);

    const loadDashboard = async () => {
        try {
            setLoading(true);
            // Get user's organizations
            const orgsResponse = await axios.get('/organizations');
            if (orgsResponse.data.data.length === 0) {
                // No organization yet, redirect to create one
                router.push('/organizations/create');
                return;
            }

            const org = orgsResponse.data.data[0].organization || orgsResponse.data.data[0];
            setOrganization(org);

            // Get analytics
            const analyticsResponse = await axios.get(`/organizations/${org.id}/analytics`);
            setAnalytics(analyticsResponse.data.data);
        } catch (error) {
            toast.error('Failed to load dashboard');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!organization) return null;

    const subscriptionBadgeColors = {
        FREE: 'bg-gray-500',
        BASIC: 'bg-blue-500',
        PROFESSIONAL: 'bg-purple-500',
        ENTERPRISE: 'bg-gradient-to-r from-purple-500 to-pink-500',
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <div className="gradient-primary py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6">
                            {organization.logo ? (
                                <img
                                    src={organization.logo}
                                    alt={organization.name}
                                    className="w-20 h-20 rounded-full border-4 border-white/20"
                                />
                            ) : (
                                <div className="w-20 h-20 rounded-full gradient-accent flex items-center justify-center text-white text-3xl font-bold border-4 border-white/20">
                                    {organization.name[0].toUpperCase()}
                                </div>
                            )}
                            <div>
                                <h1 className="text-4xl font-bold text-white mb-2">{organization.name}</h1>
                                <div className="flex items-center gap-3">
                                    <span
                                        className={`${subscriptionBadgeColors[organization.subscription as keyof typeof subscriptionBadgeColors]
                                            } px-4 py-1 rounded-full text-white text-sm font-bold flex items-center gap-1`}
                                    >
                                        <Crown className="w-4 h-4" />
                                        {organization.subscription}
                                    </span>
                                    {organization.subscriptionStatus === 'ACTIVE' && (
                                        <span className="glass px-3 py-1 rounded-full text-sm">
                                            Active
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <Button
                                onClick={() => router.push('/dashboard/events/create')}
                                className="gradient-accent text-white"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Create Event
                            </Button>
                            <Button variant="outline" className="glass">
                                <Settings className="w-4 h-4 mr-2" />
                                Settings
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    <StatCard
                        icon={<Calendar className="w-6 h-6" />}
                        label="Total Events"
                        value={analytics?.totalEvents || 0}
                        color="text-blue-500"
                    />
                    <StatCard
                        icon={<TrendingUp className="w-6 h-6" />}
                        label="Upcoming Events"
                        value={analytics?.upcomingEvents || 0}
                        color="text-green-500"
                    />
                    <StatCard
                        icon={<Users className="w-6 h-6" />}
                        label="Total Bookings"
                        value={analytics?.totalBookings || 0}
                        color="text-purple-500"
                    />
                    <StatCard
                        icon={<DollarSign className="w-6 h-6" />}
                        label="Revenue"
                        value={`$${((analytics?.totalRevenue || 0) / 100).toFixed(2)}`}
                        color="text-yellow-500"
                    />
                </div>

                {/* Recent Events */}
                <div className="glass-strong rounded-2xl p-8">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold">Recent Events</h2>
                        <Link href="/dashboard/events">
                            <Button variant="outline" className="glass">
                                View All
                            </Button>
                        </Link>
                    </div>

                    {analytics?.recentEvents && analytics.recentEvents.length > 0 ? (
                        <div className="space-y-4">
                            {analytics.recentEvents.map((event: any) => (
                                <EventRow key={event.id} event={event} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <div className="text-6xl mb-4">📅</div>
                            <h3 className="text-xl font-bold mb-2">No events yet</h3>
                            <p className="text-muted-foreground mb-4">
                                Create your first event to get started
                            </p>
                            <Button
                                onClick={() => router.push('/dashboard/events/create')}
                                className="gradient-primary text-white"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Create Event
                            </Button>
                        </div>
                    )}
                </div>

                {/* Subscription Info */}
                {organization.subscription !== 'ENTERPRISE' && (
                    <div className="glass-strong rounded-2xl p-8 mt-8 border-2 border-primary/20">
                        <div className="flex items-start justify-between">
                            <div>
                                <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                                    <Crown className="w-5 h-5 text-yellow-500" />
                                    Upgrade Your Plan
                                </h3>
                                <p className="text-muted-foreground mb-4">
                                    Unlock AI features, custom branding, and advanced analytics
                                </p>
                                <ul className="space-y-2 text-sm mb-6">
                                    {!organization.aiFeatures && (
                                        <li className="flex items-center gap-2">
                                            <span className="text-green-500">✓</span>
                                            AI-powered event recommendations
                                        </li>
                                    )}
                                    {!organization.customBranding && (
                                        <li className="flex items-center gap-2">
                                            <span className="text-green-500">✓</span>
                                            Custom branding & colors
                                        </li>
                                    )}
                                    <li className="flex items-center gap-2">
                                        <span className="text-green-500">✓</span>
                                        Priority support
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="text-green-500">✓</span>
                                        Advanced analytics & insights
                                    </li>
                                </ul>
                                <Button className="gradient-primary text-white">
                                    View Plans
                                </Button>
                            </div>
                            <div className="text-6xl">🚀</div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

function StatCard({
    icon,
    label,
    value,
    color,
}: {
    icon: React.ReactNode;
    label: string;
    value: string | number;
    color: string;
}) {
    return (
        <div className="glass rounded-xl p-6 hover-lift">
            <div className="flex items-center justify-between mb-4">
                <div className={`${color} opacity-80`}>{icon}</div>
            </div>
            <p className="text-3xl font-bold mb-1">{value}</p>
            <p className="text-sm text-muted-foreground">{label}</p>
        </div>
    );
}

function EventRow({ event }: { event: any }) {
    const router = useRouter();
    const eventDate = new Date(event.startTime);
    const statusColors = {
        DRAFT: 'bg-yellow-500/20 text-yellow-500',
        PUBLISHED: 'bg-green-500/20 text-green-500',
        CANCELLED: 'bg-red-500/20 text-red-500',
        COMPLETED: 'bg-blue-500/20 text-blue-500',
    };

    return (
        <div
            className="glass p-4 rounded-xl hover-lift cursor-pointer"
            onClick={() => router.push(`/events/${event.slug}`)}
        >
            <div className="flex items-center justify-between">
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-bold">{event.title}</h4>
                        <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[event.status as keyof typeof statusColors]
                                }`}
                        >
                            {event.status}
                        </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {eventDate.toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                            })}
                        </span>
                        <span className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {event._count.bookings} bookings
                        </span>
                        <span className="flex items-center gap-1">
                            <BarChart3 className="w-4 h-4" />
                            {event.viewCount} views
                        </span>
                    </div>
                </div>
                <Button variant="outline" size="sm" className="glass">
                    Manage
                </Button>
            </div>
        </div>
    );
}
