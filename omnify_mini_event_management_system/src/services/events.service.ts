// src/services/events.service.ts
import apiManager from "@/lib/api-manager";

// DTOs (types for request/response)
export interface CreateEventDto {
  name: string;
  location: string;
  latitude?: string;
  longitude?: string;
  startTime: string;
  endTime: string;
  timezone: string;
  maxCapacity: number;
}

export interface AttendeeDto {
  name: string;
  email: string;
}

export const EventsService = {
  // Get paginated upcoming events
  getUpcoming: async (page = 1, limit = 10, timezone?: string) => {
    const response = await apiManager.get(
      `/events?page=${page}&limit=${limit}${
        timezone ? `&timezone=${timezone}` : ""
      }`
    );
    console.log("Response of events gettings", JSON.stringify(response));
    console.log("Response data: ", JSON.stringify(response.data));
    console.log("Response data data: ", JSON.stringify(response.data.data));
    console.log("Events: ", JSON.stringify(response.data.data.events));
    return response.data.data.events; // because of nested `data`
  },

  // Create new event
  create: async (payload: {
    name: string;
    // slug: string;
    location: string;
    startTime: string;
    endTime: string;
    maxCapacity: number;
  }) => {
    const response = await apiManager.post("/events", payload);
    return response.data;
  },

  // Register attendee
  register: (eventId: string, payload: AttendeeDto) =>
    apiManager.post(`/events/${eventId}/register`, payload),

  // Get attendees with pagination
  attendees: async (eventId: string, page = 1, limit = 10) => {
    const response = await apiManager.get(
      `/events/${eventId}/attendees?page=${page}&limit=${limit}`
    );

    // Return { attendees, pagination }
    return response.data.data;
  },
};
