"use client";

import { motion } from "framer-motion";
import { Pin } from "lucide-react";
import { format } from "date-fns";
import { dmSans, spaceGrotesk } from "@/lib/fonts";
import { Event as event } from "@/types/event";

const EventCard = ({ event }: { event: event }) => {
  return (
    <motion.div
      key={event.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="p-6 bg-white rounded-2xl shadow hover:shadow-lg transition"
    >
      <h2 className={`text-xl font-semibold ${spaceGrotesk.className}`}>
        {event.name}
      </h2>
      <div
        className={`flex items-center mb-2 justify-start space-x-2 text-zinc-600 ${dmSans.className}`}
      >
        <Pin className="text-indigo-600 h-4 w-4" />
        <p>{event.location}</p>
      </div>

      <p className={`text-sm text-zinc-500 ${dmSans.className}`}>
        {/* {format(event.start_time, "PPpp")} →{" "}
              {format(event.end_time, "PPpp")} */}
        {format(new Date(event.startTime), "MM/dd/yyyy, hh:mm a")} →{" "}
        {format(new Date(event.endTime), "MM/dd/yyyy, hh:mm a")}
      </p>
      <p
        className={`mt-3 text-sm font-medium text-indigo-600 ${dmSans.className}`}
      >
        Capacity: {event.maxCapacity}
      </p>
    </motion.div>
  );
};

export default EventCard;
