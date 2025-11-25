import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
export class UsersService {
    async getUserById(userId) {
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
    async updateProfile(userId, data) {
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
    async updateNotificationPreferences(userId, preferences) {
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
    async getUserBookings(userId) {
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
    async getUserRewards(userId) {
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
    async getNotifications(userId, unreadOnly = false) {
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
    async markNotificationAsRead(userId, notificationId) {
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
    async markAllNotificationsAsRead(userId) {
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
    async getWishlist(userId) {
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
    async addToWishlist(userId, eventId) {
        const wishlistItem = await prisma.wishlistItem.create({
            data: {
                userId,
                eventId,
            },
        });
        return wishlistItem;
    }
    async removeFromWishlist(userId, eventId) {
        await prisma.wishlistItem.deleteMany({
            where: {
                userId,
                eventId,
            },
        });
        return { success: true };
    }
}
