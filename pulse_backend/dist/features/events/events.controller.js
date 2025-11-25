import { EventsService } from './events.service.js';
const eventsService = new EventsService();
export class EventsController {
    async createEvent(req, res) {
        try {
            const event = await eventsService.createEvent(req.body, req.user?.userId);
            res.status(201).json({
                success: true,
                message: 'Event created successfully',
                data: event,
            });
        }
        catch (error) {
            res.status(400).json({
                success: false,
                message: error instanceof Error ? error.message : 'Failed to create event',
            });
        }
    }
    async updateEvent(req, res) {
        try {
            const event = await eventsService.updateEvent(req.params.eventId, req.body);
            res.json({
                success: true,
                message: 'Event updated successfully',
                data: event,
            });
        }
        catch (error) {
            res.status(400).json({
                success: false,
                message: error instanceof Error ? error.message : 'Failed to update event',
            });
        }
    }
    async getEvent(req, res) {
        try {
            const event = await eventsService.getEventById(req.params.eventId, req.user?.userId);
            res.json({
                success: true,
                data: event,
            });
        }
        catch (error) {
            res.status(404).json({
                success: false,
                message: error instanceof Error ? error.message : 'Event not found',
            });
        }
    }
    async getEventBySlug(req, res) {
        try {
            const event = await eventsService.getEventBySlug(req.params.slug, req.user?.userId);
            res.json({
                success: true,
                data: event,
            });
        }
        catch (error) {
            res.status(404).json({
                success: false,
                message: error instanceof Error ? error.message : 'Event not found',
            });
        }
    }
    async searchEvents(req, res) {
        try {
            const filters = {
                ...req.query,
                page: req.query.page ? parseInt(req.query.page) : undefined,
                limit: req.query.limit ? parseInt(req.query.limit) : undefined,
                latitude: req.query.latitude
                    ? parseFloat(req.query.latitude)
                    : undefined,
                longitude: req.query.longitude
                    ? parseFloat(req.query.longitude)
                    : undefined,
                radius: req.query.radius
                    ? parseFloat(req.query.radius)
                    : undefined,
                isFree: req.query.isFree === 'true' ? true : req.query.isFree === 'false' ? false : undefined,
                featured: req.query.featured === 'true' ? true : req.query.featured === 'false' ? false : undefined,
                minPrice: req.query.minPrice
                    ? parseFloat(req.query.minPrice)
                    : undefined,
                maxPrice: req.query.maxPrice
                    ? parseFloat(req.query.maxPrice)
                    : undefined,
                tags: req.query.tags
                    ? req.query.tags.split(',')
                    : undefined,
            };
            const result = await eventsService.searchEvents(filters);
            res.json({
                success: true,
                data: result,
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : 'Failed to search events',
            });
        }
    }
    async deleteEvent(req, res) {
        try {
            await eventsService.deleteEvent(req.params.eventId);
            res.json({
                success: true,
                message: 'Event deleted successfully',
            });
        }
        catch (error) {
            res.status(400).json({
                success: false,
                message: error instanceof Error ? error.message : 'Failed to delete event',
            });
        }
    }
    async getFeaturedEvents(req, res) {
        try {
            const limit = req.query.limit ? parseInt(req.query.limit) : 10;
            const events = await eventsService.getFeaturedEvents(limit);
            res.json({
                success: true,
                data: events,
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : 'Failed to fetch featured events',
            });
        }
    }
    async getTrendingEvents(req, res) {
        try {
            const limit = req.query.limit ? parseInt(req.query.limit) : 10;
            const events = await eventsService.getTrendingEvents(limit);
            res.json({
                success: true,
                data: events,
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : 'Failed to fetch trending events',
            });
        }
    }
}
