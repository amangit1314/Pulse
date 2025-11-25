import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  EventsService,
  CreateEventDto,
  AttendeeDto,
} from "@/services/events.service";
import { AxiosResponse } from "axios";

// Get upcoming events
export const useUpcomingEvents = (page = 1, limit = 10, timezone?: string) =>
  useQuery({
    queryKey: ["events", "upcoming", page, limit, timezone],
    queryFn: () => EventsService.getUpcoming(page, limit, timezone),
    staleTime: 1000 * 60, // 1 min cache
    placeholderData: (prev) => prev,
  });

// Create a new event (optimistic update)
export const useCreateEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateEventDto) => EventsService.create(payload),

    // Optimistic update
    onMutate: async (newEvent: CreateEventDto) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["events", "upcoming"] });

      // Snapshot previous value
      const prev = queryClient.getQueryData<any>(["events", "upcoming"]);

      // Optimistically update the cache
      if (prev) {
        queryClient.setQueryData(["events", "upcoming"], {
          ...prev,
          data: [
            {
              ...newEvent,
              id: "temp-id", // temporary ID
              createdAt: new Date().toISOString(),
            },
            ...prev.data,
          ],
        });
      }

      return { prev };
    },

    onError: (_err, _newEvent, context) => {
      // Rollback on error
      if (context?.prev) {
        queryClient.setQueryData(["events", "upcoming"], context.prev);
      }
    },

    onSettled: () => {
      // Always refetch to sync with server
      queryClient.invalidateQueries({ queryKey: ["events", "upcoming"] });
    },
  });
};

// Register an attendee (optimistic update)
export const useRegisterAttendee = (
  eventId: string,
  options?: {
    onSuccess?: () => void;
    onError?: () => void;
  }
) => {
  const queryClient = useQueryClient();
  return useMutation<AxiosResponse<any>, Error, AttendeeDto, { prev: any }>({
    mutationFn: (payload: AttendeeDto) =>
      EventsService.register(eventId, payload),
    onMutate: async (newAttendee: AttendeeDto) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({
        queryKey: ["events", "attendees", eventId],
      });

      // Snapshot previous value
      const prev = queryClient.getQueryData<any>([
        "events",
        "attendees",
        eventId,
      ]);

      // Optimistically update the cache
      if (prev) {
        queryClient.setQueryData(["events", "attendees", eventId], {
          ...prev,
          data: [...prev.data, { ...newAttendee, id: "temp-id", eventId }],
        });
      }

      // Must return object with prev
      return { prev };
    },

    onError: (_err, _newAttendee, context) => {
      /* ... */
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["events", "attendees", eventId],
      });
    },
    ...options,
  });
};

// Get event attendees
export const useEventAttendees = (eventId: string, page = 1, limit = 10) => {
  return useQuery({
    queryKey: ["events", "attendees", eventId, page, limit],
    queryFn: async () => {
      const data = await EventsService.attendees(eventId, page, limit);
      return data ?? { attendees: [], pagination: { page, limit, total: 0 } };
    },
  });
};
