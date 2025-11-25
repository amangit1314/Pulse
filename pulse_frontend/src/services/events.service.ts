import axios from '../lib/axios';

export interface Event {
  id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription?: string;
  coverImage?: string;
  eventType: 'IN_PERSON' | 'VIRTUAL' | 'HYBRID';
  startTime: string;
  endTime: string;
  city?: string;
  country?: string;
  venue?: string;
  isFree: boolean;
  basePrice?: number;
  currency: string;
  featured: boolean;
  distance?: number;
  isInWishlist?: boolean;
}

export interface SearchFilters {
  q?: string;
  eventType?: string;
  city?: string;
  country?: string;
  startDate?: string;
  endDate?: string;
  isFree?: boolean;
  minPrice?: number;
  maxPrice?: number;
  categoryId?: string;
  tags?: string[];
  featured?: boolean;
  latitude?: number;
  longitude?: number;
  radius?: number;
  page?: number;
  limit?: number;
  sortBy?: string;
}

export const eventsService = {
  async searchEvents(filters: SearchFilters): Promise<any> {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          params.append(key, value.join(','));
        } else {
          params.append(key, String(value));
        }
      }
    });

    const response = await axios.get(`/events/search?${params.toString()}`);
    return response.data.data;
  },

  async getFeaturedEvents(limit: number = 10): Promise<Event[]> {
    const response = await axios.get(`/events/featured?limit=${limit}`);
    return response.data.data;
  },

  async getTrendingEvents(limit: number = 10): Promise<Event[]> {
    const response = await axios.get(`/events/trending?limit=${limit}`);
    return response.data.data;
  },

  async getEventById(eventId: string): Promise<Event> {
    const response = await axios.get(`/events/${eventId}`);
    return response.data.data;
  },

  async getEventBySlug(slug: string): Promise<Event> {
    const response = await axios.get(`/events/slug/${slug}`);
    return response.data.data;
  },

  async createEvent(data: any): Promise<Event> {
    const response = await axios.post('/events', data);
    return response.data.data;
  },

  async updateEvent(eventId: string, data: any): Promise<Event> {
    const response = await axios.put(`/events/${eventId}`, data);
    return response.data.data;
  },

  async deleteEvent(eventId: string): Promise<void> {
    await axios.delete(`/events/${eventId}`);
  },
};
