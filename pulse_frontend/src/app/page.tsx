'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, MapPin, Calendar, TrendingUp, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { eventsService, Event } from '@/services/events.service';
import { spaceGrotesk, dmSans } from '@/lib/fonts';
import EventCard from './events/_components/EventCard';

export default function HomePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [featuredEvents, setFeaturedEvents] = useState<Event[]>([]);
  const [trendingEvents, setTrendingEvents] = useState<Event[]>([]);

  useEffect(() => {
    // Load featured and trending events
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const [featured, trending] = await Promise.all([
        eventsService.getFeaturedEvents(6),
        eventsService.getTrendingEvents(6),
      ]);
      setFeaturedEvents(featured);
      setTrendingEvents(trending);
    } catch (error) {
      console.error('Failed to load events:', error);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/events?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Gradient Background */}
        {/* <div className="absolute inset-0 gradient-primary opacity-90"></div> */}

        {/* Animated Background Shapes */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300/20 rounded-full blur-3xl animate-pulse-glow"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
          <div className="text-center space-y-8 animate-fade-in-up">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 backdrop-blur-xl text-sm">
              <Sparkles className="w-4 h-4 text-purple-500" />
              <span className={`${dmSans.className} text-purple-600`}>AI-Powered Event Discovery</span>
            </div>

            {/* Main Heading */}
            <h1 className={`text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight ${spaceGrotesk.className}`}>
              <span className="block text-primary">Discover Amazing</span>
              <span className="block text-gradient-primary">Events Near You</span>
            </h1>

            {/* Subheading */}
            {/* text-xl sm:text-2xl */}
            <p className={`text-base text-gray-700 dark:text-gray-300 max-w-3xl mx-auto ${dmSans.className}`}>
              Find and book tickets to the best events, meetups, and experiences in your city
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className={`${dmSans.className} max-w-2xl mx-auto`}>
              <div className="glass-strong p-2 rounded-2xl flex items-center gap-2">
                <Search className="w-5 h-5 ml-3 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search events, categories, or locations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="border-0 bg-transparent text-lg focus-visible:ring-0 focus-visible:ring-offset-0"
                />
                <Button
                  type="submit"
                  size="lg"
                  className="gradient-accent text-white hover:opacity-90 px-8"
                >
                  Search
                </Button>
              </div>
            </form>

            {/* Quick Links */}
            <div className={`${dmSans.className} flex flex-wrap justify-center gap-3`}>
              <Link href="/events?eventType=VIRTUAL">
                <Button variant="outline" className="glass hover-lift">
                  🎥 Virtual Events
                </Button>
              </Link>
              <Link href="/events?eventType=IN_PERSON">
                <Button variant="outline" className="glass hover-lift">
                  📍 In-Person Events
                </Button>
              </Link>
              <Link href="/events?isFree=true">
                <Button variant="outline" className="glass hover-lift">
                  🎉 Free Events
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Events Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className={`text-3xl font-bold text-gradient-primary flex items-center gap-2 ${spaceGrotesk.className}`}>
                <Sparkles className="w-8 h-8" />
                Featured Events
              </h2>
              <p className={`text-muted-foreground mt-2 ${dmSans.className}`}>
                Hand-picked events you won't want to miss
              </p>
            </div>
            <Link href="/events?featured=true">
              <Button variant="outline" className="glass hover-lift">
                View All
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredEvents.slice(0, 6).map((event: any, index) => (
              <EventCard key={event.id} event={event} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Trending Events Section */}
      <section className="py-20 bg-card/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className={`text-3xl font-bold text-gradient-accent flex items-center gap-2 ${spaceGrotesk.className}`}>
                <TrendingUp className="w-8 h-8" />
                Trending Now
              </h2>
              <p className={`text-muted-foreground mt-2 ${dmSans.className}`}>
                What everyone's talking about
              </p>
            </div>
            <Link href="/events?sortBy=popular">
              <Button variant="outline" className="glass hover-lift">
                View All
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trendingEvents.slice(0, 6).map((event: any, index) => (
              <EventCard key={event.id} event={event} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className={`text-3xl font-bold ${spaceGrotesk.className}`}>Browse by Category</h2>
            <p className={`text-muted-foreground mt-2 ${dmSans.className}`}>
              Find events that match your interests
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {CATEGORIES.map((category) => (
              <Link
                key={category.name}
                href={`/events?tags=${category.name}`}
                className="glass p-6 rounded-xl text-center hover-lift group"
              >
                <div className="text-4xl mb-3">{category.icon}</div>
                <div className={`font-medium group-hover:text-primary transition-colors ${dmSans.className}`}>
                  {category.name}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 overflow-hidden">
        {/* <div className="absolute inset-0 gradient-secondary opacity-90"></div> */}
        <div className="absolute inset-0 gradient-primary opacity-90"></div>
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-4xl mx-auto  px-4 sm:px-6 lg:px-8 text-center">
          <h2 className={`text-4xl font-bold text-white mb-6 ${spaceGrotesk.className}`}>
            Ready to organize your own event?
          </h2>
          <p className={`text-xl text-white/90 mb-8 ${dmSans.className}`}>
            Join thousands of organizers using Pulse to create amazing experiences
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/register">
              <Button size="lg" className="glass-strong text-white hover-lift px-8">
                Get Started Free
              </Button>
            </Link>
            <Link href="/organizations">
              <Button size="lg" variant="outline" className="glass hover-lift">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

const CATEGORIES = [
  { name: 'Music', icon: '🎵' },
  { name: 'Sports', icon: '⚽' },
  { name: 'Tech', icon: '💻' },
  { name: 'Business', icon: '💼' },
  { name: 'Food', icon: '🍕' },
  { name: 'Art', icon: '🎨' },
  { name: 'Health', icon: '💪' },
  { name: 'Education', icon: '📚' },
  { name: 'Gaming', icon: '🎮' },
  { name: 'Fashion', icon: '👗' },
  { name: 'Film', icon: '🎬' },
  { name: 'Charity', icon: '❤️' },
];
