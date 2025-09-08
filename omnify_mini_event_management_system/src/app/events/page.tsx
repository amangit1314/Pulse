"use client";

import { dmSans, spaceGrotesk } from "@/lib/fonts";
import AddEventComponent from "./_components/AddEventComponent";
import EventCard from "./_components/EventCard";
import Link from "next/link";
import { useUpcomingEvents } from "@/hooks/useEvents";
import { useEventStore } from "@/stores/useEventStore";
import Header from "@/components/common/Header";

export default function EventsPage() {
  // Fetch events from backend using TanStack Query
  const { data, isLoading, isError, error, isFetching } = useUpcomingEvents(
    1,
    9,
    "IST"
  ); // page=1, limit=9

  const { setCurrentEvent } = useEventStore();

  const events = data || [];

  return (
    <div className="min-h-screen pb-10 bg-gray-50">
      <Header />
      <div className="flex items-center justify-between my-8 px-6 md:px-12 ">
        <h1 className={`text-3xl font-bold ${spaceGrotesk.className}`}>
          Upcoming Events
        </h1>
        <AddEventComponent />
      </div>

      {/* Loading Shimmer */}
      {isLoading && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 animate-pulse px-6 md:px-12 ">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div key={idx} className="h-40 bg-gray-200 rounded-xl shadow-sm" />
          ))}
        </div>
      )}

      {/* Error State */}
      {isError && (
        <div className="text-red-600 text-center py-10 px-6 md:px-12 ">
          <p className="font-semibold">Failed to load events ❌</p>
          <p className="text-sm">{(error as Error).message}</p>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !isError && events.length === 0 && (
        <div className="flex flex-col items-center py-16 text-gray-500 px-6 md:px-12 ">
          {/* Illustration */}
          <svg
            width="120"
            height="120"
            viewBox="0 0 120 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="mb-6"
          >
            <rect
              x="10"
              y="30"
              width="100"
              height="60"
              rx="12"
              fill="#E5E7EB"
            />
            <rect x="25" y="45" width="70" height="10" rx="5" fill="#D1D5DB" />
            <rect x="25" y="60" width="40" height="8" rx="4" fill="#F3F4F6" />
            <circle cx="90" cy="64" r="6" fill="#F87171" />
            <rect x="40" y="80" width="40" height="6" rx="3" fill="#E5E7EB" />
          </svg>
          <p className="text-lg font-semibold mb-2">No upcoming events found</p>
          <p className="text-sm mb-4">
            It looks like there are no events scheduled yet.
          </p>
          {/* <AddEventComponent> */}
          {/* <button className="mt-2 px-5 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition">
              Create your first event
            </button> */}
          {/* </AddEventComponent> */}
        </div>
      )}
      {/* Events List */}
      {!isLoading && !isError && events.length > 0 && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 px-6 md:px-12 ">
          {events.map((event: any) => (
            <Link
              key={event.id}
              href={`/events/${event.id || event.slug}`}
              onClick={() => setCurrentEvent(event)}
            >
              <EventCard event={event} />
            </Link>
          ))}
        </div>
      )}

      {/* Subtle background refetch indicator */}
      {isFetching && !isLoading && (
        <div className="text-sm text-gray-400 mt-4 text-center px-6 md:px-12 ">
          Updating events…
        </div>
      )}
    </div>
  );
}
