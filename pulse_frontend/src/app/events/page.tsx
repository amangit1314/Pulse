'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Search, MapPin, Calendar, Filter, SlidersHorizontal, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { eventsService } from '@/services/events.service';
import { dmSans, spaceGrotesk } from '@/lib/fonts';

export default function EventsPage() {
  const searchParams = useSearchParams();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ total: 0, page: 1, totalPages: 0 });

  // Filters
  const [filters, setFilters] = useState({
    q: searchParams.get('q') || '',
    eventType: searchParams.get('eventType') || '',
    city: searchParams.get('city') || '',
    isFree: searchParams.get('isFree') || '',
    sortBy: searchParams.get('sortBy') || 'startTime',
    page: 1,
  });

  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadEvents();
  }, [filters]);

  const loadEvents = async () => {
    try {
      setLoading(true);
      // Filter out empty string values before sending to API
      const apiFilters: Record<string, any> = {};
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== '' && value !== null && value !== undefined) {
          apiFilters[key] = value;
        }
      });

      const response = await eventsService.searchEvents(apiFilters);
      setEvents(response.events);
      setPagination(response.pagination);
    } catch (error) {
      console.error('Failed to load events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters({ ...filters, page: 1 });
  };

  const updateFilter = (key: string, value: any) => {
    setFilters({ ...filters, [key]: value, page: 1 });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="gradient-primary py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className={`${spaceGrotesk.className} text-4xl font-bold text-white`}>Discover Events</h1>
          <p className={`${dmSans.className} text-white/90 text-lg`}>
            Find amazing events happening near you
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search & Filters */}
        <div className="glass-strong rounded-xl p-6 mb-8 space-y-4">
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex gap-3">
            <div className={`${dmSans.className} flex-1 relative`}>
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search events..."
                value={filters.q}
                onChange={(e) => setFilters({ ...filters, q: e.target.value })}
                className="pl-10 bg-background"
              />
            </div>
            <Button type="submit" className={`${dmSans.className} gradient-primary text-white`}>
              Search
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className={`${dmSans.className} glass`}
            >
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </form>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-border animate-fade-in">
              <div className="space-y-2">
                <Label>Event Type</Label>
                <Select value={filters.eventType} onValueChange={(value) => updateFilter('eventType', value)}>
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="All Events" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Events</SelectItem>
                    <SelectItem value="IN_PERSON">In-Person</SelectItem>
                    <SelectItem value="VIRTUAL">Virtual</SelectItem>
                    <SelectItem value="HYBRID">Hybrid</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Price</Label>
                <Select value={filters.isFree} onValueChange={(value) => updateFilter('isFree', value)}>
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="All Prices" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Prices</SelectItem>
                    <SelectItem value="true">Free Only</SelectItem>
                    <SelectItem value="false">Paid Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Sort By</Label>
                <Select value={filters.sortBy} onValueChange={(value) => updateFilter('sortBy', value)}>
                  <SelectTrigger className="bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="startTime">Date (Earliest)</SelectItem>
                    <SelectItem value="popular">Most Popular</SelectItem>
                    <SelectItem value="created">Newest</SelectItem>
                    <SelectItem value="price-low">Price (Low to High)</SelectItem>
                    <SelectItem value="price-high">Price (High to Low)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>City</Label>
                <Input
                  type="text"
                  placeholder="Enter city..."
                  value={filters.city}
                  onChange={(e) => updateFilter('city', e.target.value)}
                  className="bg-background"
                />
              </div>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className={`${dmSans.className} text-muted-foreground`}>
            {loading ? 'Loading...' : `${pagination.total} events found`}
          </p>
        </div>

        {/* Events Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className={`${spaceGrotesk.className} text-2xl font-bold mb-2`}>No events found</h3>
            <p className={`${dmSans.className} text-muted-foreground`}>
              Try adjusting your filters or search query
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event: any, index: number) => (
                <EventCard key={event.id} event={event} index={index} />
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className={`${dmSans.className} flex justify-center gap-2 mt-12`}>
                <Button
                  variant="outline"
                  onClick={() => updateFilter('page', filters.page - 1)}
                  disabled={filters.page === 1}
                  className="glass"
                >
                  Previous
                </Button>
                <div className="flex items-center gap-2">
                  {Array.from({ length: Math.min(pagination.totalPages, 5) }, (_, i) => {
                    const page = i + 1;
                    return (
                      <Button
                        key={page}
                        variant={filters.page === page ? 'default' : 'outline'}
                        onClick={() => updateFilter('page', page)}
                        className={filters.page === page ? 'gradient-primary text-white' : 'glass'}
                      >
                        {page}
                      </Button>
                    );
                  })}
                </div>
                <Button
                  variant="outline"
                  onClick={() => updateFilter('page', filters.page + 1)}
                  disabled={filters.page === pagination.totalPages}
                  className="glass"
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function EventCard({ event, index }: { event: any; index: number }) {
  const formattedDate = new Date(event.startTime).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  const formattedTime = new Date(event.startTime).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });

  return (
    <Link
      href={`/events/${event.slug}`}
      className="group animate-fade-in-up"
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      <div className="glass rounded-xl overflow-hidden hover-lift h-full flex flex-col">
        {/* Event Image */}
        <div className="relative h-48 bg-gradient-accent overflow-hidden">
          {event.coverImage ? (
            <img
              src={event.coverImage}
              alt={event.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-6xl">
              🎉
            </div>
          )}
          <div className="absolute inset-0 gradient-overlay"></div>

          {/* Badges */}
          <div className="absolute top-3 right-3 flex gap-2">
            <span className="glass px-3 py-1 rounded-full text-xs font-medium">
              {event.eventType === 'VIRTUAL' && '🎥'}
              {event.eventType === 'IN_PERSON' && '📍'}
              {event.eventType === 'HYBRID' && '🌐'}
            </span>
          </div>

          {event.isFree && (
            <div className="absolute top-3 left-3">
              <span className="gradient-accent px-3 py-1 rounded-full text-xs font-bold text-white">
                FREE
              </span>
            </div>
          )}

          {event.distance && (
            <div className="absolute bottom-3 right-3">
              <span className="glass px-2 py-1 rounded-full text-xs">
                {event.distance.toFixed(1)} km away
              </span>
            </div>
          )}
        </div>

        {/* Event Info */}
        <div className="p-5 space-y-3 flex-1 flex flex-col">
          <h3 className="font-bold text-lg line-clamp-2 group-hover:text-primary transition-colors">
            {event.title}
          </h3>

          {event.shortDescription && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {event.shortDescription}
            </p>
          )}

          <div className="mt-auto space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span>
                {formattedDate} • {formattedTime}
              </span>
            </div>

            {event.city && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>{event.city}, {event.country}</span>
              </div>
            )}

            {!event.isFree && event.basePrice && (
              <div className="text-primary font-bold text-lg">
                From ${(event.basePrice / 100).toFixed(2)}
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
