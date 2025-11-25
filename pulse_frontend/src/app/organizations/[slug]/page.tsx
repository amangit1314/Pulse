'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
    Building2, Globe, Mail, Phone, MapPin, Calendar, Users,
    ExternalLink, Loader2, ArrowLeft, CheckCircle2, Crown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { organizationsService, Organization } from '@/services/organizations.service';
import { dmSans, spaceGrotesk } from '@/lib/fonts';

export default function OrganizationDetailPage() {
    const params = useParams();
    const slug = params.slug as string;

    const [organization, setOrganization] = useState<Organization | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (slug) {
            loadOrganization();
        }
    }, [slug]);

    const loadOrganization = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await organizationsService.getOrganizationBySlug(slug);
            setOrganization(data);
        } catch (err) {
            console.error('Failed to load organization:', err);
            setError('Failed to load organization');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (error || !organization) {
        return (
            <div className="min-h-screen bg-background">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                    <div className="text-center">
                        <div className="text-6xl mb-4">🏢</div>
                        <h1 className={`${spaceGrotesk.className} text-3xl font-bold mb-2`}>
                            Organization Not Found
                        </h1>
                        <p className={`${dmSans.className} text-muted-foreground mb-6`}>
                            The organization you're looking for doesn't exist or has been removed.
                        </p>
                        <Link href="/organizations">
                            <Button className="gradient-primary text-white">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back to Organizations
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    const subscriptionColors = {
        FREE: 'bg-gray-500/20 text-gray-300 border-gray-500/30',
        BASIC: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
        PRO: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
        ENTERPRISE: 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-300 border-yellow-500/30',
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            <div className="gradient-primary py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Back Button */}
                    <Link
                        href="/organizations"
                        className={`${dmSans.className} inline-flex items-center text-white/80 hover:text-white mb-6 transition-colors`}
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Organizations
                    </Link>

                    <div className="flex flex-col md:flex-row gap-6 items-start">
                        {/* Logo */}
                        <div className="flex-shrink-0">
                            {organization.logo ? (
                                <img
                                    src={organization.logo}
                                    alt={organization.name}
                                    className="w-32 h-32 rounded-2xl border-4 border-white/20 object-cover glass-strong"
                                />
                            ) : (
                                <div className="w-32 h-32 rounded-2xl border-4 border-white/20 glass-strong flex items-center justify-center text-4xl font-bold text-white">
                                    {organization.name[0].toUpperCase()}
                                </div>
                            )}
                        </div>

                        {/* Info */}
                        <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-3 mb-3">
                                <h1 className={`${spaceGrotesk.className} text-4xl font-bold text-white`}>
                                    {organization.name}
                                </h1>

                                {/* Subscription Badge */}
                                <span
                                    className={`${subscriptionColors[organization.subscription]} px-4 py-1.5 rounded-full text-sm font-bold backdrop-blur-sm border`}
                                >
                                    {organization.subscription === 'ENTERPRISE' && <Crown className="w-4 h-4 inline mr-1" />}
                                    {organization.subscription}
                                </span>

                                {/* Active Status */}
                                {organization.subscriptionStatus === 'ACTIVE' && (
                                    <span className="bg-green-500/20 text-green-300 border border-green-500/30 px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm flex items-center gap-1">
                                        <CheckCircle2 className="w-3 h-3" />
                                        Active
                                    </span>
                                )}
                            </div>

                            {organization.description && (
                                <p className={`${dmSans.className} text-white/90 text-lg mb-4 max-w-3xl`}>
                                    {organization.description}
                                </p>
                            )}

                            {/* Location */}
                            {organization.city && organization.country && (
                                <div className={`${dmSans.className} flex items-center gap-2 text-white/80 mb-4`}>
                                    <MapPin className="w-4 h-4" />
                                    <span>
                                        {organization.city}, {organization.state && `${organization.state}, `}
                                        {organization.country}
                                    </span>
                                </div>
                            )}

                            {/* Stats Row */}
                            <div className="flex flex-wrap gap-6 text-white">
                                {organization._count?.events !== undefined && (
                                    <div className={`${dmSans.className} flex items-center gap-2`}>
                                        <Calendar className="w-5 h-5" />
                                        <span className="font-semibold">{organization._count.events}</span>
                                        <span className="text-white/70">Events</span>
                                    </div>
                                )}

                                {organization._count?.teamMembers !== undefined && (
                                    <div className={`${dmSans.className} flex items-center gap-2`}>
                                        <Users className="w-5 h-5" />
                                        <span className="font-semibold">{organization._count.teamMembers}</span>
                                        <span className="text-white/70">Team Members</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* About Section */}
                        <div className="glass-strong rounded-xl p-6">
                            <h2 className={`${spaceGrotesk.className} text-2xl font-bold mb-4`}>
                                About {organization.name}
                            </h2>

                            {organization.description ? (
                                <p className={`${dmSans.className} text-muted-foreground leading-relaxed`}>
                                    {organization.description}
                                </p>
                            ) : (
                                <p className={`${dmSans.className} text-muted-foreground italic`}>
                                    No description provided.
                                </p>
                            )}
                        </div>

                        {/* Features Section */}
                        {(organization.aiFeatures || organization.customBranding) && (
                            <div className="glass-strong rounded-xl p-6">
                                <h2 className={`${spaceGrotesk.className} text-2xl font-bold mb-4`}>
                                    Features & Capabilities
                                </h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {organization.aiFeatures && (
                                        <div className="flex items-start gap-3 p-4 rounded-lg bg-primary/10 border border-primary/20">
                                            <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                                            <div>
                                                <h3 className={`${dmSans.className} font-semibold mb-1`}>
                                                    AI Features
                                                </h3>
                                                <p className={`${dmSans.className} text-sm text-muted-foreground`}>
                                                    Powered by advanced AI capabilities
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {organization.customBranding && (
                                        <div className="flex items-start gap-3 p-4 rounded-lg bg-primary/10 border border-primary/20">
                                            <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                                            <div>
                                                <h3 className={`${dmSans.className} font-semibold mb-1`}>
                                                    Custom Branding
                                                </h3>
                                                <p className={`${dmSans.className} text-sm text-muted-foreground`}>
                                                    Personalized branding and styling
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Contact Information */}
                        <div className="glass-strong rounded-xl p-6">
                            <h2 className={`${spaceGrotesk.className} text-xl font-bold mb-4`}>
                                Contact Information
                            </h2>

                            <div className="space-y-4">
                                {organization.website && (
                                    <a
                                        href={organization.website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`${dmSans.className} flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors group`}
                                    >
                                        <Globe className="w-5 h-5" />
                                        <span className="flex-1 truncate">{organization.website.replace(/^https?:\/\//, '')}</span>
                                        <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </a>
                                )}

                                {organization.email && (
                                    <a
                                        href={`mailto:${organization.email}`}
                                        className={`${dmSans.className} flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors`}
                                    >
                                        <Mail className="w-5 h-5" />
                                        <span className="flex-1 truncate">{organization.email}</span>
                                    </a>
                                )}

                                {organization.phone && (
                                    <a
                                        href={`tel:${organization.phone}`}
                                        className={`${dmSans.className} flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors`}
                                    >
                                        <Phone className="w-5 h-5" />
                                        <span>{organization.phone}</span>
                                    </a>
                                )}

                                {organization.address && (
                                    <div className={`${dmSans.className} flex items-start gap-3 text-muted-foreground`}>
                                        <MapPin className="w-5 h-5 mt-0.5" />
                                        <div className="flex-1">
                                            <p>{organization.address}</p>
                                            {organization.city && (
                                                <p>
                                                    {organization.city}
                                                    {organization.state && `, ${organization.state}`}
                                                    {organization.postalCode && ` ${organization.postalCode}`}
                                                </p>
                                            )}
                                            {organization.country && <p>{organization.country}</p>}
                                        </div>
                                    </div>
                                )}

                                {!organization.website && !organization.email && !organization.phone && !organization.address && (
                                    <p className={`${dmSans.className} text-muted-foreground italic text-sm`}>
                                        No contact information available.
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Member Since */}
                        <div className="glass-strong rounded-xl p-6">
                            <h2 className={`${spaceGrotesk.className} text-xl font-bold mb-4`}>
                                Member Since
                            </h2>
                            <p className={`${dmSans.className} text-muted-foreground`}>
                                {new Date(organization.createdAt).toLocaleDateString('en-US', {
                                    month: 'long',
                                    year: 'numeric',
                                })}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
