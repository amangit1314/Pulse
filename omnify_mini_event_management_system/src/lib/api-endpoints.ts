export const getApiBaseUrl = (): string => {
  return "http://localhost:4000/api";
};

export const API_BASE_URL = `${getApiBaseUrl()}/api/v1`;

export const API_ENDPOINTS = {
  EVENTS: `${API_BASE_URL}/events`,
  ATTENDEES: (eventId: string) => `${API_BASE_URL}/events/${eventId}/attendees`,
  REGISTER_ATTENDEE: (eventId: string) =>
    `${API_BASE_URL}/events/${eventId}/register`,
};
