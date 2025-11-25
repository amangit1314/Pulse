'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Building2, Users, Calendar, Loader2, Globe, Mail, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { organizationsService, Organization } from '@/services/organizations.service';
import { dmSans, spaceGrotesk } from '@/lib/fonts';

export default function OrganizationsPage() {
    const [organizations, setOrganizations] = useState<Organization[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        loadOrganizations();
    }, []);

    const loadOrganizations = async () => {
        try {
            setLoading(true);
            const data = await organizationsService.getAllOrganizations();
            setOrganizations(data);
        } catch (error) {
            console.error('Failed to load organizations:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredOrganizations = organizations.filter((org) =>
        org.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        org.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <div className="gradient-primary py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className={`${spaceGrotesk.className} text-4xl font-bold text-white mb-2`}>
                        Discover Organizations
                    </h1>
                    <p className={`${dmSans.className} text-white/90 text-lg`}>
                        Connect with amazing organizations and event creators
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Search Bar */}
                <div className="glass-strong rounded-xl p-6 mb-8">
                    <div className={`${dmSans.className} relative`}>
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                            type="text"
                            placeholder="Search organizations..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 bg-background"
                        />
                    </div>
                </div>

                {/* Results Count */}
                <div className="flex items-center justify-between mb-6">
                    <p className={`${dmSans.className} text-muted-foreground`}>
                        {loading ? 'Loading...' : `${filteredOrganizations.length} organizations found`}
                    </p>
                </div>

                {/* Organizations Grid */}
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                ) : filteredOrganizations.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="text-6xl mb-4">🏢</div>
                        <h3 className={`${spaceGrotesk.className} text-2xl font-bold mb-2`}>
                            No organizations found
                        </h3>
                        <p className={`${dmSans.className} text-muted-foreground`}>
                            Try adjusting your search query
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredOrganizations.map((organization, index) => (
                            <OrganizationCard
                                key={organization.id}
                                organization={organization}
                                index={index}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

function OrganizationCard({ organization, index }: { organization: Organization; index: number }) {
    const subscriptionColors = {
        FREE: 'bg-gray-500/20 text-gray-300',
        BASIC: 'bg-blue-500/20 text-blue-300',
        PRO: 'bg-purple-500/20 text-purple-300',
        ENTERPRISE: 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-300',
    };

    return (
        <Link
            href={`/organizations/${organization.slug}`}
            className="group animate-fade-in-up"
            style={{ animationDelay: `${index * 0.05}s` }}
        >
            <div className="glass rounded-xl overflow-hidden hover-lift h-full flex flex-col">
                {/* Organization Header */}
                <div className="relative h-32 bg-gradient-accent overflow-hidden">
                    <div className="absolute inset-0 gradient-overlay"></div>

                    {/* Logo */}
                    <div className="absolute -bottom-10 left-6">
                        {organization.logo ? (
                            <img
                                src={organization.logo}
                                alt={organization.name}
                                className="w-20 h-20 rounded-xl border-4 border-background object-cover"
                            />
                        ) : (
                            <div className="w-20 h-20 rounded-xl border-4 border-background glass-strong flex items-center justify-center text-2xl font-bold">
                                {organization.name[0].toUpperCase()}
                            </div>
                        )}
                    </div>

                    {/* Subscription Badge */}
                    <div className="absolute top-3 right-3">
                        <span
                            className={`${subscriptionColors[organization.subscription]} px-3 py-1 rounded-full text-xs font-bold backdrop-blur-sm`}
                        >
                            {organization.subscription}
                        </span>
                    </div>
                </div>

                {/* Organization Info */}
                <div className="p-6 pt-14 space-y-3 flex-1 flex flex-col">
                    <div>
                        <h3 className={`${spaceGrotesk.className} font-bold text-xl line-clamp-1 group-hover:text-primary transition-colors mb-1`}>
                            {organization.name}
                        </h3>

                        {organization.city && organization.country && (
                            <p className={`${dmSans.className} text-sm text-muted-foreground flex items-center gap-1`}>
                                <Globe className="w-3 h-3" />
                                {organization.city}, {organization.country}
                            </p>
                        )}
                    </div>

                    {organization.description && (
                        <p className={`${dmSans.className} text-sm text-muted-foreground line-clamp-3`}>
                            {organization.description}
                        </p>
                    )}

                    {/* Stats */}
                    <div className="mt-auto pt-4 border-t border-border">
                        <div className="grid grid-cols-2 gap-3">
                            {organization._count?.events !== undefined && (
                                <div className={`${dmSans.className} flex items-center gap-2 text-sm`}>
                                    <Calendar className="w-4 h-4 text-primary" />
                                    <span className="text-muted-foreground">
                                        {organization._count.events} {organization._count.events === 1 ? 'event' : 'events'}
                                    </span>
                                </div>
                            )}

                            {organization._count?.teamMembers !== undefined && (
                                <div className={`${dmSans.className} flex items-center gap-2 text-sm`}>
                                    <Users className="w-4 h-4 text-primary" />
                                    <span className="text-muted-foreground">
                                        {organization._count.teamMembers} {organization._count.teamMembers === 1 ? 'member' : 'members'}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Active Status */}
                        {organization.subscriptionStatus === 'ACTIVE' && (
                            <div className={`${dmSans.className} flex items-center gap-1 text-xs text-green-400 mt-3`}>
                                <CheckCircle2 className="w-3 h-3" />
                                Active
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    );
}
