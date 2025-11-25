import { PrismaClient, EventType, EventStatus, TicketSource } from '@prisma/client';
import { calculateDistance, getBoundingBox } from '../../shared/utils/location.util.js';

const prisma = new PrismaClient();

export interface CreateEventData {
  title: string;
  description: string;
  shortDescription?: string;
  eventType: EventType;
  venue?: string;
  address?: string;
  city?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
  startTime: Date;
  endTime: Date;
  timezone: string;
  maxCapacity?: number;
  ticketSource: TicketSource;
  affiliateUrl?: string;
  affiliateCode?: string;
  isFree: boolean;
  basePrice?: number;
  currency: string;
  tags?: string[];
  categoryIds?: string[];
  organizationId?: string;
}

export interface SearchEventsFilters {
  q?: string;
  eventType?: EventType;
  city?: string;
  country?: string;
  startDate?: Date;
  endDate?: Date;
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

export class EventsService {
  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      + '-' + Math.random().toString(36).substring(2, 8);
  }

  async createEvent(data: CreateEventData, userId?: string) {
    const slug = this.generateSlug(data.title);

    const event = await prisma.event.create({
      data: {
        title: data.title,
        slug,
        description: data.description,
        shortDescription: data.shortDescription,
        eventType: data.eventType,
        venue: data.venue,
        address: data.address,
        city: data.city,
        country: data.country,
        latitude: data.latitude,
        longitude: data.longitude,
        startTime: new Date(data.startTime),
        endTime: new Date(data.endTime),
        timezone: data.timezone,
        maxCapacity: data.maxCapacity,
        ticketSource: data.ticketSource,
        affiliateUrl: data.affiliateUrl,
        affiliateCode: data.affiliateCode,
        isFree: data.isFree,
        basePrice: data.basePrice,
        currency: data.currency,
        tags: data.tags || [],
        organizationId: data.organizationId,
        status: 'DRAFT',
      },
      include: {
        organization: {
          select: {
            id: true,
            name: true,
            slug: true,
            logo: true,
          },
        },
        categories: {
          include: {
            category: true,
          },
        },
      },
    });

    // Add categories if provided
    if (data.categoryIds && data.categoryIds.length > 0) {
      await prisma.eventCategory.createMany({
        data: data.categoryIds.map((categoryId) => ({
          eventId: event.id,
          categoryId,
        })),
      });
    }

    return event;
  }

  async updateEvent(eventId: string, data: Partial<CreateEventData>) {
    const event = await prisma.event.update({
      where: { id: eventId },
      data: {
        ...data,
        startTime: data.startTime ? new Date(data.startTime) : undefined,
        endTime: data.endTime ? new Date(data.endTime) : undefined,
      },
      include: {
        organization: {
          select: {
            id: true,
            name: true,
            slug: true,
            logo: true,
          },
        },
        categories: {
          include: {
            category: true,
          },
        },
      },
    });

    return event;
  }

  async getEventById(eventId: string, userId?: string) {
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: {
        organization: {
          select: {
            id: true,
            name: true,
            slug: true,
            logo: true,
            coverImage: true,
          },
        },
        categories: {
          include: {
            category: true,
          },
        },
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                avatar: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 10,
        },
        virtualMeetup: true,
      },
    });

    if (!event) {
      throw new Error('Event not found');
    }

    // Increment view count
    await prisma.event.update({
      where: { id: eventId },
      data: { viewCount: { increment: 1 } },
    });

    // Check if user has this event in wishlist
    let isInWishlist = false;
    if (userId) {
      const wishlistItem = await prisma.wishlistItem.findFirst({
        where: { userId, eventId },
      });
      isInWishlist = !!wishlistItem;
    }

    return {
      ...event,
      isInWishlist,
    };
  }

  async getEventBySlug(slug: string, userId?: string) {
    const event = await prisma.event.findUnique({
      where: { slug },
      include: {
        organization: {
          select: {
            id: true,
            name: true,
            slug: true,
            logo: true,
            coverImage: true,
          },
        },
        categories: {
          include: {
            category: true,
          },
        },
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                avatar: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 10,
        },
        virtualMeetup: true,
      },
    });

    if (!event) {
      throw new Error('Event not found');
    }

    // Increment view count
    await prisma.event.update({
      where: { id: event.id },
      data: { viewCount: { increment: 1 } },
    });

    // Check if user has this event in wishlist
    let isInWishlist = false;
    if (userId) {
      const wishlistItem = await prisma.wishlistItem.findFirst({
        where: { userId, eventId: event.id },
      });
      isInWishlist = !!wishlistItem;
    }

    return {
      ...event,
      isInWishlist,
    };
  }

  async searchEvents(filters: SearchEventsFilters) {
    const {
      q,
      eventType,
      city,
      country,
      startDate,
      endDate,
      isFree,
      minPrice,
      maxPrice,
      categoryId,
      tags,
      featured,
      latitude,
      longitude,
      radius = 50,
      page = 1,
      limit = 20,
      sortBy = 'startTime',
    } = filters;

    const where: any = {
      status: 'PUBLISHED',
    };

    // Text search
    if (q) {
      where.OR = [
        { title: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
        { tags: { has: q } },
      ];
    }

    // Event type filter
    if (eventType) {
      where.eventType = eventType;
    }

    // Location filters
    if (city) {
      where.city = { contains: city, mode: 'insensitive' };
    }
    if (country) {
      where.country = { contains: country, mode: 'insensitive' };
    }

    // Date filters
    if (startDate) {
      where.startTime = { gte: new Date(startDate) };
    }
    if (endDate) {
      where.endTime = { lte: new Date(endDate) };
    }

    // Price filters
    if (isFree !== undefined) {
      where.isFree = isFree;
    }
    if (minPrice !== undefined) {
      where.basePrice = { ...where.basePrice, gte: minPrice };
    }
    if (maxPrice !== undefined) {
      where.basePrice = { ...where.basePrice, lte: maxPrice };
    }

    // Category filter
    if (categoryId) {
      where.categories = {
        some: {
          categoryId,
        },
      };
    }

    // Tags filter
    if (tags && tags.length > 0) {
      where.tags = { hasSome: tags };
    }

    // Featured filter
    if (featured !== undefined) {
      where.featured = featured;
    }

    // Location-based filtering (bounding box)
    if (latitude !== undefined && longitude !== undefined) {
      const box = getBoundingBox(latitude, longitude, radius);
      where.latitude = { gte: box.minLat, lte: box.maxLat };
      where.longitude = { gte: box.minLon, lte: box.maxLon };
    }

    // Sorting
    const orderBy: any = {};
    switch (sortBy) {
      case 'startTime':
        orderBy.startTime = 'asc';
        break;
      case 'created':
        orderBy.createdAt = 'desc';
        break;
      case 'popular':
        orderBy.viewCount = 'desc';
        break;
      case 'price-low':
        orderBy.basePrice = 'asc';
        break;
      case 'price-high':
        orderBy.basePrice = 'desc';
        break;
      default:
        orderBy.startTime = 'asc';
    }

    // Pagination
    const skip = (page - 1) * limit;
    const take = Math.min(limit, 100); // Max 100 items per page

    const [events, total] = await Promise.all([
      prisma.event.findMany({
        where,
        include: {
          organization: {
            select: {
              id: true,
              name: true,
              slug: true,
              logo: true,
            },
          },
          categories: {
            include: {
              category: true,
            },
          },
          _count: {
            select: {
              bookings: true,
              reviews: true,
            },
          },
        },
        orderBy,
        skip,
        take,
      }),
      prisma.event.count({ where }),
    ]);

    // Calculate distance for each event if location provided
    let eventsWithDistance: (typeof events[0] & { distance: number | null })[] = events as any;
    if (latitude !== undefined && longitude !== undefined) {
      eventsWithDistance = events.map((event) => {
        let distance = null;
        if (event.latitude !== null && event.longitude !== null) {
          distance = calculateDistance(
            latitude,
            longitude,
            event.latitude,
            event.longitude
          );
        }
        return {
          ...event,
          distance,
        };
      });

      // Sort by distance if within radius
      if (sortBy === 'distance') {
        eventsWithDistance.sort((a, b) => {
          if (a.distance === null) return 1;
          if (b.distance === null) return -1;
          return a.distance - b.distance;
        });
      }
    }

    return {
      events: eventsWithDistance,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async deleteEvent(eventId: string) {
    await prisma.event.delete({
      where: { id: eventId },
    });

    return { success: true };
  }

  async getFeaturedEvents(limit: number = 10) {
    const events = await prisma.event.findMany({
      where: {
        status: 'PUBLISHED',
        featured: true,
        startTime: { gte: new Date() },
      },
      include: {
        organization: {
          select: {
            id: true,
            name: true,
            logo: true,
          },
        },
        categories: {
          include: {
            category: true,
          },
        },
      },
      orderBy: {
        viewCount: 'desc',
      },
      take: limit,
    });

    return events;
  }

  async getTrendingEvents(limit: number = 10) {
    const events = await prisma.event.findMany({
      where: {
        status: 'PUBLISHED',
        startTime: { gte: new Date() },
      },
      include: {
        organization: {
          select: {
            id: true,
            name: true,
            logo: true,
          },
        },
        categories: {
          include: {
            category: true,
          },
        },
      },
      orderBy: [
        { viewCount: 'desc' },
        { clickCount: 'desc' },
      ],
      take: limit,
    });

    return events;
  }
}
