import { dmSans, spaceGrotesk } from "@/lib/fonts";
import { Calendar, MapPin } from "lucide-react";
import Link from "next/link";

function EventCard({ event, index }: { event: any; index: number }) {
    const formattedDate = new Date(event.startTime).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
    });

    return (
        <Link
            href={`/events/${event.slug}`}
            className="group animate-fade-in-up"
            style={{ animationDelay: `${index * 0.1}s` }}
        >
            <div className="glass rounded-xl overflow-hidden hover-lift">
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

                    {/* Event Type Badge */}
                    <div className="absolute top-3 right-3">
                        <span className="glass px-3 py-1 rounded-full text-xs font-medium">
                            {event.eventType === 'VIRTUAL' && '🎥 Virtual'}
                            {event.eventType === 'IN_PERSON' && '📍 In-Person'}
                            {event.eventType === 'HYBRID' && '🌐 Hybrid'}
                        </span>
                    </div>

                    {/* Price Badge */}
                    {event.isFree && (
                        <div className="absolute top-3 left-3">
                            <span className="gradient-accent px-3 py-1 rounded-full text-xs font-bold text-white">
                                FREE
                            </span>
                        </div>
                    )}
                </div>

                {/* Event Info */}
                <div className="p-5 space-y-3">
                    <h3 className={`font-bold text-lg line-clamp-2 group-hover:text-primary transition-colors ${spaceGrotesk.className}`}>
                        {event.title}
                    </h3>

                    <div className={`flex items-center gap-4 text-sm text-muted-foreground ${dmSans.className}`}>
                        <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>{formattedDate}</span>
                        </div>
                        {event.city && (
                            <div className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                <span>{event.city}</span>
                            </div>
                        )}
                    </div>

                    {!event.isFree && event.basePrice && (
                        <div className={`text-primary font-bold ${dmSans.className}`}>
                            From ${(event.basePrice / 100).toFixed(2)}
                        </div>
                    )}
                </div>
            </div>
        </Link>
    );
}