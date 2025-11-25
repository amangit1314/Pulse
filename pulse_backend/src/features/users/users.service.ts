import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface UpdateProfileData {
    name?: string;
    bio?: string;
    city?: string;
    country?: string;
    latitude?: number;
    longitude?: number;
    radius?: number;
    interests?: string[];
    language?: string;
    timezone?: string;
    currency?: string;
}

export interface UpdateNotificationPreferences {
    emailNotifications?: boolean;
    pushNotifications?: boolean;
    eventReminders?: boolean;
    marketingEmails?: boolean;
}

export class UsersService {
    async getUserById(userId: string) {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                name: true,
                avatar: true,
                bio: true,
                role: true,
                emailVerified: true,
                city: true,
                country: true,
                latitude: true,
                longitude: true,
                radius: true,
                interests: true,
                language: true,
                timezone: true,
                currency: true,
                rewardPoints: true,
                referralCode: true,
                createdAt: true,
                emailNotifications: true,
                pushNotifications: true,
                eventReminders: true,
                marketingEmails: true,
            },
        });

        if (!user) {
            throw new Error('User not found');
        }

        return user;
    }

    async updateProfile(userId: string, data: UpdateProfileData) {
        const user = await prisma.user.update({
            where: { id: userId },
            data,
            select: {
                id: true,
                email: true,
                name: true,
                avatar: true,
                bio: true,
                city: true,
                country: true,
                latitude: true,
                longitude: true,
                radius: true,
                interests: true,
                language: true,
                timezone: true,
                currency: true,
                updatedAt: true,
            },
        });

        return user;
    }

    async updateNotificationPreferences(
        userId: string,
        preferences: UpdateNotificationPreferences
    ) {
        const user = await prisma.user.update({
            where: { id: userId },
            data: preferences,
            select: {
                emailNotifications: true,
                pushNotifications: true,
                eventReminders: true,
                marketingEmails: true,
            },
        });

        return user;
    }

    async getUserBookings(userId: string) {
        const bookings = await prisma.booking.findMany({
            where: { userId },
            include: {
                event: {
                    select: {
                        id: true,
                        title: true,
                        slug: true,
                        coverImage: true,
                        startTime: true,
                        endTime: true,
                        eventType: true,
                        city: true,
                        country: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        return bookings;
    }

    async getUserRewards(userId: string) {
        const rewards = await prisma.reward.findMany({
            where: { userId },
            orderBy: {
                createdAt: 'desc',
            },
        });

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                rewardPoints: true,
            },
        });

        return {
            totalPoints: user?.rewardPoints || 0,
            rewards,
        };
    }

    async getNotifications(userId: string, unreadOnly: boolean = false) {
        const notifications = await prisma.notification.findMany({
            where: {
                userId,
                ...(unreadOnly ? { read: false } : {}),
            },
            orderBy: {
                createdAt: 'desc',
            },
            take: 50,
        });

        return notifications;
    }

    async markNotificationAsRead(userId: string, notificationId: string) {
        const notification = await prisma.notification.findFirst({
            where: {
                id: notificationId,
                userId,
            },
        });

        if (!notification) {
            throw new Error('Notification not found');
        }

        await prisma.notification.update({
            where: { id: notificationId },
            data: { read: true },
        });

        return { success: true };
    }

    async markAllNotificationsAsRead(userId: string) {
        await prisma.notification.updateMany({
            where: {
                userId,
                read: false,
            },
            data: {
                read: true,
            },
        });

        return { success: true };
    }

    async getWishlist(userId: string) {
        const wishlist = await prisma.wishlistItem.findMany({
            where: { userId },
            include: {
                event: {
                    select: {
                        id: true,
                        title: true,
                        slug: true,
                        coverImage: true,
                        shortDescription: true,
                        startTime: true,
                        endTime: true,
                        eventType: true,
                        city: true,
                        country: true,
                        isFree: true,
                        basePrice: true,
                        currency: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        return wishlist;
    }

    async addToWishlist(userId: string, eventId: string) {
        const wishlistItem = await prisma.wishlistItem.create({
            data: {
                userId,
                eventId,
            },
        });

        return wishlistItem;
    }

    async removeFromWishlist(userId: string, eventId: string) {
        await prisma.wishlistItem.deleteMany({
            where: {
                userId,
                eventId,
            },
        });

        return { success: true };
    }
}
