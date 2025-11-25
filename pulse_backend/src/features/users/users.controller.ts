import { Request, Response } from 'express';
import { UsersService } from './users.service.js';

const usersService = new UsersService();

export class UsersController {
    async getProfile(req: Request, res: Response): Promise<void> {
        try {
            if (!req.user) {
                res.status(401).json({
                    success: false,
                    message: 'Unauthorized',
                });
                return;
            }

            const user = await usersService.getUserById(req.user.userId);

            res.json({
                success: true,
                data: user,
            });
        } catch (error) {
            res.status(404).json({
                success: false,
                message: error instanceof Error ? error.message : 'User not found',
            });
        }
    }

    async updateProfile(req: Request, res: Response): Promise<void> {
        try {
            if (!req.user) {
                res.status(401).json({
                    success: false,
                    message: 'Unauthorized',
                });
                return;
            }

            const user = await usersService.updateProfile(req.user.userId, req.body);

            res.json({
                success: true,
                message: 'Profile updated successfully',
                data: user,
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error instanceof Error ? error.message : 'Failed to update profile',
            });
        }
    }

    async updateNotificationPreferences(req: Request, res: Response): Promise<void> {
        try {
            if (!req.user) {
                res.status(401).json({
                    success: false,
                    message: 'Unauthorized',
                });
                return;
            }

            const preferences = await usersService.updateNotificationPreferences(
                req.user.userId,
                req.body
            );

            res.json({
                success: true,
                message: 'Notification preferences updated',
                data: preferences,
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error instanceof Error ? error.message : 'Failed to update preferences',
            });
        }
    }

    async getBookings(req: Request, res: Response): Promise<void> {
        try {
            if (!req.user) {
                res.status(401).json({
                    success: false,
                    message: 'Unauthorized',
                });
                return;
            }

            const bookings = await usersService.getUserBookings(req.user.userId);

            res.json({
                success: true,
                data: bookings,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : 'Failed to fetch bookings',
            });
        }
    }

    async getRewards(req: Request, res: Response): Promise<void> {
        try {
            if (!req.user) {
                res.status(401).json({
                    success: false,
                    message: 'Unauthorized',
                });
                return;
            }

            const rewards = await usersService.getUserRewards(req.user.userId);

            res.json({
                success: true,
                data: rewards,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : 'Failed to fetch rewards',
            });
        }
    }

    async getNotifications(req: Request, res: Response): Promise<void> {
        try {
            if (!req.user) {
                res.status(401).json({
                    success: false,
                    message: 'Unauthorized',
                });
                return;
            }

            const unreadOnly = req.query.unreadOnly === 'true';
            const notifications = await usersService.getNotifications(req.user.userId, unreadOnly);

            res.json({
                success: true,
                data: notifications,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : 'Failed to fetch notifications',
            });
        }
    }

    async markNotificationAsRead(req: Request, res: Response): Promise<void> {
        try {
            if (!req.user) {
                res.status(401).json({
                    success: false,
                    message: 'Unauthorized',
                });
                return;
            }

            await usersService.markNotificationAsRead(req.user.userId, req.params.notificationId);

            res.json({
                success: true,
                message: 'Notification marked as read',
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error instanceof Error ? error.message : 'Failed to update notification',
            });
        }
    }

    async markAllNotificationsAsRead(req: Request, res: Response): Promise<void> {
        try {
            if (!req.user) {
                res.status(401).json({
                    success: false,
                    message: 'Unauthorized',
                });
                return;
            }

            await usersService.markAllNotificationsAsRead(req.user.userId);

            res.json({
                success: true,
                message: 'All notifications marked as read',
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error instanceof Error ? error.message : 'Failed to update notifications',
            });
        }
    }

    async getWishlist(req: Request, res: Response): Promise<void> {
        try {
            if (!req.user) {
                res.status(401).json({
                    success: false,
                    message: 'Unauthorized',
                });
                return;
            }

            const wishlist = await usersService.getWishlist(req.user.userId);

            res.json({
                success: true,
                data: wishlist,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : 'Failed to fetch wishlist',
            });
        }
    }

    async addToWishlist(req: Request, res: Response): Promise<void> {
        try {
            if (!req.user) {
                res.status(401).json({
                    success: false,
                    message: 'Unauthorized',
                });
                return;
            }

            const { eventId } = req.body;
            const wishlistItem = await usersService.addToWishlist(req.user.userId, eventId);

            res.status(201).json({
                success: true,
                message: 'Event added to wishlist',
                data: wishlistItem,
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error instanceof Error ? error.message : 'Failed to add to wishlist',
            });
        }
    }

    async removeFromWishlist(req: Request, res: Response): Promise<void> {
        try {
            if (!req.user) {
                res.status(401).json({
                    success: false,
                    message: 'Unauthorized',
                });
                return;
            }

            await usersService.removeFromWishlist(req.user.userId, req.params.eventId);

            res.json({
                success: true,
                message: 'Event removed from wishlist',
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error instanceof Error ? error.message : 'Failed to remove from wishlist',
            });
        }
    }
}
