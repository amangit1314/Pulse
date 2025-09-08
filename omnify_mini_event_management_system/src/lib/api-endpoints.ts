export const getApiBaseUrl = (): string => {
  return process.env.NEXT_API_BASE_URL ||"http://localhost:4000/api";
};

export const API_BASE_URL = `${getApiBaseUrl()}/api/v1`;

export const API_ENDPOINTS = {
  EVENTS: `${API_BASE_URL}/events`,
  ATTENDEES: (eventId: string) => `${API_BASE_URL}/events/${eventId}/attendees`,
  REGISTER_ATTENDEE: (eventId: string) =>
    `${API_BASE_URL}/events/${eventId}/register`,
};
